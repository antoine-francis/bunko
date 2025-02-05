import {Bookmark} from "./Bookmark.ts";
import {Collective} from "./Collective.ts";
import {TextDescription} from "./Text.ts";
import {Favorite} from "./Favorite.ts";
import {HttpStatus} from "../constants/Http.ts";
import {Series} from "./Series.ts";

export interface UserBadge {
	username: string;
	email?: string;
	firstName: string;
	lastName: string;
	picture: string;
}

export interface UserProfile extends UserBadge {
	bio: string;
	signupDate: Date;
	followers: Subscription[];
	following: Subscription[];
	bookmarks: Bookmark[];
	series: Series[];
	favorites: Favorite[];
	collectives: Membership[];
	texts: TextDescription[];
	loading?: boolean;
	error?: HttpStatus;
}

export interface Subscription {
	user: UserBadge;
	followDate: Date;
}

export interface Membership extends UserBadge {
	isStarredMember: boolean;
	isAdmin: boolean;
	joinDate: Date;
	collective?: Collective;
}

// Redux types
export interface UserState {
	user: UserBadge | undefined;
	loading: boolean;
	error: HttpStatus | string | undefined;
}

export interface ProfilesState {
	[key:string]: UserProfile;
}

// User auth objects

export interface SignupForm {
	email: string;
	username: string;
	password: string;
	firstName: string;
	lastName: string;
}

export interface UserPwdPair {
	username : string,
	password : string
}