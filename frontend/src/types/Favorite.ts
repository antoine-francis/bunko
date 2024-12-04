import {TextDescription} from "./Text.ts";
import {UserBadge} from "./UserProfile.ts";

export interface Favorite {
	text?: TextDescription;
	user?: UserBadge;
	favoriteDate: Date;
}