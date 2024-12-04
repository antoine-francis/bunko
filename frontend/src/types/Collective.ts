import {Author} from "./Author.ts";
import {Membership} from "./UserProfile.ts";

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
}