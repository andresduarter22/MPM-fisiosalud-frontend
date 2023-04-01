import { I18nextProvider } from "react-i18next";
import i18n from "./utils/i18n.js";
import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import './index.css';
import { App } from './components/App.js';

const container = document.getElementById('root');
const root = ReactDOMClient.createRoot(container);
root.render(<I18nextProvider i18n={i18n}>
    <App />
</I18nextProvider>);
