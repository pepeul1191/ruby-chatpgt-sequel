import React from 'react';
import { createRoot, render } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../assets/css/styles.css'; 
import '../assets/css/error.css'; 
import Error from '../layouts/Error';

const root = createRoot(document.getElementById('root'));
root.render(<Error />);