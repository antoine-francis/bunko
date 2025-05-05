import {SavedText} from "@/types/SavedText.ts";
import {defineMessages, FormattedDate, useIntl} from "react-intl";
import TimeAgo from "timeago-react";
import {URL} from "@/constants/Url.ts";
import {Link} from "react-router-dom";
import {paths} from "@/config/paths.ts";
import {Dropdown} from "@/components/util/Dropdown.tsx";
import {Truncate} from "@re-dev/react-truncate";
import {TagList} from "@/components/texts-list/TagList.tsx";
import {LikeButton} from "@/components/text/LikeButton.tsx";
import {CommentButton} from "@/components/text/CommentButton.tsx";
import {SaveButton} from "@/components/text/SaveButton.tsx";
import {BunkoText} from "@/types/Text.ts";
import {UserBadge} from "@/types/UserProfile.ts";
import {useCallback} from "react";
import {IconAlertTriangle} from "@tabler/icons-react";
import {Like} from "@/types/Like.ts";


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

interface TextFeedItemProps {
	text: BunkoText;
	user: UserBadge | undefined;
}

export const TextFeedItem = ({text, user} : TextFeedItemProps) => {
	const {formatMessage, locale} = useIntl();

	const moreThanAWeek = useCallback((text : BunkoText) : boolean => {
		return (new Date().getTime() - new Date(text.creationDate).getTime()) / 1000 > 604800;
	}, []);

	const getDropdownContent = useCallback(() => {
		const items = [];
		items.push(
			<>
				<div className="nav-btn" onClick={() => {}}>
					<IconAlertTriangle />
					{formatMessage(messages.report)}
				</div>
			</>
		);
		return items;
	}, [])

	const isLiked: boolean = user !== undefined ? text.likes.filter((like : Like) => {
		return like.user.username === user.username
	}).length > 0 : false;
	const isSaved = user !== undefined ? text.savedBy.filter((savedText: SavedText) => {
		return savedText.user.username === user.username;
	}).length > 0 : false;

	const displayedDate = text.publicationDate ? text.publicationDate : text.creationDate;
	const date = moreThanAWeek(text) ?
		<FormattedDate value={displayedDate} year={undefined}/> :
		<TimeAgo datetime={displayedDate} locale={locale}/>;
	return (
		<div className="dashboard-item">
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
							<Truncate lines={4}>{text.content}</Truncate>}</div>
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
					<LikeButton text={text} liked={isLiked} />
					<CommentButton text={text}/>
					<SaveButton text={text} saved={isSaved}  />
				</div>
			</div>
		</div>)
}