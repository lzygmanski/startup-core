import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { ShellApp } from './shell-app';
import './styles.css';

const container = document.getElementById('root');

if (container === null) {
  throw new Error('Shell root element was not found.');
}

createRoot(container).render(
  <StrictMode>
    <ShellApp />
  </StrictMode>,
);
