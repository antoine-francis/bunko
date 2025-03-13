import {HttpStatus} from "../constants/Http.ts";
import {DeleteComment} from "@/types/Comment.ts";
import {UserBadge} from "@/types/UserProfile.ts";

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

export interface SuggestionsState {
	loading: boolean;
	error: HttpStatus | undefined;
	suggestedUsers: UserBadge[];
}