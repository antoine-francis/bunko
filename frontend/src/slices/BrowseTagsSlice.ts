import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {BrowseTagsState, Genre} from "../types/Genre.ts";
import {loadTags} from "../features/tags/load-tags.ts";

export const fetchTags = createAsyncThunk<Genre[]>(
	'tags_fetchTags',
	async () => {
		return await loadTags();
	}
)

const initialState: BrowseTagsState = {
	tags: [],
	loading: true,
	error: undefined
};

const browseTagsSlice = createSlice({
	name: 'tags',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchTags.pending, (state) => {
					state.loading = true;
			})
			.addCase(fetchTags.fulfilled, (state, action : PayloadAction<Genre[]>) => {
				state.tags = action.payload;
				state.loading = false;
			})
			.addCase(fetchTags.rejected, (state, action) => {
				state.tags = [];
				state.loading = false;
				state.error = (action as any).error.message;
			})
	}
});

export default browseTagsSlice.reducer;