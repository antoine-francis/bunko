import {BunkoText} from "../../types/Text.ts";
import {useCallback, useEffect} from "react";

import {paths} from "../../config/paths.ts";
import {Link, useLocation} from "react-router-dom";
import {Loading} from "../../components/Loading.tsx";
import {ErrorHandler} from "../../components/ErrorHandler.tsx";
import {EmptyList} from "../../components/users-list/EmptyList.tsx";
import {useBunkoDispatch, useBunkoSelector} from "../../hooks/redux-hooks.ts";
import {defineMessages, FormattedDate, useIntl} from "react-intl";
import TimeAgo from "timeago-react";
import Markdown from "marked-react";
import {TagList} from "../../components/texts-list/TagList.tsx";
import {fetchTags} from "../../slices/BrowseTagsSlice.ts";
import {Genre} from "../../types/Genre.ts";

const messages = defineMessages({
	author: {
		id: "by.author",
		description: "author display on single text view",
		defaultMessage: "{0}",
	}
});

export const BrowseTags = () => {
	const location = useLocation();
	const dispatch = useBunkoDispatch();
	const {formatMessage, locale} = useIntl();
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
			<div id="dashboard">
				{tags.map((genre: Genre, index: number) => {
					return (<div className="text-preview" key={`${genre}-${index}`}>
						{/*<div className="author-date">*/}
						{/*	<Link to={{pathname: `${paths.profile.getHref()}${text.author.username}`}}>*/}
						{/*	<span className="author">{formatMessage(messages.author, {*/}
						{/*		0: text.author.firstName !== "" ? `${text.author.firstName} ${text.author.lastName}` :*/}
						{/*			text.author.username*/}
						{/*	})}</span>*/}
						{/*	</Link>*/}
						{/*	<span className="publish-date">{date}</span>*/}

						{/*</div>*/}
						{/*<Link to={{pathname: `${paths.singleText.getHref()}${text.hash}`}}>*/}
						{/*	<div>{text.title}</div>*/}
						{/*</Link>*/}

						<Link to={{pathname: `${paths.tag.getHref()}${genre.tag}`}}>
							<p>#{genre.tag} - {genre.texts !== undefined && genre.texts.length}</p>
						</Link>
					</div>)
				})}
			</div>
		);
	}
}