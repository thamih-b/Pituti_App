/**
 * Reusable error state component for network failures.
 * Shows the error message + an optional retry button.
 */
interface Props {
  message: string;
  onRetry?: () => void;
}

export default function NetworkError({ message, onRetry }: Props) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: '1rem', padding: '3rem 1.5rem',
      textAlign: 'center',
    }}>
      <span style={{ fontSize: '2rem' }}>⚠️</span>
      <p style={{ fontSize: '.875rem', color: 'var(--err)', fontWeight: 700, margin: 0 }}>
        {message}
      </p>
      {onRetry && (
        <button
          className="pf-btn pf-btn--primary"
          onClick={onRetry}
        >
          🔄 Reintentar
        </button>
      )}
    </div>
  );
}
