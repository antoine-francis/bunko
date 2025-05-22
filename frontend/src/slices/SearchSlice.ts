import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {loadTitlesSearchResults} from "@/features/dashboard/api/load-texts.ts";
import {BunkoText, SearchState} from "@/types/Text.ts";
import {C} from "@/constants/Constants.ts";

export const searchTitles = createAsyncThunk<BunkoText[], string>(
	'tags_searchTitles',
	async (query : string) => {
		return await loadTitlesSearchResults(query);
	}
)

const initialState: SearchState = {
	query: "",
	searchType: C.TAGS,
	results: [],
	loading: true,
	error: undefined,
};

const searchSlice = createSlice({
	name: 'search',
	initialState,
	reducers: {
		changeSearchType: (state, action) => {
			state.searchType = action.payload;
		},
		resetSearchBar: (state) => {
			state.query = "";
			state.loading = true;
			state.error = undefined;
		}
	},
	extraReducers: builder => {
		builder
			.addCase(searchTitles.pending, (state, action) => {
				const query = (action as any).meta.arg;
				state.query = query;
				state.loading = true;
			})
			.addCase(searchTitles.fulfilled, (state, action : PayloadAction<BunkoText[]>) => {
				state.results = action.payload;
				state.loading = false;
			})
			.addCase(searchTitles.rejected, (state, action) => {
				state.loading = false;
				state.error = (action as any).error.message;
			})
	}
});

export const { changeSearchType, resetSearchBar } = searchSlice.actions;


export default searchSlice.reducer;