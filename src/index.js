import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './ErrorBoundary';

console.log('index.js is executing');
console.log('Root element:', document.getElementById('root'));

const root = ReactDOM.createRoot(document.getElementById('root'));
console.log('Root created:', root);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

console.log('Render called');
