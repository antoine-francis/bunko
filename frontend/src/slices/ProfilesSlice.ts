import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ProfilesState, UserProfile} from "../types/UserProfile.ts";
import {loadUserProfile} from "../features/profile/api/load-user-profile.ts";
import {LoadingState} from "../types/StateManagement.ts";

export const fetchProfile = createAsyncThunk<UserProfile | undefined, string>(
	'profile_fetchProfile',
	async (username: string) => {
		return await loadUserProfile(username);
	}
)

const initialState: ProfilesState = {
};

const profilesSlice = createSlice({
	name: 'profiles',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchProfile.pending, (state, action : PayloadAction<LoadingState | undefined>) => {
				const username = (action as any).meta.arg;
				(state[username] as LoadingState) = {loading: true, error: undefined};
			})
			.addCase(fetchProfile.fulfilled, (state, action : PayloadAction<UserProfile | undefined>) => {
				if (action.payload !== undefined) {
					state[action.payload.username] = {...action.payload, loading: false, error: undefined};
				}
			})
			.addCase(fetchProfile.rejected, (state, action) => {
				const username = (action as any).meta.arg;
				state[username].loading = false;
				state[username].error = (action as any).error.message;
			})
	},
});


export default profilesSlice.reducer;