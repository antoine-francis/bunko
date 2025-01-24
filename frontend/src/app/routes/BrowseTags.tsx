import {useEffect} from "react";

import {paths} from "../../config/paths.ts";
import {Link, useLocation} from "react-router-dom";
import {Loading} from "../../components/Loading.tsx";
import {ErrorHandler} from "../../components/ErrorHandler.tsx";
import {EmptyList} from "../../components/users-list/EmptyList.tsx";
import {useBunkoDispatch, useBunkoSelector} from "../../hooks/redux-hooks.ts";
import {defineMessages, useIntl} from "react-intl";
import {fetchTags} from "../../slices/BrowseTagsSlice.ts";
import {Genre} from "../../types/Genre.ts";

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
		return <Loading />;
	} else if (error) {
		return <ErrorHandler statusCode={error} redirectTo={location.pathname} />;
	} else if (tags === undefined || !tags.length) {
		return <EmptyList/>;
	} else {
		return (
			<div id="browse-by-tags-container">
				<h2>{formatMessage(messages.browseTags)}</h2>
				{tags.map((genre: Genre, index: number) => {
					return (<div key={`${genre}-${index}`}>
						<Link to={{pathname: `${paths.tag.getHref()}${genre.tag}`}}>
							<p className="genre-tag">#{genre.tag} ({genre.texts !== undefined && genre.texts.length})</p>
						</Link>
					</div>)
				})}
			</div>
		);
	}
}