import {TextDescription} from "./Text.ts";
import {UserBadge} from "./UserProfile.ts";

export interface Like {
	text?: TextDescription;
	user?: UserBadge;
	likedDate: Date;
}