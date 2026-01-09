import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../redux/auth/authSlice";
import { modalReducer } from "../redux/modal/modalSlice";


const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["token"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
   modal: modalReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
