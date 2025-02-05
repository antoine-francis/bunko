import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ProfilesState, Subscription, UserBadge, UserProfile} from "../types/UserProfile.ts";
import {loadUserProfile, updateUserProfile} from "../features/profile/api/load-user-profile.ts";
import {LoadingState} from "../types/StateManagement.ts";
import {subscribeToProfile, unsubscribeToProfile} from "../features/followers/api/followers.ts";

export const fetchProfile = createAsyncThunk<UserProfile | undefined, string>(
	'profile_fetchProfile',
	async (username: string) => {
		return await loadUserProfile(username);
	}
)

export const updateProfile = createAsyncThunk<UserBadge | undefined, FormData>(
	'profile_updateProfile',
	async (formData: FormData) => {
		return await updateUserProfile(formData);
	}
)

export const subscribe = createAsyncThunk(
	'profile_subscribe',
	async (profile : UserProfile) => {
		return await subscribeToProfile(profile);
	}
)

export const unsubscribe = createAsyncThunk(
	'profile_unsubscribe',
	async (profile : UserProfile) => {
		return await unsubscribeToProfile(profile);
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
			.addCase(updateProfile.pending, (state, action : PayloadAction<LoadingState | undefined>) => {
				// const username = (action as any).meta.arg.get('username');
				const username = (action as any).meta.arg.get("formerUsername");
				if (state[username] !== undefined) {
					state[username].loading = true;
					state[username].error = undefined;
				} else {
					(state[username] as LoadingState) = {loading: true, error: undefined};
				}
			})
			.addCase(updateProfile.fulfilled, (state, action : PayloadAction<UserBadge | undefined>) => {
				if (action !== undefined) {
					const username = (action as any).meta.arg.get("username");
					const formerUsername = (action as any).meta.arg.get("formerUsername");
					if (action.payload !== undefined) {
						if (action.payload.username !== formerUsername) {
							state[action.payload.username] = Object.assign({}, state[formerUsername], {
								loading: false,
								error: undefined,
								firstName: action.payload.firstName,
								lastName: action.payload.lastName,
								picture: action.payload.picture
							});
							delete state[formerUsername]
						} else {
							state[username] = {
								...state[username],
								loading: false,
								error: undefined,
								firstName: action.payload.firstName,
								lastName: action.payload.lastName,
								picture: action.payload.picture
							};
						}
					}
				}
			})
			.addCase(updateProfile.rejected, (state, action) => {
				const username = (action as any).meta.arg.get("formerUsername");
				if (state[username] !== undefined) {
					state[username].loading = false;
					state[username].error = (action as any).error.message;
				} else {
					(state[username] as LoadingState) = {loading: false, error: (action as any).error.message};
				}

			})
			.addCase(subscribe.pending, (state, action : PayloadAction<LoadingState | undefined>) => {
				const username = (action as any).meta.arg;
				(state[username] as LoadingState) = {loading: true, error: undefined};
			})
			.addCase(subscribe.fulfilled, (state, action : PayloadAction<Subscription | undefined>) => {
				if (action.payload !== undefined) {
					const {username} = (action as any).meta.arg;
					state[username].followers = state[username].followers.concat(action.payload);
				}
			})
			.addCase(subscribe.rejected, (state, action) => {
				const username = (action as any).meta.arg;
				state[username].loading = false;
				state[username].error = (action as any).error.message;
			})
			.addCase(unsubscribe.pending, (state, action : PayloadAction<LoadingState | undefined>) => {
				const username = (action as any).meta.arg;
				(state[username] as LoadingState) = {loading: true, error: undefined};
			})
			.addCase(unsubscribe.fulfilled, (state, action : PayloadAction<string | undefined>) => {
				if (action.payload !== undefined) {
					const {username} = (action as any).meta.arg;
					const currentUser : string = action.payload;
					state[username].followers = state[username].followers.filter(sub => {return sub.user.username !== currentUser});
				}
			})
			.addCase(unsubscribe.rejected, (state, action) => {
				const username = (action as any).meta.arg;
				state[username].loading = false;
				state[username].error = (action as any).error.message;
			})
	},
});


export default profilesSlice.reducer;