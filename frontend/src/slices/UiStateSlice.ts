import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {UiState} from "../types/StateManagement.ts";
import {detectDarkMode} from "../utils/detect-color-scheme.ts";

const isDarkMode : boolean = detectDarkMode();

const initialState: UiState = {
	showVerticalOptionsBar: window.innerWidth > 700 || JSON.parse(localStorage.getItem('showVerticalOptionsBar') ?? 'true'),
	isDarkMode
};

const uiStateSlice = createSlice({
	name: 'uiState',
	initialState,
	reducers: {
		toggleVerticalBar: (state, action : PayloadAction<boolean | undefined >) => {
			if (action.payload !== undefined) {
				state.showVerticalOptionsBar = action.payload;
			} else {
				state.showVerticalOptionsBar = !state.showVerticalOptionsBar;
			}
		},
		toggleDarkMode: (state) => {
			state.isDarkMode = !state.isDarkMode;
		},
	},
});

export const { toggleVerticalBar, toggleDarkMode } = uiStateSlice.actions;


export default uiStateSlice.reducer;