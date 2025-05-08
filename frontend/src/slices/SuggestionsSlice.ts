import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {UserBadge} from "../types/UserProfile.ts";
import {SuggestionsState} from "@/types/StateManagement.ts";
import {loadSuggestedUsers} from "@/features/profile/api/load-user-profile.ts";
import {Series} from "@/types/Series.ts";
import {loadPopularSeries} from "@/features/dashboard/api/load-texts.ts";

export const fetchSuggestedUsers = createAsyncThunk<UserBadge[]>(
	'suggestions_fetchSuggestedUsers',
	async () => {
		return await loadSuggestedUsers();
	}
)

export const fetchPopularSeries = createAsyncThunk<Series[] | undefined, void>(
	'series_fetchPopularSeries',
	async () => {
		return await loadPopularSeries();
	}
)

const initialState: SuggestionsState = {
	loading: false,
	error: undefined,
	suggestedUsers: [],
	suggestedSeries: [],
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
			.addCase(fetchPopularSeries.pending, (state) => {
				state.loading = true;
				state.suggestedSeries = [];
			})
			.addCase(fetchPopularSeries.fulfilled, (state, action : PayloadAction<Series[] | undefined>) => {
				state.loading = false;
				if (action.payload !== undefined) {
					state.suggestedSeries = action.payload;
				}
			})
			.addCase(fetchPopularSeries.rejected, (state, action) => {
				state.loading = false;
				state.error = (action as any).error.message;
			})
	},
});


export default suggestionsSlice.reducer;