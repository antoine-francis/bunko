import {Author} from "./Author.ts";
import {Membership} from "./UserProfile.ts";
import {HttpStatus} from "../constants/Http.ts";

export interface Collective {
	id: number;
	name: string;
	description: string;
	picture: string;
	creationDate: Date;
	creator: Author;
	members: Membership[];
	admins: Membership[];
	starredMembers: Membership[];
	loading?: boolean;
	error?: HttpStatus | undefined;
}

export interface CollectivesState {
	[key: string]: Collective;
}