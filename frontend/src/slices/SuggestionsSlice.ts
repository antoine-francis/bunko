import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {UserBadge} from "../types/UserProfile.ts";
import {SuggestionsState} from "@/types/StateManagement.ts";
import {loadSuggestedUsers} from "@/features/profile/api/load-user-profile.ts";

export const fetchSuggestedUsers = createAsyncThunk<UserBadge[]>(
	'suggestions_fetchSuggestedUsers',
	async () => {
		return await loadSuggestedUsers();
	}
)

const initialState: SuggestionsState = {
	loading: false,
	error: undefined,
	suggestedUsers: [],
};

const suggestionsSlice = createSlice({
	name: 'suggestions',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchSuggestedUsers.pending, (state) => {
				state.suggestedUsers = [];
				state.loading = true;
			})
			.addCase(fetchSuggestedUsers.fulfilled, (state, action : PayloadAction<UserBadge[]>) => {
				state.suggestedUsers = action.payload;
				state.loading = false;
			})
			.addCase(fetchSuggestedUsers.rejected, (state, action) => {
				state.suggestedUsers = [];
				state.loading = false;
				state.error = (action as any).error.message;
			})
	},
});


export default suggestionsSlice.reducer;