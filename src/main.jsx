import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import PortfolioSimulator from './PortfolioSimulator.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PortfolioSimulator />
  </StrictMode>,
);
