import {BunkoText} from "@/types/Text.ts";
import {useCallback, useEffect} from "react";

import {paths} from "@/config/paths.ts";
import {Link, useLocation} from "react-router-dom";
import {ErrorHandler} from "@/components/ErrorHandler.tsx";
import {useBunkoDispatch, useBunkoSelector} from "@/hooks/redux-hooks.ts";
import {fetchTexts} from "@/slices/TextListSlice.ts";
import {defineMessages, FormattedDate, useIntl} from "react-intl";
import TimeAgo from "timeago-react";
import {TagList} from "@/components/texts-list/TagList.tsx";
import {LoadingContainer} from "@/components/LoadingContainer.tsx";
import {URL} from "@/constants/Url.ts";
import {EmptyListContainer} from "@/components/EmptyListContainer.tsx";
import {LikeButton} from "@/components/text/LikeButton.tsx";
import {BookmarkButton} from "@/components/text/BookmarkButton.tsx";
import {CommentButton} from "@/components/text/CommentButton.tsx";
import {IconAlertTriangle} from "@tabler/icons-react";
import {Truncate} from "@re-dev/react-truncate";
import {Dropdown} from "@/components/util/Dropdown.tsx";

const messages = defineMessages({
	author: {
		id: "by.author",
		description: "author display on single text view",
		defaultMessage: "{0}",
	},
	peopleReading: {
		id: "peopleReading",
		description: "reader count",
		defaultMessage: "{1} people are reading",
	},
	minutesToRead: {
		id: "minutesToRead",
		description: "text length in minutes",
		defaultMessage: "{1} minutes read",
	},
	report: {
		id: "report",
		description: "report button",
		defaultMessage: "Report",
	}
});

export const Dashboard = () => {
	const location = useLocation();
	const dispatch = useBunkoDispatch();
	const {formatMessage, locale} = useIntl();
	const {loading: userLoading, error: userError, user} = useBunkoSelector(state => state.currentUser);
	const {texts, error, loading} = useBunkoSelector(state => state.dashboard)

	useEffect(() => {
		if (loading && !userLoading && !userError) {
			document.title = "Home - Bunko";
			// Dashboard content should always be refreshed on reload
			dispatch(fetchTexts());
		}
	}, [dispatch, userLoading, userError, loading]);

	const getDropdownContent = useCallback(() => {
		const items = [];
		items.push(
			<>
				<IconAlertTriangle />
				<div className="nav-btn" onClick={() => {}}>
					{formatMessage(messages.report)}
				</div>
			</>
		);
		return items;
	}, [])

	const moreThanAWeek = useCallback((text : BunkoText) => {
		return (new Date().getTime() - new Date(text.creationDate).getTime()) / 1000 > 604800;
	}, [])

	if (loading) {
		return <LoadingContainer />;
	} else if (error) {
		return <ErrorHandler statusCode={error} redirectTo={location.pathname} />;
	} else if (texts === undefined || !texts.length) {
		return <EmptyListContainer/>;
	} else {
		return (
			<div id="dashboard">
				{texts.map((text: BunkoText, index: number) => {
					const isLiked : boolean = user !== undefined ? text.likes.filter((like) => {
						return like.user.username === user.username
					}).length > 0 : false;
					const isBookmarked = user !== undefined ? text.bookmarkedBy.filter((bookmark) => {
						return bookmark.user.username === user.username;
					}).length > 0 : false;

					const date = moreThanAWeek(text) ?
						<FormattedDate value={text.publicationDate} year={undefined}/> :
						<TimeAgo datetime={text.creationDate} locale={locale}/>;
					return (
						<div className="dashboard-item" key={`${text}-${index}`}>
							<div className="text-info">
								<div className="text-preview">
									<div className="item-header">
										<img className="mini-profile-pic" src={URL.SERVER + text.author.picture}
											 alt={text.author.username}/>
										<div>
											<Link to={{pathname: `${paths.singleText.getHref()}${text.hash}`}}>
												<div>{text.title}</div>
											</Link>
											<div className="author-date">
												<Link
													to={{pathname: `${paths.profile.getHref()}${text.author.username}`}}>
							<span className="author">{formatMessage(messages.author, {
								0: text.author.firstName !== "" ? `${text.author.firstName} ${text.author.lastName}` :
									text.author.username
							})}</span>
												</Link>
												<span className="publish-date">{date}</span>
											</div>
										</div>
										<div className="more">
											<Dropdown items={getDropdownContent()} align="end"/>
										</div>
									</div>

									<Link to={{pathname: `${paths.singleText.getHref()}${text.hash}`}}>
										<div className="synopsis">{text.synopsis ? text.synopsis :
											<Truncate lines={4} >{text.content}</Truncate>}</div>
									</Link>
									<TagList genres={text.genres}/>
								</div>
								<div className="likes-comments-saves">
									<div className="read-by">
										<span>{formatMessage(messages.peopleReading, {1: (Math.random() * 100).toFixed(0)})}</span>
										<span>{formatMessage(messages.minutesToRead, {
											1: Math.round(text.content.split(" ").length / 200) // avg wpm
										})}</span>
									</div>
									<LikeButton text={text} liked={isLiked}/>
									<CommentButton text={text}/>
									<BookmarkButton text={text} bookmarked={isBookmarked}/>
								</div>
							</div>
						</div>)
				})}
			</div>
		)
			;
	}
}