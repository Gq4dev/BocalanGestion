export function Loader({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-8 ${className}`} role="status" aria-label="Cargando">
      <span
        className="h-10 w-10 animate-spin rounded-full border-2 border-yellow-400 border-t-transparent"
        aria-hidden
      />
      <span className="text-sm text-neutral-500">Cargando…</span>
    </div>
  );
}
