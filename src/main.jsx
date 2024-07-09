import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import DataProvider from './provider/DataProvider.jsx'



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <DataProvider>
          <App />
        </DataProvider>
    </Provider>
  </React.StrictMode>
);
