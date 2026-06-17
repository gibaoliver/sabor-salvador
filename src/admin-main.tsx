import React from 'react';
import { createRoot } from 'react-dom/client';
import AdminApp from './AdminApp';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AdminApp />
    </React.StrictMode>
  );
}
