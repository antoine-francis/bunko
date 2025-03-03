import {useEffect} from "react";

import {paths} from "@/config/paths.ts";
import {Link, useLocation} from "react-router-dom";
import {ErrorHandler} from "@/components/ErrorHandler.tsx";
import {EmptyList} from "@/components/users-list/EmptyList.tsx";
import {useBunkoDispatch, useBunkoSelector} from "@/hooks/redux-hooks.ts";
import {defineMessages, useIntl} from "react-intl";
import {fetchTags} from "@/slices/BrowseTagsSlice.ts";
import {Genre} from "@/types/Genre.ts";
import {LoadingContainer} from "@/components/LoadingContainer.tsx";

const messages = defineMessages({
	browseTags: {
		id: "browseTags.title",
		description: "page title",
		defaultMessage: "Browse popular #tags",
	}
});

export const BrowseTags = () => {
	const location = useLocation();
	const dispatch = useBunkoDispatch();
	const {formatMessage} = useIntl();
	const {tags, error, loading} = useBunkoSelector(state => state.browseTags)

	useEffect(() => {
		document.title = "Browse tags";
		dispatch(fetchTags());
	}, [dispatch]);

	if (loading) {
		return <LoadingContainer />;
	} else if (error) {
		return <ErrorHandler statusCode={error} redirectTo={location.pathname} />;
	} else if (tags === undefined || !tags.length) {
		return <EmptyList/>;
	} else {
		return (
			<div id="browse-by-tags-container">
				<h2>{formatMessage(messages.browseTags)}</h2>
				{tags.map((genre: Genre, index: number) => {
					return (
						<Link className="genre-tag" key={`${genre}-${index}`} to={{pathname: `${paths.tag.getHref()}${genre.tag}`}}>
							#{genre.tag} ({genre.texts !== undefined && genre.texts.length})
						</Link>
					)})}
			</div>
		);
	}
}