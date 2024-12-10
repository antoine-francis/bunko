import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {UserBadge, UserState} from "../types/UserProfile.ts";


const initialState: UserState = {
	user: undefined,
	loaded: false,
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		loadUser: (state) => {
			state.loaded = false;
		},
		login: (state, action: PayloadAction<UserBadge>) => {
			state.user = action.payload;
			state.loaded = true;
		},
		setUser: (state, action: PayloadAction<UserBadge>) => {
			state.user = action.payload;
			state.loaded = true;
		},
		logout: (state) => {
			state.user = undefined;
			state.loaded = true;
		},
	},
});

export const { loadUser, login, setUser, logout } = userSlice.actions;

export default userSlice.reducer;