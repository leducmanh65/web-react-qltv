import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
// Đảm bảo import file CSS toàn cục ở đây
<<<<<<< Updated upstream
import './loginAndRegis/globals.css'; 
=======
import './styles/Login/auth.css'; 
import './styles/Admin/global.css';
import './styles/User/globals.css';


>>>>>>> Stashed changes

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);