import {Subscription} from "../../../types/UserProfile.ts";

export const loadFollowers = async (username : string) : Promise<Subscription[] | undefined>  => {
		return loadSubscriptions("http://localhost:8000/followers/", username);
};


export const loadFollowing = async (username : string) : Promise<Subscription[] | undefined>  => {
	return loadSubscriptions("http://localhost:8000/following/", username);
};

const loadSubscriptions = async (url : string, username : string) : Promise<Subscription[] | undefined>=> {
	const response = await fetch(url + username, {
		credentials: 'include',
	});
	if (response.ok) {
		const data = await response.json();
		const subscriptionList : Subscription[] = [];
		for (const sub of data) {
			subscriptionList.push(
				Object.assign({}, {
					username: sub.user.username,
					firstName: sub.user.firstName,
					lastName: sub.user.lastName,
					followDate: sub.followDate,
					picture: sub.user.picture,
				})
			);
		}
		return subscriptionList;
	} else {
		throw new Error(response.status.toString());
	}
}