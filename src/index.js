import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App';
import * as serviceWorker from './serviceWorker';
import { GlobalProvider } from './app/context/context';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <GlobalProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </GlobalProvider>
  , document.getElementById('root'));

serviceWorker.unregister();