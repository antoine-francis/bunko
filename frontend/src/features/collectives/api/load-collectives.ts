import {Collective} from "../../../types/Collective.ts";
import {Membership} from "../../../types/UserProfile.ts";

export const loadCollectiveDetails : (id : string) => Promise<Collective | undefined> = async (id: string) => {
	try {
		const response = await fetch("http://localhost:8000/collective/" + id, {
			headers: {
				Cookie: "sessionid=owtt56ms9uvyq60gdghetb3z0cwoayjf;csrftoken=eLjJjD5rx4xTfwjla1NjUS1RIUmV8T28"
			},
			credentials: 'same-origin',
		});

		if (response.ok) {
			const data = await response.json();
			let starredMembers = [];
			let admins = [];
			let flattenedMembers = [];

			for (const member of data.members) {
				let flattenedMember : Membership = {
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
			console.log(data);

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
		}
	} catch (exception) {
		console.log(exception);
	}
};