import React from 'react';
import { createRoot, render } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from '../layouts/App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);