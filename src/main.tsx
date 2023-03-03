import React from 'react';
import ReactDOM from 'react-dom/client';
import { ServiceProvider, services } from './app/services';
import { Root } from './app/ui/Root';
import './app/ui/styles/main.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ServiceProvider value={services}>
      <Root />
    </ServiceProvider>
  </React.StrictMode>,
);
