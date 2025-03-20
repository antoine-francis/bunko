import {TextDescription} from "./Text.ts";
import {UserBadge} from "./UserProfile.ts";

export interface SavedText {
	text: TextDescription;
	user: UserBadge;
	saveDate: Date;
}