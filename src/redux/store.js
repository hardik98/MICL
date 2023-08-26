import { configureStore } from '@reduxjs/toolkit';
import { playersApi } from './api/playersApi';

const store = configureStore({
  reducer: {
    [playersApi.reducerPath]: playersApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(playersApi.middleware),
});

export default store;
