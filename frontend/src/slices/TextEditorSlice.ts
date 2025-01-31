import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {BunkoText, EditorContent, TextEditorState} from "../types/Text.ts";
import {createNewText} from "../features/text/api/single-text.ts";

export const createText = createAsyncThunk<BunkoText, EditorContent>(
	'textEditor_createText',
	async ({content, synopsis, isDraft, title, genres, series} : EditorContent) => {
		return await createNewText({content, synopsis, isDraft, title, genres, series});
	}
)

const initialState: TextEditorState = {
	title: undefined,
	genres: [],
	content: "",
	isDraft: true,
	loading: true,
	error: undefined,
	saved: false,
	newHash: undefined
};

const textEditorSlice = createSlice({
	name: 'textEditor',
	initialState,
	reducers: {
		finishLoading: (state) => {
			state.loading = false;
		},
		resetEditor: () => {
			return initialState;
		},
	},
	extraReducers: builder => {
		builder
			.addCase(createText.pending, (state) => {
				state.loading = true;
				state.newHash = undefined;
			})
			.addCase(createText.fulfilled, (state, action	: PayloadAction<BunkoText>) => {
				state.loading = false;
				state.saved = true;
				state.newHash = action.payload.hash
			})
			.addCase(createText.rejected, (state, action) => {
				state.loading = false;
				state.newHash = undefined;
				state.error = (action as any).error.message;
			})
			// .addMatcher(
			// 	isAnyOf(
			// 		createText.fulfilled
			// 	), () => {
			// 		return initialState;
			// 	}
			// )
	},
});

// export const { confirmLostChanges, closeModal, confirmPublication, finishLoading } = textEditorSlice.actions;
export const { finishLoading, resetEditor } = textEditorSlice.actions;


export default textEditorSlice.reducer;