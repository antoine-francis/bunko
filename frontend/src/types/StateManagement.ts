import {HttpStatus} from "../constants/Http.ts";
import {DeleteComment} from "@/types/Comment.ts";

export interface LoadingState {
	loading: boolean;
	error: HttpStatus | undefined;
}

export interface ModalState {
	alertType: string | undefined;
	showAlert: boolean;
	commentDeleteData: DeleteComment | undefined;
}

export interface UiState {
	showVerticalOptionsBar: boolean;
	isDarkMode: boolean;
}