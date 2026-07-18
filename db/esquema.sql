-- =============================================================================
-- App de gestion D&D -- Esquema de Base de Datos (Supabase / PostgreSQL)
-- Paso 1: Tablas, relaciones, tipos JSONB, triggers y politicas RLS.
--
-- Convenciones:
--   - Todas las tablas de dominio viven en el esquema `public`.
--   - `perfiles` extiende `auth.users` 1:1 (se crea automaticamente al registrarse).
--   - Los campos calculables de una ficha (PV, CA, bono de competencia, espacios
--     de conjuro) se guardan como JSONB con una sub-clave `anulacion` para
--     soportar el modo Homebrew/Manual exigido en los requisitos.
--   - RLS esta activo en todas las tablas; no hay acceso por defecto.
--   - Los identificadores evitan tildes y enies a proposito (compatibilidad).
-- =============================================================================

create extension if not exists pgcrypto;

-- =============================================================================
-- 1. TIPOS ENUMERADOS
-- =============================================================================

create type public.rol_cuenta as enum ('jugador', 'master');
create type public.rol_miembro as enum ('master', 'jugador');
create type public.metodo_caracteristicas as enum ('compra_puntos', 'arreglo_estandar', 'tirada_dados', 'manual');
create type public.modo_subida_vida as enum ('fijo', 'tirada', 'manual');
create type public.variante_descanso as enum ('estandar', 'realista_duro', 'heroico');

-- =============================================================================
-- 2. FUNCIONES DE SOPORTE (fecha de modificacion, alta de usuario, codigo de invitacion)
-- =============================================================================

create or replace function public.actualizar_fecha_modificacion()
returns trigger
language plpgsql
as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$;

create or replace function public.generar_codigo_invitacion()
returns text
language sql
as $$
  select upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
$$;

-- Crea automaticamente el perfil publico al registrarse en Supabase Auth.
-- Espera `nombre_usuario`, `nombre_visible` y `rol_cuenta` en raw_user_meta_data
-- (enviados desde el formulario de registro Jugador/Master del frontend).
create or replace function public.gestionar_usuario_nuevo()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.perfiles (id, nombre_usuario, nombre_visible, rol_cuenta)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre_usuario', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'nombre_visible',
    coalesce((new.raw_user_meta_data->>'rol_cuenta')::public.rol_cuenta, 'jugador')
  );
  return new;
end;
$$;

create trigger al_crear_usuario
  after insert on auth.users
  for each row execute function public.gestionar_usuario_nuevo();

-- =============================================================================
-- 3. PERFILES
-- =============================================================================

create table public.perfiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre_usuario text not null unique,
  nombre_visible text,
  url_avatar text,
  rol_cuenta public.rol_cuenta not null default 'jugador',
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create trigger perfiles_actualizar_fecha
  before update on public.perfiles
  for each row execute function public.actualizar_fecha_modificacion();

-- =============================================================================
-- 4. PARTIDAS
-- =============================================================================

create table public.partidas (
  id uuid primary key default gen_random_uuid(),
  master_id uuid not null references public.perfiles(id) on delete cascade,
  nombre text not null,
  descripcion text,
  codigo_invitacion text not null unique default public.generar_codigo_invitacion(),
  esta_activa boolean not null default true,

  -- Reglas de partida flexibles (ver requisito "Selector de Reglas Flexibles").
  configuracion jsonb not null default '{
    "modo_subida_vida": "fijo",
    "variante_descanso": "estandar",
    "multiclase_habilitada": true,
    "metodo_caracteristicas": "compra_puntos"
  }'::jsonb,

  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create index partidas_master_id_idx on public.partidas(master_id);

create trigger partidas_actualizar_fecha
  before update on public.partidas
  for each row execute function public.actualizar_fecha_modificacion();

-- =============================================================================
-- 5. PERSONAJES
-- =============================================================================

create table public.personajes (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.perfiles(id) on delete cascade,
  partida_id uuid references public.partidas(id) on delete set null,

  nombre text not null,
  raza text not null,
  subraza text,
  clase text not null,
  subclase text,
  trasfondo text,
  alineamiento text,
  url_avatar text,
  notas text,

  nivel integer not null default 1 check (nivel between 1 and 20),
  puntos_experiencia integer not null default 0 check (puntos_experiencia >= 0),

  es_multiclase boolean not null default false,
  -- [{ "clase": "guerrero", "subclase": "caballero arcano", "nivel": 3 }, ...]
  niveles_multiclase jsonb not null default '[]'::jsonb,

  metodo_caracteristicas public.metodo_caracteristicas not null default 'compra_puntos',
  -- Cada caracteristica guarda su valor base y una anulacion manual opcional (Homebrew).
  caracteristicas jsonb not null default '{
    "fue": {"base": 10, "anulacion": null},
    "des": {"base": 10, "anulacion": null},
    "con": {"base": 10, "anulacion": null},
    "int": {"base": 10, "anulacion": null},
    "sab": {"base": 10, "anulacion": null},
    "car": {"base": 10, "anulacion": null}
  }'::jsonb,

  -- Historial de vida por nivel + modo de subida + anulacion global.
  puntos_vida jsonb not null default '{
    "maximo": 0,
    "actual": 0,
    "temporales": 0,
    "modo_subida": "fijo",
    "por_nivel": [],
    "anulacion": {"activada": false, "valor": null}
  }'::jsonb,

  clase_armadura jsonb not null default '{
    "equipado": [],
    "anulacion": {"activada": false, "valor": null}
  }'::jsonb,

  bono_competencia jsonb not null default '{
    "anulacion": {"activada": false, "valor": null}
  }'::jsonb,

  percepcion_pasiva jsonb not null default '{
    "anulacion": {"activada": false, "valor": null}
  }'::jsonb,

  competencias_salvacion text[] not null default '{}',
  -- { "competente": ["percepcion", ...], "pericia": ["sigilo", ...] }
  competencias_habilidad jsonb not null default '{"competente": [], "pericia": []}'::jsonb,

  -- { "espacios": [4,3,0,...], "espacios_pacto": {"espacios":2,"nivel_espacio":1}, "anulacion": {...} }
  espacios_conjuro jsonb not null default '{
    "espacios": [],
    "espacios_pacto": null,
    "anulacion": {"activada": false, "valor": null}
  }'::jsonb,
  conjuros_conocidos jsonb not null default '[]'::jsonb,

  inventario jsonb not null default '[]'::jsonb,
  monedas jsonb not null default '{"pc": 0, "pp": 0, "pe": 0, "po": 0, "pt": 0}'::jsonb,
  rasgos jsonb not null default '[]'::jsonb,
  condiciones text[] not null default '{}',

  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create index personajes_usuario_id_idx on public.personajes(usuario_id);
create index personajes_partida_id_idx on public.personajes(partida_id);

create trigger personajes_actualizar_fecha
  before update on public.personajes
  for each row execute function public.actualizar_fecha_modificacion();

-- =============================================================================
-- 6. MIEMBROS_PARTIDA
-- =============================================================================

create table public.miembros_partida (
  id uuid primary key default gen_random_uuid(),
  partida_id uuid not null references public.partidas(id) on delete cascade,
  usuario_id uuid not null references public.perfiles(id) on delete cascade,
  rol public.rol_miembro not null default 'jugador',
  personaje_id uuid references public.personajes(id) on delete set null,
  unido_en timestamptz not null default now(),
  unique (partida_id, usuario_id)
);

create index miembros_partida_partida_id_idx on public.miembros_partida(partida_id);
create index miembros_partida_usuario_id_idx on public.miembros_partida(usuario_id);

-- RPC para unirse a una partida por codigo de invitacion sin exponer
-- la tabla `partidas` completa a usuarios que todavia no son miembros.
create or replace function public.unirse_a_partida_por_codigo(p_codigo_invitacion text)
returns public.partidas
language plpgsql
security definer set search_path = public
as $$
declare
  v_partida public.partidas;
begin
  select * into v_partida
  from public.partidas
  where codigo_invitacion = upper(p_codigo_invitacion) and esta_activa = true;

  if v_partida.id is null then
    raise exception 'Codigo de invitacion invalido o partida inactiva';
  end if;

  insert into public.miembros_partida (partida_id, usuario_id, rol)
  values (v_partida.id, auth.uid(), 'jugador')
  on conflict (partida_id, usuario_id) do nothing;

  return v_partida;
end;
$$;

grant execute on function public.unirse_a_partida_por_codigo(text) to authenticated;

-- =============================================================================
-- 7. MONSTRUOS (Bestiario SRD + Creador de Statblocks)
-- =============================================================================

create table public.monstruos (
  id uuid primary key default gen_random_uuid(),
  propietario_id uuid references public.perfiles(id) on delete cascade,
  partida_id uuid references public.partidas(id) on delete set null,
  es_srd boolean not null default false,

  nombre text not null,
  tamano text not null,
  tipo text not null,
  subtipo text,
  alineamiento text,

  clase_armadura jsonb not null default '{"valor": 10, "notas": null}'::jsonb,
  puntos_vida jsonb not null default '{"promedio": 0, "formula": null, "actual": null}'::jsonb,
  velocidad jsonb not null default '{"caminar": 30}'::jsonb,
  caracteristicas jsonb not null default '{"fue":10,"des":10,"con":10,"int":10,"sab":10,"car":10}'::jsonb,
  salvaciones jsonb not null default '{}'::jsonb,
  habilidades jsonb not null default '{}'::jsonb,

  vulnerabilidades_dano text[] not null default '{}',
  resistencias_dano text[] not null default '{}',
  inmunidades_dano text[] not null default '{}',
  inmunidades_condicion text[] not null default '{}',
  sentidos text,
  idiomas text,

  nivel_desafio numeric not null default 0 check (nivel_desafio >= 0),
  px integer not null default 0 check (px >= 0),

  habilidades_especiales jsonb not null default '[]'::jsonb,
  acciones jsonb not null default '[]'::jsonb,
  acciones_legendarias jsonb not null default '[]'::jsonb,
  reacciones jsonb not null default '[]'::jsonb,

  fuente text,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),

  check (es_srd = false or propietario_id is null)
);

create index monstruos_propietario_id_idx on public.monstruos(propietario_id);
create index monstruos_partida_id_idx on public.monstruos(partida_id);
create index monstruos_es_srd_idx on public.monstruos(es_srd);

create trigger monstruos_actualizar_fecha
  before update on public.monstruos
  for each row execute function public.actualizar_fecha_modificacion();

-- Nota: los monstruos oficiales del SRD (es_srd = true, propietario_id null)
-- se insertan mediante un script de seed con la service_role key, que ignora RLS.

-- =============================================================================
-- 8. REGLAS_PERSONALIZADAS (Reglas caseras por partida)
-- =============================================================================

create table public.reglas_personalizadas (
  id uuid primary key default gen_random_uuid(),
  partida_id uuid not null references public.partidas(id) on delete cascade,
  creado_por uuid not null references public.perfiles(id) on delete cascade,
  clave_regla text not null,
  titulo text not null,
  descripcion text,
  valor_regla jsonb not null default '{}'::jsonb,
  esta_activa boolean not null default true,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  unique (partida_id, clave_regla)
);

create index reglas_personalizadas_partida_id_idx on public.reglas_personalizadas(partida_id);

create trigger reglas_personalizadas_actualizar_fecha
  before update on public.reglas_personalizadas
  for each row execute function public.actualizar_fecha_modificacion();

-- =============================================================================
-- 9. ENCUENTROS / PARTICIPANTES_ENCUENTRO (Tracker de iniciativa persistente)
-- =============================================================================

create table public.encuentros (
  id uuid primary key default gen_random_uuid(),
  partida_id uuid not null references public.partidas(id) on delete cascade,
  nombre text not null default 'Encuentro',
  ronda integer not null default 1,
  participante_activo_id uuid,
  esta_activo boolean not null default true,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create trigger encuentros_actualizar_fecha
  before update on public.encuentros
  for each row execute function public.actualizar_fecha_modificacion();

create table public.participantes_encuentro (
  id uuid primary key default gen_random_uuid(),
  encuentro_id uuid not null references public.encuentros(id) on delete cascade,
  personaje_id uuid references public.personajes(id) on delete cascade,
  monstruo_id uuid references public.monstruos(id) on delete cascade,

  nombre_visible text not null,
  iniciativa integer not null default 0,
  orden_turno integer not null default 0,
  pv_actual integer,
  pv_maximo integer,
  clase_armadura integer,
  condiciones text[] not null default '{}',
  visible_para_jugadores boolean not null default true,

  creado_en timestamptz not null default now(),

  check (
    (personaje_id is not null and monstruo_id is null) or
    (personaje_id is null and monstruo_id is not null)
  )
);

create index participantes_encuentro_encuentro_id_idx on public.participantes_encuentro(encuentro_id);

-- =============================================================================
-- 10. TIRADAS_DADOS (Historial de tiradas del lanzador de dados)
-- =============================================================================

create table public.tiradas_dados (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.perfiles(id) on delete cascade,
  partida_id uuid references public.partidas(id) on delete set null,
  personaje_id uuid references public.personajes(id) on delete set null,

  notacion text not null,
  resultados integer[] not null,
  modificador integer not null default 0,
  total integer not null,
  etiqueta text,

  creado_en timestamptz not null default now()
);

create index tiradas_dados_partida_id_idx on public.tiradas_dados(partida_id);
create index tiradas_dados_usuario_id_idx on public.tiradas_dados(usuario_id);

-- =============================================================================
-- 11. ROW LEVEL SECURITY
-- =============================================================================

alter table public.perfiles enable row level security;
alter table public.partidas enable row level security;
alter table public.personajes enable row level security;
alter table public.miembros_partida enable row level security;
alter table public.monstruos enable row level security;
alter table public.reglas_personalizadas enable row level security;
alter table public.encuentros enable row level security;
alter table public.participantes_encuentro enable row level security;
alter table public.tiradas_dados enable row level security;

-- ---- perfiles -----------------------------------------------------------

create policy "perfiles_seleccionar_autenticados"
  on public.perfiles for select
  to authenticated
  using (true);

create policy "perfiles_actualizar_propio"
  on public.perfiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- ---- partidas ------------------------------------------------------------

create policy "partidas_seleccionar_miembros"
  on public.partidas for select
  to authenticated
  using (
    master_id = auth.uid()
    or exists (
      select 1 from public.miembros_partida mp
      where mp.partida_id = partidas.id and mp.usuario_id = auth.uid()
    )
  );

create policy "partidas_insertar_como_master"
  on public.partidas for insert
  to authenticated
  with check (master_id = auth.uid());

create policy "partidas_actualizar_propia"
  on public.partidas for update
  to authenticated
  using (master_id = auth.uid())
  with check (master_id = auth.uid());

create policy "partidas_eliminar_propia"
  on public.partidas for delete
  to authenticated
  using (master_id = auth.uid());

-- ---- miembros_partida -----------------------------------------------------

create policy "miembros_partida_seleccionar"
  on public.miembros_partida for select
  to authenticated
  using (
    usuario_id = auth.uid()
    or exists (
      select 1 from public.partidas p
      where p.id = miembros_partida.partida_id and p.master_id = auth.uid()
    )
    or exists (
      select 1 from public.miembros_partida propio
      where propio.partida_id = miembros_partida.partida_id and propio.usuario_id = auth.uid()
    )
  );

create policy "miembros_partida_gestionar_master"
  on public.miembros_partida for all
  to authenticated
  using (
    exists (select 1 from public.partidas p where p.id = miembros_partida.partida_id and p.master_id = auth.uid())
  )
  with check (
    exists (select 1 from public.partidas p where p.id = miembros_partida.partida_id and p.master_id = auth.uid())
  );

create policy "miembros_partida_abandonar"
  on public.miembros_partida for delete
  to authenticated
  using (usuario_id = auth.uid());

-- ---- personajes -------------------------------------------------------------

create policy "personajes_seleccionar"
  on public.personajes for select
  to authenticated
  using (
    usuario_id = auth.uid()
    or exists (
      select 1 from public.partidas p
      where p.id = personajes.partida_id and p.master_id = auth.uid()
    )
    or exists (
      select 1 from public.miembros_partida mp
      where mp.partida_id = personajes.partida_id and mp.usuario_id = auth.uid()
    )
  );

create policy "personajes_insertar_propio"
  on public.personajes for insert
  to authenticated
  with check (usuario_id = auth.uid());

create policy "personajes_actualizar_propio"
  on public.personajes for update
  to authenticated
  using (usuario_id = auth.uid())
  with check (usuario_id = auth.uid());

-- El master puede actualizar (p. ej. vida actual/condiciones en combate) los
-- personajes vinculados a sus propias partidas.
create policy "personajes_actualizar_por_master"
  on public.personajes for update
  to authenticated
  using (
    exists (select 1 from public.partidas p where p.id = personajes.partida_id and p.master_id = auth.uid())
  )
  with check (
    exists (select 1 from public.partidas p where p.id = personajes.partida_id and p.master_id = auth.uid())
  );

create policy "personajes_eliminar_propio"
  on public.personajes for delete
  to authenticated
  using (usuario_id = auth.uid());

-- ---- monstruos ---------------------------------------------------------------

create policy "monstruos_seleccionar"
  on public.monstruos for select
  to authenticated
  using (
    es_srd = true
    or propietario_id = auth.uid()
    or exists (
      select 1 from public.miembros_partida mp
      where mp.partida_id = monstruos.partida_id and mp.usuario_id = auth.uid()
    )
    or exists (
      select 1 from public.partidas p where p.id = monstruos.partida_id and p.master_id = auth.uid()
    )
  );

create policy "monstruos_insertar_propio"
  on public.monstruos for insert
  to authenticated
  with check (propietario_id = auth.uid() and es_srd = false);

create policy "monstruos_actualizar_propio"
  on public.monstruos for update
  to authenticated
  using (propietario_id = auth.uid() and es_srd = false)
  with check (propietario_id = auth.uid() and es_srd = false);

create policy "monstruos_eliminar_propio"
  on public.monstruos for delete
  to authenticated
  using (propietario_id = auth.uid() and es_srd = false);

-- ---- reglas_personalizadas -------------------------------------------------------------

create policy "reglas_personalizadas_seleccionar"
  on public.reglas_personalizadas for select
  to authenticated
  using (
    exists (select 1 from public.partidas p where p.id = reglas_personalizadas.partida_id and p.master_id = auth.uid())
    or exists (select 1 from public.miembros_partida mp where mp.partida_id = reglas_personalizadas.partida_id and mp.usuario_id = auth.uid())
  );

create policy "reglas_personalizadas_gestionar_master"
  on public.reglas_personalizadas for all
  to authenticated
  using (exists (select 1 from public.partidas p where p.id = reglas_personalizadas.partida_id and p.master_id = auth.uid()))
  with check (exists (select 1 from public.partidas p where p.id = reglas_personalizadas.partida_id and p.master_id = auth.uid()));

-- ---- encuentros / participantes_encuentro ---------------------------------------

create policy "encuentros_seleccionar"
  on public.encuentros for select
  to authenticated
  using (
    exists (select 1 from public.partidas p where p.id = encuentros.partida_id and p.master_id = auth.uid())
    or exists (select 1 from public.miembros_partida mp where mp.partida_id = encuentros.partida_id and mp.usuario_id = auth.uid())
  );

create policy "encuentros_gestionar_master"
  on public.encuentros for all
  to authenticated
  using (exists (select 1 from public.partidas p where p.id = encuentros.partida_id and p.master_id = auth.uid()))
  with check (exists (select 1 from public.partidas p where p.id = encuentros.partida_id and p.master_id = auth.uid()));

create policy "participantes_encuentro_seleccionar"
  on public.participantes_encuentro for select
  to authenticated
  using (
    exists (
      select 1 from public.encuentros e
      join public.partidas p on p.id = e.partida_id
      where e.id = participantes_encuentro.encuentro_id
        and (
          p.master_id = auth.uid()
          or exists (select 1 from public.miembros_partida mp where mp.partida_id = p.id and mp.usuario_id = auth.uid())
        )
    )
  );

create policy "participantes_encuentro_gestionar_master"
  on public.participantes_encuentro for all
  to authenticated
  using (
    exists (
      select 1 from public.encuentros e
      join public.partidas p on p.id = e.partida_id
      where e.id = participantes_encuentro.encuentro_id and p.master_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.encuentros e
      join public.partidas p on p.id = e.partida_id
      where e.id = participantes_encuentro.encuentro_id and p.master_id = auth.uid()
    )
  );

-- ---- tiradas_dados -----------------------------------------------------------------

create policy "tiradas_dados_seleccionar"
  on public.tiradas_dados for select
  to authenticated
  using (
    usuario_id = auth.uid()
    or (
      partida_id is not null and (
        exists (select 1 from public.partidas p where p.id = tiradas_dados.partida_id and p.master_id = auth.uid())
        or exists (select 1 from public.miembros_partida mp where mp.partida_id = tiradas_dados.partida_id and mp.usuario_id = auth.uid())
      )
    )
  );

create policy "tiradas_dados_insertar_propia"
  on public.tiradas_dados for insert
  to authenticated
  with check (usuario_id = auth.uid());

create policy "tiradas_dados_eliminar_propia"
  on public.tiradas_dados for delete
  to authenticated
  using (usuario_id = auth.uid());
