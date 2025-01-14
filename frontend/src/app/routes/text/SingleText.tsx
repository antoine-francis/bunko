import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {useCallback, useEffect} from "react";
import {Loading} from "../../../components/Loading.tsx";
import {NotFound} from "../../../components/NotFound.tsx";
import {paths} from "../../../config/paths.ts";
import {Genre} from "../../../types/Genre.ts";
import {ErrorHandler} from "../../../components/ErrorHandler.tsx";
import {useBunkoDispatch, useBunkoSelector} from "../../../hooks/redux-hooks.ts";
import {
	bookmarkText,
	deleteText,
	fetchText,
	likeText,
	unbookmarkText,
	unlikeText, updateText
} from "../../../slices/TextSlice.ts";
import {UserBadge} from "../../../types/UserProfile.ts";
import {LikeButton} from "../../../components/text/LikeButton.tsx";
import {BookmarkButton} from "../../../components/text/BookmarkButton.tsx";
import {CommentSection} from "../../../components/text/CommentSection.tsx";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import Markdown from "marked-react";
import {ClickableTag} from "../../../components/text/ClickableTag.tsx";
import {useIsOwner} from "../../../hooks/users-relationships-hooks.ts";
import {ModalDialog} from "../../../components/layout/ModalDialog.tsx";
import {C} from "../../../constants/Constants.ts";
import {confirmDelete, confirmPublication} from "../../../slices/ModalSlice.ts";
import {BunkoText} from "../../../types/Text.ts";
import {toRoman} from "../../../utils/roman-numerals.ts";

const messages = defineMessages({
	author: {
		id: "by.author",
		description: "author display on single text view",
		defaultMessage: "by {0}",
	},
	deleteDraft: {
		id: "text.deleteDraft",
		description: "Button text",
		defaultMessage: "Delete draft",
	},
	editDraft: {
		id: "text.editDraft",
		description: "Button text",
		defaultMessage: "Edit draft",
	},
	publishDraft: {
		id: "text.publishDraft",
		description: "Button text",
		defaultMessage: "Publish draft",
	},
	readOnly: {
		id: "text.readOnly",
		description: "Banner text",
		defaultMessage: "This draft is in read-only mode",
	}
})


export const SingleText = () => {
	const {hash} = useParams();
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useBunkoDispatch();
	const {formatMessage} = useIntl();
	const {showAlert, alertType} = useBunkoSelector(state => state.modal);
	const text = useBunkoSelector(state => hash ? state.texts[hash] : undefined);
	const currentUser : string | undefined = useBunkoSelector(state => {
		const user : UserBadge | undefined = state.currentUser.user;
		return user ? user.username : undefined;
	});

	const loadingSuccess = text && !text.loading && !text.error;
	const isOwner = useIsOwner(loadingSuccess ? text.author.username : undefined, currentUser);
	const isLiked = loadingSuccess ? text.likes.filter((like) => {
		return like.user.username === currentUser;
	}).length > 0 : false;

	const isBookmarked = loadingSuccess ? text.bookmarkedBy.filter((bookmark) => {
		return bookmark.user.username === currentUser;
	}).length > 0 : false;

	useEffect(() => {
		if (text !== undefined) {
			document.title = text.title;
		}
	}, [text]);

	const handleLike = useCallback(() => {
		if (text !== undefined) {
			if (!isLiked) {
				dispatch(likeText(text));
			} else {
				dispatch(unlikeText(text));
			}
		}
	}, [text, dispatch, isLiked])

	const handleBookmark = useCallback(() => {
		if (text !== undefined) {
			if (!isBookmarked) {
				dispatch(bookmarkText(text));
			} else {
				dispatch(unbookmarkText(text));
			}
		}
	}, [text, dispatch, isBookmarked]);

	if (hash === undefined) {
		navigate(paths.notFound.getHref());
	} else {
		if (!text) {
			dispatch(fetchText(hash));
		}
	}

	const toggleDropdown = useCallback(() => {
		const dropdownMenu : HTMLElement | null = document.getElementById("dropdown-menu");
		if (dropdownMenu) {
			if (dropdownMenu.style.display !== "block") {
				dropdownMenu.style.display = "block";
			} else {
				dropdownMenu.style.display = "none";
			}
		}
	}, []);

	const handleEditText = useCallback(() => {
		if (text !== undefined) {
			navigate(paths.editText.getHref()+text.hash)
		}
	}, [text, navigate]);



	const showDeletePrompt = useCallback(() => {
		dispatch(confirmDelete());
	}, [dispatch])

	const showPublishPrompt = useCallback(() => {
		dispatch(confirmPublication());
	}, [dispatch])



	const confirmAction = useCallback(() => {
		switch (alertType) {
			case C.PUBLISH_TEXT:
				if (hash && text) {
					const publishedText : BunkoText = {...text, isDraft: false};
					dispatch(updateText(publishedText));
				}
				break;
			case C.DELETE_TEXT:
				if (text) {
					dispatch(deleteText(text));
				}
				navigate(paths.profile.getHref() + currentUser);
				break;
		}
	}, [hash, text, navigate, dispatch, currentUser, alertType]);

	if (text === undefined) {
		return <NotFound/>;
	}
	if (text.loading) {
		return <Loading/>;
	} else if (text.error) {
		return <ErrorHandler statusCode={text.error} redirectTo={location.pathname} />;
	} else {
		return (
			<div id="text-container">
				<div className="text-title">{text.title}</div>
				<Link to={`${paths.profile.getHref()}${text.author.username}`}>
					<div className="text-author">{formatMessage(messages.author, {
						0: text.author.firstName || text.author.lastName ? `${text.author.firstName} ${text.author.lastName}` : text.author.username})}</div>
				</Link>
				{text.series !== undefined && text.seriesEntry &&
					(<Link to={{pathname: `${paths.series.getHref()}${text.series.id}`}}>
						<div className="text-series-info">
							<span className="series-name">{text.series.title} - {toRoman(text.seriesEntry)}</span>
						</div>
					</Link>)
				}
				<div className="reader-genres">{text.genres.map((genre: Genre) => {
					return (<ClickableTag key={genre.tag} tag={genre.tag}/>);
				})}</div>
				<div className="text-content"><Markdown>{text.content}</Markdown></div>
				{!text.isDraft ? (
					<>
						<div className="actions">
							<div className="reactions">
								<LikeButton onClick={handleLike} liked={isLiked} text={text}/>
								<BookmarkButton onClick={handleBookmark} bookmarked={isBookmarked} text={text}/>
							</div>
							{isOwner && <>
								<div className="options" onClick={toggleDropdown}>···</div>
								<div id="dropdown-menu">
									<ul>
										<li onClick={handleEditText}>
											<FormattedMessage id="text.editText"
															  description="dropdown button"
															  defaultMessage="Edit text"/>
										</li>
										<li className="destructive-action" onClick={showDeletePrompt}><FormattedMessage
											id="text.deleteText"
											description="dropdown button"
											defaultMessage="Delete text"/>
										</li>
									</ul>
								</div>
							</>}
						</div>
						<CommentSection textId={text.id} comments={text.comments}/>
					</>
				) : isOwner ? (
					<div id="draft-actions" className="action-buttons">
						<button id="cancel-changes"
								onClick={showDeletePrompt}>{formatMessage(messages.deleteDraft)}
						</button>
						<button id="edit-draft" onClick={handleEditText}>
							{formatMessage(messages.editDraft)}
						</button>
						<button id="publish" onClick={showPublishPrompt}>
							{formatMessage(messages.publishDraft)}
						</button>
					</div>
				) : <div className="read-only-banner">{formatMessage(messages.readOnly)}</div>
				}
				<ModalDialog isOpen={showAlert}
							 type={alertType}
							 confirmFunction={confirmAction} />
			</div>);
	}
}