import { configureStore } from "@reduxjs/toolkit";
import spinnerSlice from "../reducers/spinnerSlice";

const store = configureStore({
  reducer: {
    spinner: spinnerSlice
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;