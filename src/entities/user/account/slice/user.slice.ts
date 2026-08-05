import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

import { ENUM_LOCAL_STORAGE } from "@/shared/config/constants/local-storage.config";
import { storage } from "@/shared/lib/storage";

type TUserState = {
	isAuth: boolean;
};

const initialState: TUserState = {
	isAuth: storage.get<boolean>(ENUM_LOCAL_STORAGE.IS_AUTH, false)
};

export const userSlice = createSlice({
	name: "userSlice",
	initialState,
	reducers: {
		login: (state) => {
			storage.set(ENUM_LOCAL_STORAGE.IS_AUTH, true);
			state.isAuth = true;
		},
		logout: (state) => {
			storage.set(ENUM_LOCAL_STORAGE.IS_AUTH, false);
			state.isAuth = false;
		},
		setAuth: (state, action: PayloadAction<boolean>) => {
			storage.set(ENUM_LOCAL_STORAGE.IS_AUTH, action.payload);
			state.isAuth = action.payload;
		}
	}
});

export const { login, logout, setAuth } = userSlice.actions;
export const userReducer = userSlice.reducer;
export default userSlice.reducer;
