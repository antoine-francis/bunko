import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {SignupForm, UserBadge, UserPwdPair, UserState} from "../types/UserProfile.ts";
import {attemptLogin, attemptLogout, attemptSignup, checkSession} from "../features/auth/api/auth.ts";
import {updateProfile} from "./ProfilesSlice.ts";


export const fetchUser = createAsyncThunk<UserBadge | undefined>(
	'user_fetchUser',
	async () => {
		return await checkSession();
	}
)

export const login = createAsyncThunk<UserBadge | undefined, UserPwdPair>(
	'user_login',
	async ({username, password}) => {
		return await attemptLogin(username, password);
	}
)

export const register = createAsyncThunk<UserBadge | undefined, SignupForm>(
	'user_register',
	async ({username, email, firstName, lastName, password}) => {
		return await attemptSignup(username, email, firstName, lastName, password);
	}
)

export const logout = createAsyncThunk<void>(
	'user_tryLogout',
	async () => {
		return await attemptLogout();
	}
)

const initialState: UserState = {
	user: undefined,
	loading: true,
	error: undefined,
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchUser.pending, (state) => {
				state.loading = true;
				state.error = undefined;
			})
			.addCase(fetchUser.fulfilled, (state, action : PayloadAction<UserBadge | undefined>) => {
				state.loading = false;
				state.error = undefined;
				state.user = action.payload
			})
			.addCase(fetchUser.rejected, (state, action) => {
				state.loading = false;
				state.error = (action as any).error.message;
				state.user = undefined;
			})
			.addCase(logout.pending, (state) => {
				state.loading = true;
				state.error = undefined;
			})
			.addCase(logout.fulfilled, (state) => {
				state.loading = false;
				state.error = undefined;
				state.user = undefined;
				location.reload();
			})
			.addCase(logout.rejected, (state) => {
				// The logout action is fulfilled regardless of errors
				state.loading = false;
				state.error = undefined;
				state.user = undefined;
			})
			.addCase(login.pending, (state) => {
				state.loading = true;
				state.error = undefined;
			})
			.addCase(login.fulfilled, (state, action : PayloadAction<UserBadge | undefined>) => {
				state.loading = false;
				state.error = undefined;
				state.user = action.payload;
			})
			.addCase(login.rejected, (state, action) => {
				state.loading = false;
				state.error = (action as any).error.message;
				state.user = undefined;
			})
			.addCase(register.pending, (state) => {
				state.loading = true;
				state.error = undefined;
			})
			.addCase(register.fulfilled, (state, action : PayloadAction<UserBadge | undefined>) => {
				state.loading = false;
				state.error = undefined;
				state.user = action.payload;
			})
			.addCase(register.rejected, (state, action) => {
				state.loading = false;
				state.error = (action as any).error.message;
				state.user = undefined;
			})
			.addCase(updateProfile.fulfilled, (state, action : PayloadAction<UserBadge | undefined>) => {
				if (action.payload !== undefined) {
					state.user = {
						firstName: action.payload.firstName,
						lastName: action.payload.lastName,
						username: action.payload.username,
						email: action.payload.email,
						picture: action.payload.picture
					}
				}
			})
	}
});

export default userSlice.reducer;