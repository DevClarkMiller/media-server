import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

//Context providers
import { LoginProvider } from './context/LoginContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route path='/*' element={
        <LoginProvider>
          <App />
        </LoginProvider>
      }/>
    </Routes>
  </Router>
);
