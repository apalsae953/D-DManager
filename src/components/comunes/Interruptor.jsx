export function Interruptor({ activado, alCambiar, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={activado}
      disabled={disabled}
      onClick={() => alCambiar(!activado)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
        activado ? 'bg-amber-600' : 'bg-stone-300'
      } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
          activado ? 'translate-x-[18px]' : 'translate-x-1'
        }`}
      />
    </button>
  );
}
