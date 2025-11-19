import DomeGallery from './DomeGallery';
import './App.css';

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <DomeGallery grayscale={false} />
    </div>
  );
}
