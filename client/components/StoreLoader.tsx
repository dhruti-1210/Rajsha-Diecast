export default function StoreLoader({
  message,
  className = '',
}: {
  message: string;
  className?: string;
}) {
  return (
    <div className={`store-loader${className ? ` ${className}` : ''}`} role="status" aria-live="polite">
      <span className="store-loader-spinner" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
