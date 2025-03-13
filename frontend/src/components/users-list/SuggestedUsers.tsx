import {UserBadge} from "@/types/UserProfile.ts";
import {UserSimpleBadge} from "@/components/users-list/UserSimpleBadge.tsx";
import {defineMessages, useIntl} from "react-intl";
import {useEffect} from "react";
import {fetchSuggestedUsers} from "@/slices/SuggestionsSlice.ts";
import {useBunkoDispatch} from "@/hooks/redux-hooks.ts";
import {paths} from "@/config/paths.ts";
import {Link} from "react-router-dom";

const messages = defineMessages({
	trendingUsersToday: {
		defaultMessage: "Trending users today",
		id: "trendingUsersToday",
		description: "Suggested Users",
	},
	viewMore: {
		defaultMessage: "View more…",
		id: "trendingUsersToday",
		description: "Suggested Users",
	}
})

interface SuggestedUsersProps {
	users: UserBadge[]
}

export const SuggestedUsers = ({users} : SuggestedUsersProps) => {
	const dispatch = useBunkoDispatch();

	const {formatMessage} = useIntl();

	useEffect(() => {
		dispatch(fetchSuggestedUsers());
	}, [dispatch]);

	return (
		<div id="suggested-users-container">
			<div id="suggested-users">
				<div className="label">{formatMessage(messages.trendingUsersToday)}</div>
				<div className="user-list">
					{users.map((user: UserBadge, index: number) => {
						return (
							<UserSimpleBadge user={user} key={"user-" + index}/>
						)
					})}
				</div>
				<div className="view-more-label">
					<Link to={paths.home.getHref()}>{formatMessage(messages.viewMore)}</Link>
				</div>
			</div>
		</div>
	);
}