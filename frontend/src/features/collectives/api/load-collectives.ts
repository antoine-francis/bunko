import {Collective} from "@/types/Collective.ts";
import {Membership} from "@/types/UserProfile.ts";
import {URL} from "@/constants/Url.ts";

export const loadCollectiveDetails : (id : string) => Promise<Collective | undefined> = async (id: string) => {
	const response = await fetch(URL.SERVER + URL.COLLECTIVE + id, {
		credentials: 'include',
	});

	if (response.ok) {
		const data = await response.json();
		const starredMembers = [];
		const admins = [];
		const flattenedMembers = [];

		for (const member of data.members) {
			const flattenedMember : Membership = {
				firstName: member.user.firstName,
				lastName: member.user.lastName,
				username: member.user.username,
				picture: member.user.picture,
				joinDate: member.joinDate,
				isStarredMember: member.isStarredMember,
				isAdmin: member.isAdmin,
			}
			flattenedMembers.push(flattenedMember);
			if (member.isStarredMember) {
				starredMembers.push(flattenedMember);
			}
			if (member.isAdmin) {
				admins.push(flattenedMember);
			}
		}

		const collectiveDetails : Collective = Object.assign({}, {
			id: data.id,
			name: data.name,
			description: data.description,
			picture: data.picture,
			creationDate: data.creationDate,
			creator: data.creator,
			members: flattenedMembers,
			starredMembers,
			admins,
		})
		return collectiveDetails;
	} else {
		throw new Error(response.status.toString());
	}
};