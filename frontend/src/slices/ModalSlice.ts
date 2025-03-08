import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {C} from "../constants/Constants.ts";
import {ModalState} from "../types/StateManagement.ts";
import {DeleteComment} from "@/types/Comment.ts";

const initialState: ModalState = {
	showAlert: false,
	alertType: undefined,
	commentDeleteData: undefined,
};

const modalSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		confirmLostChanges: (state) => {
			state.showAlert = true;
			state.alertType = C.CANCEL_EDIT;
		},
		confirmDelete: (state) => {
			state.showAlert = true;
			state.alertType = C.DELETE_TEXT;
		},
		confirmDeleteComment: (state, action : PayloadAction<DeleteComment>) => {
			state.showAlert = true;
			state.commentDeleteData = action.payload;
			state.alertType = C.DELETE_COMMENT;
		},
		confirmPublication: (state) => {
			state.showAlert = true;
			state.alertType = C.PUBLISH_TEXT;
		},
		closeModal: (state) => {
			state.showAlert = false;
			state.alertType = undefined;
		},
	},
});

export const { confirmLostChanges, confirmDelete, confirmDeleteComment, closeModal, confirmPublication } = modalSlice.actions;


export default modalSlice.reducer;