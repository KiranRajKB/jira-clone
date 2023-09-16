import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ToastContainer } from 'react-toastify';
import Modal from 'react-modal';


const root = ReactDOM.createRoot(document.getElementById('root'));


// Modal.setAppElement(root);
root.render(
  <React.StrictMode>
    <App />
    <ToastContainer />
  </React.StrictMode>
);


