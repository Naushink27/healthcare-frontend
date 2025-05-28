
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from 'redux';

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  user: userReducer,
});


const persistedReducer = persistReducer(persistConfig, rootReducer);

const appStore = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(appStore);
export default appStore;
