import {TextDescription} from "./Text.ts";
import {UserBadge} from "./UserProfile.ts";

export interface Bookmark {
	text: TextDescription;
	user: UserBadge;
	bookmarkDate: Date;
}