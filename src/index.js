import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import store from './redux/store';
import App from './App';
import './font.css';

const defaultTheme = createTheme({
  typography: {
    fontFamily: 'Cervo Neue Regular',
    fontSize: 18,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);
