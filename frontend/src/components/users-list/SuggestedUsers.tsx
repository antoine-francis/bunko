import {UserBadge} from "@/types/UserProfile.ts";
import {UserSimpleBadge} from "@/components/users-list/UserSimpleBadge.tsx";
import {defineMessages, useIntl} from "react-intl";
import {useEffect} from "react";
import {fetchSuggestedUsers} from "@/slices/SuggestionsSlice.ts";
import {useBunkoDispatch} from "@/hooks/redux-hooks.ts";
import {paths} from "@/config/paths.ts";
import {Link} from "react-router-dom";

const messages = defineMessages({
	suggestedUsers: {
		defaultMessage: "Suggested users",
		id: "suggestedUsers",
		description: "Suggested Users",
	},
	viewMore: {
		defaultMessage: "View more…",
		id: "viewMore",
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
				<div className="label">{formatMessage(messages.suggestedUsers)}</div>
				<div className="user-list">
					{users.map((user: UserBadge, index: number) => {
						return (
							<UserSimpleBadge user={user} key={"user-" + index}/>
						)
					})}
				</div>
				<div className="view-more-label">
					<Link to={paths.writers.getHref()}>{formatMessage(messages.viewMore)}</Link>
				</div>
			</div>
		</div>
	);
}