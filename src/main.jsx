import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import appStore from './utils/appStore';
import './index.css';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from './utils/appStore';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={appStore}>
    <BrowserRouter>
     <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
    </BrowserRouter>
  </Provider>
);