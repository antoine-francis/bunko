import {BunkoText} from "../../types/Text.ts";
import {useCallback, useEffect} from "react";

import {paths} from "../../config/paths.ts";
import {Link, useLocation} from "react-router-dom";
import {Loading} from "../../components/Loading.tsx";
import {ErrorHandler} from "../../components/ErrorHandler.tsx";
import {EmptyList} from "../../components/users-list/EmptyList.tsx";
import {useBunkoDispatch, useBunkoSelector} from "../../hooks/redux-hooks.ts";
import {fetchTexts} from "../../slices/TextListSlice.ts";
import {defineMessages, FormattedDate, useIntl} from "react-intl";
import TimeAgo from "timeago-react";
import Markdown from "marked-react";

const messages = defineMessages({
	author: {
		id: "by.author",
		description: "author display on single text view",
		defaultMessage: "{0} {1}",
	}
});

export const Dashboard = () => {
	const location = useLocation();
	const dispatch = useBunkoDispatch();
	const {formatMessage, locale} = useIntl();
	const {texts, error, loaded} = useBunkoSelector(state => state.dashboard)

	useEffect(() => {
		document.title = "Home - Bunko";
		// Dashboard content should always be refreshed on reload
		dispatch(fetchTexts());
	}, [dispatch]);

	const moreThanAWeek = useCallback((text : BunkoText) => {
		return (new Date().getTime() - new Date(text.creationDate).getTime()) / 1000 > 604800;
	}, [])

	if (!loaded) {
		return <Loading />;
	} else if (error) {
		return <ErrorHandler statusCode={error} redirectTo={location.pathname} />;
	} else if (texts === undefined || !texts.length) {
		return <EmptyList/>;
	} else {
		return (
			<div id="dashboard">
				{texts.map((text: BunkoText, index: number) => {
					const date = moreThanAWeek(text) ?
						<FormattedDate value={text.publicationDate} year={undefined}/> :
						<TimeAgo datetime={text.creationDate} locale={locale}/>;
					return (<div className="text-preview" key={`${text}-${index}`}>
						<Link to={{pathname: `${paths.singleText.getHref()}${text.hash}`}}>
							<div>{text.title}</div>
						</Link>
						<div className="author-date">
							<Link to={{pathname: `${paths.profile.getHref()}${text.author.username}`}}>
							<span className="author">{formatMessage(messages.author, {
								0: text.author.firstName,
								1: text.author.lastName
							})}</span>
							</Link>
							<span className="publish-date">{date}</span>

						</div>

						<Link to={{pathname: `${paths.singleText.getHref()}${text.hash}`}}>
							<p className="synopsis">{text.synopsis ? text.synopsis : <Markdown>{text.content.substring(0, 255)}</Markdown>}</p>
							{/*<p>{text.content}</p>*/}
						</Link>
						<div className="genres">
							{text.genres.map((genre) => {
								return (
									<span className="genre-tag">#{genre.tag}</span>
								)
							})}
						</div>
					</div>)
				})}
			</div>
		);
	}
}