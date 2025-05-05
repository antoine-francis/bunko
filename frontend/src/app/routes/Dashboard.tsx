import {useEffect} from "react";

import {useLocation} from "react-router-dom";
import {ErrorHandler} from "@/components/ErrorHandler.tsx";
import {useBunkoDispatch, useBunkoSelector} from "@/hooks/redux-hooks.ts";
import {fetchTexts} from "@/slices/TextListSlice.ts";
import {LoadingContainer} from "@/components/LoadingContainer.tsx";
import {SuggestedUsers} from "@/components/users-list/SuggestedUsers.tsx";
import {TextsFeed} from "@/components/texts-list/TextsFeed.tsx";

export const Dashboard = () => {
	const location = useLocation();
	const dispatch = useBunkoDispatch();
	const {loading: userLoading, error: userError, user} = useBunkoSelector(state => state.currentUser);
	const {bookmarks, error, loading} = useBunkoSelector(state => state.dashboard)
	const {texts} = useBunkoSelector(state => state);
	const {suggestedUsers} = useBunkoSelector(state => state.suggestions);

	useEffect(() => {
		if (loading && !userLoading && !userError) {
			document.title = "Home - Bunko";
		}
	}, [dispatch, userLoading, userError, loading]);

	useEffect(() => {
		// Dashboard content should always be refreshed on reload
		dispatch(fetchTexts());
	}, [])

	if (loading) {
		return <LoadingContainer />;
	} else if (error) {
		return <ErrorHandler statusCode={error} redirectTo={location.pathname} />;
	} else {
		return (
			<>
				<TextsFeed texts={Object.values(texts)} bookmarks={bookmarks} user={user} />
				<SuggestedUsers users={suggestedUsers} />
			</>
		);
	}
}