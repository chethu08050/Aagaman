import './LoadingFallback.css';

export default function LoadingFallback({ minHeight = '100vh' }) {
  return (
    <div className="loading-fallback" style={{ minHeight }}>
      <div className="loading-spinner"></div>
    </div>
  );
}
