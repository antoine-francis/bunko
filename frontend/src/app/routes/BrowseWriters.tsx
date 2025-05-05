import {useEffect} from "react";

import {useLocation} from "react-router-dom";
import {ErrorHandler} from "@/components/ErrorHandler.tsx";
import {EmptyList} from "@/components/users-list/EmptyList.tsx";
import {useBunkoDispatch, useBunkoSelector} from "@/hooks/redux-hooks.ts";
import {defineMessages, useIntl} from "react-intl";
import {LoadingContainer} from "@/components/LoadingContainer.tsx";
import {fetchSuggestedUsers} from "@/slices/SuggestionsSlice.ts";
import {UserSimpleBadge} from "@/components/users-list/UserSimpleBadge.tsx";
import {UserBadge} from "@/types/UserProfile.ts";

const messages = defineMessages({
	browseWriters: {
		id: "browsewriters.title",
		description: "page title",
		defaultMessage: "Browse popular writers",
	},
	browseWritersExpl: {
		id: "browsewritersExpl",
		description: "page subtitle",
		defaultMessage: "See whose work people have been reading lately",
	}
});

export const BrowseWriters = () => {
	const location = useLocation();
	const dispatch = useBunkoDispatch();
	const {formatMessage} = useIntl();
	const {suggestedUsers, loading, error} = useBunkoSelector(state => state.suggestions);

	useEffect(() => {
		document.title = "Browse tags";
		dispatch(fetchSuggestedUsers());
	}, [dispatch]);

	if (loading) {
		return <LoadingContainer />;
	} else if (error) {
		return <ErrorHandler statusCode={error} redirectTo={location.pathname} />;
	} else if (suggestedUsers === undefined || !suggestedUsers.length) {
		return <EmptyList/>;
	} else {
		return (
			<div id="browse-by-writers-container">
				<h2>{formatMessage(messages.browseWriters)}</h2>
				<div className="subtext">
					<span>{formatMessage(messages.browseWritersExpl)}</span>
				</div>
				{suggestedUsers.map((user: UserBadge) => {
					return (
						<UserSimpleBadge key={"user-" + user.username} user={user} withBio={true} />
					)})}
			</div>
		);
	}
}