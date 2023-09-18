import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import './assets/main.css'
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';

const root = ReactDOM.createRoot(document.getElementById('root'));

const theme = createTheme();

root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <App />
            <ToastContainer />
        </ThemeProvider>
    </React.StrictMode>

);