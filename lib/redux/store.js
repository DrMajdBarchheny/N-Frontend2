import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';

// Create store with Redux Toolkit
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
});

export default store; 