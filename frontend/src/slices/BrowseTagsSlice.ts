import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {BrowseTagsState, Genre} from "../types/Genre.ts";
import {loadTags, loadTagsSearchResults} from "../features/tags/load-tags.ts";

export const fetchTags = createAsyncThunk<Genre[]>(
	'tags_fetchTags',
	async () => {
		return await loadTags();
	}
)

export const searchTags = createAsyncThunk<Genre[], string>(
	'tags_searchTags',
	async (query : string) => {
		return await loadTagsSearchResults(query);
	}
)

const initialState: BrowseTagsState = {
	tags: [],
	loading: true,
	error: undefined,
	tagSearch: {
		loading: true,
		error: undefined,
		searchBarText: "",
		searchResults: {}
	}
};

const browseTagsSlice = createSlice({
	name: 'tags',
	initialState,
	reducers: {
		resetSearchBar: (state) => {
			state.tagSearch.searchBarText = "";
			state.tagSearch.loading = true;
			state.tagSearch.error = undefined;
		}
	},
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
			.addCase(searchTags.pending, (state, action) => {
				const query = (action as any).meta.arg;
				state.tagSearch.searchBarText = query;
				state.tagSearch.loading = true;
			})
			.addCase(searchTags.fulfilled, (state, action : PayloadAction<Genre[]>) => {
				const query = (action as any).meta.arg;
				state.tagSearch.loading = false;
				state.tagSearch.searchResults[query] = action.payload ? action.payload : [];
			})
			.addCase(searchTags.rejected, (state, action) => {
				state.tagSearch.loading = false;
				state.tagSearch.error = (action as any).error.message;
			})
	}
});

export const { resetSearchBar } = browseTagsSlice.actions;


export default browseTagsSlice.reducer;