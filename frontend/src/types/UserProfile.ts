import {Bookmark} from "./Bookmark.ts";
import {Collective} from "./Collective.ts";
import {TextDescription} from "./Text.ts";
import {Favorite} from "./Favorite.ts";

export interface UserBadge {
	username: string;
	firstName: string;
	lastName: string;
	picture: string;
}

export interface UserProfile extends UserBadge{
	bio: string;
	signupDate: Date;
	followers: number;
	following: number;
	bookmarks: Bookmark[];
	favorites: Favorite[];
	collectives: Membership[];
	texts: TextDescription[];

}

export interface Subscription extends UserBadge {
	followDate: Date;
}

export interface Membership extends UserBadge {
	isStarredMember: boolean;
	isAdmin: boolean;
	joinDate: Date;
	collective?: Collective
}

// Redux types
export interface UserState {
	user: UserBadge | undefined,
	loaded: boolean;
}