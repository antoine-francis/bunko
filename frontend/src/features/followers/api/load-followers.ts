import {Subscription} from "../../../types/UserProfile.ts";

export const loadFollowers = async (username : string) : Promise<Subscription[] | undefined>  => {
	try {
		const response = await fetch("http://localhost:8000/followers/" + username, {
			headers: {
				Cookie: "sessionid=owtt56ms9uvyq60gdghetb3z0cwoayjf;csrftoken=eLjJjD5rx4xTfwjla1NjUS1RIUmV8T28"
			},
			credentials: 'same-origin',
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
		}
	} catch (exception) {
		console.error(exception);
		throw new Error("Something went wrong");
	}
};


export const loadFollowing = async (username : string) : Promise<Subscription[] | undefined>  => {
	try {
		const response = await fetch("http://localhost:8000/following/" + username, {
			headers: {
				Cookie: "sessionid=owtt56ms9uvyq60gdghetb3z0cwoayjf;csrftoken=eLjJjD5rx4xTfwjla1NjUS1RIUmV8T28"
			},
			credentials: 'same-origin',
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
		}
		throw new Error("Something went wrong");
	} catch (exception) {
		console.error(exception);
		throw new Error("Something went wrong");
	}
};