import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
// Đảm bảo import file CSS toàn cục ở đây
import './styles/auth.css'; 
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);