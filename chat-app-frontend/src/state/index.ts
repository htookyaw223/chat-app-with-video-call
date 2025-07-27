import { configureStore } from "@reduxjs/toolkit";
import { authAPi } from "../reduxtoolkit/authApi";

export const store = configureStore({
  reducer: {
    [authAPi.reducerPath]: authAPi.reducer,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat(authAPi.middleware);
  },
});
