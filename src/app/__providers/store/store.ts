import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { baseApi } from "@/shared/api";

import { authApi } from "@/entities/auth";
import { userSlice } from "@/entities/user";

const rootReducer = combineReducers({
	[baseApi.reducerPath]: baseApi.reducer,
	[authApi.reducerPath]: authApi.reducer,
	[userSlice.reducerPath]: userSlice.reducer
});

export const setupStore = () => {
	return configureStore({
		reducer: rootReducer,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().concat(
				baseApi.middleware,
				authApi.middleware
			)
	});
};

export const store = setupStore();

setupListeners(store.dispatch);

export type TRootState = ReturnType<typeof rootReducer>;
export type TAppStore = ReturnType<typeof setupStore>;
export type TAppDispatch = TAppStore["dispatch"];
