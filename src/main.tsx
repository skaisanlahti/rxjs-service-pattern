import { enableMapSet } from 'immer';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ServiceProvider,
  createServices,
} from './app/app-layer/create-services';
import { Root } from './app/ui-layer/Root';
import './app/ui-layer/styles/main.css';

enableMapSet();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ServiceProvider value={createServices()}>
      <Root />
    </ServiceProvider>
  </React.StrictMode>,
);
