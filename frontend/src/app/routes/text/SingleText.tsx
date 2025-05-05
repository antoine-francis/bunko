import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import React, {useCallback, useEffect} from "react";
import {NotFound} from "@/components/NotFound.tsx";
import {paths} from "@/config/paths.ts";
import {Genre} from "@/types/Genre.ts";
import {ErrorHandler} from "@/components/ErrorHandler.tsx";
import {useBunkoDispatch, useBunkoSelector} from "@/hooks/redux-hooks.ts";
import {
	deleteComment,
	deleteText,
	fetchText, setBookmark,
	updateText
} from "@/slices/TextSlice.ts";
import {UserBadge} from "@/types/UserProfile.ts";
import {LikeButton} from "@/components/text/LikeButton.tsx";
import {SaveButton} from "@/components/text/SaveButton.tsx";
import {CommentSection} from "@/components/text/CommentSection.tsx";
import {defineMessages, useIntl} from "react-intl";
import Markdown from "marked-react";
import {ClickableTag} from "@/components/text/ClickableTag.tsx";
import {useIsOwner} from "@/hooks/users-relationships-hooks.ts";
import {ModalDialog} from "@/components/layout/ModalDialog.tsx";
import {C} from "@/constants/Constants.ts";
import {confirmDelete, confirmPublication} from "@/slices/ModalSlice.ts";
import {BunkoText} from "@/types/Text.ts";
import {toRoman} from "@/utils/roman-numerals.ts";
import {IconAlertTriangle, IconEdit, IconShare3, IconTrash} from "@tabler/icons-react";
import {LoadingContainer} from "@/components/LoadingContainer.tsx";
import {CommentButton} from "@/components/text/CommentButton.tsx";
import {Dropdown} from "@/components/util/Dropdown.tsx";
import {getCaretCharacterOffsetWithin} from "@/utils/text-selection.ts";
import {BookmarkLocationMarker} from "@/components/text/BookmarkLocationMarker.tsx";
import {SavedText} from "@/types/SavedText.ts";
import {DoneReadingButton} from "@/components/text/DoneReadingButton.tsx";

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
	},
	untitledText: {
		id: "title.untitledText",
		description: "untitled text title",
		defaultMessage: "(Untitled)",
	},
	linkCopied: {
		id: "alert.linkCopied",
		description: "alert message",
		defaultMessage: "The link has been copied to your clipboard",
	},
	editText: {
		id: "text.editText",
		description: "dropdown button",
		defaultMessage: "Edit text"
	},
	deleteText: {
		id: "text.deleteText",
		description: "dropdown button",
		defaultMessage: "Delete text",
	},
	shareText: {
		id: "text.shareText",
		description: "dropdown button",
		defaultMessage: "Share text"
	},
	report: {
		id: "text.shareText",
		description: "dropdown button",
		defaultMessage: "Report"
	}
})


export const SingleText = () => {
	const {hash} = useParams();
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useBunkoDispatch();
	const {formatMessage} = useIntl();
	const {showAlert, alertType, commentDeleteData} = useBunkoSelector(state => state.modal);
	const text : BunkoText |undefined = useBunkoSelector(state => hash ? state.texts[hash] : undefined);
	const currentUser : string | undefined = useBunkoSelector(state => {
		const user : UserBadge | undefined = state.currentUser.user;
		return user ? user.username : undefined;
	});

	const loadingSuccess : boolean | undefined = text && !text.loading && !text.error;
	const isOwner : boolean = useIsOwner(loadingSuccess ? text?.author.username : undefined, currentUser);
	const isLiked : boolean = loadingSuccess ? text !== undefined && text.likes.filter((like) => {
		return like.user.username === currentUser;
	}).length > 0 : false;

	const isSaved : boolean = loadingSuccess ? text !== undefined && text.savedBy.filter((save : SavedText) => {
		return save.user.username === currentUser;
	}).length > 0 : false;

	useEffect(() => {
		if (hash === undefined) {
			navigate(paths.notFound.getHref());
		} else {
			if (!text) {
				dispatch(fetchText(hash));
			}
		}

		if (text !== undefined) {
			document.title = text.title ? text.title : formatMessage(messages.untitledText);

			if (location.hash !== "") {
				const hashlink: HTMLElement | null = document.getElementById(location.hash.substring(1));
				if (hashlink !== null) {
					hashlink.scrollIntoView({behavior: "smooth"});
					window.setTimeout(() => {
						hashlink.focus();
					}, 300);
				}
			}
		}
	}, [formatMessage, location, text]);

	const getDropdownContent = useCallback(() => {
		const items = [];
		if (isOwner) {
			items.push(
				<div className="nav-btn" onClick={handleEditText}>
					<IconEdit/>
					{formatMessage(messages.editText)}
				</div>
			);
			items.push(
				<div className="nav-btn" onClick={showDeletePrompt}>
					<IconTrash/>
					{formatMessage(messages.deleteText)}
				</div>
			);
		} else {
			items.push(
				<div className="nav-btn" onClick={handleShareText}>
					<IconShare3/>
					{formatMessage(messages.shareText)}
				</div>
			);
			items.push(
				<div className="nav-btn" onClick={handleReport}>
					<IconAlertTriangle/>
					{formatMessage(messages.report)}
				</div>
			);
		}
		return items;
	}, [formatMessage, isOwner]);

	const handleEditText = useCallback(() => {
		if (text !== undefined) {
			navigate(paths.editText.getHref() + text.hash)
		}
	}, [text, navigate]);

	const handleShareText = useCallback(() => {
		if (text !== undefined) {
			navigator.clipboard.writeText(window.location.toString()).then(() => {
				alert(formatMessage(messages.linkCopied))
			});
		}
	}, [text, formatMessage]);

	const handleReport = useCallback(() => {
		if (text !== undefined) {
			// Handle report feature later
		}
	}, [text]);



	const showDeletePrompt = useCallback(() => {
		dispatch(confirmDelete());
	}, [dispatch]);

	const showPublishPrompt = useCallback(() => {
		dispatch(confirmPublication());
	}, [dispatch]);

	const handleBookmarking = useCallback((event : React.MouseEvent<HTMLElement>) => {
		if (event.detail === 2 && text !== undefined) {
			event.preventDefault();
			const targetNode : HTMLElement | null = document.getElementById('text-content');
			if (targetNode !== null) {
				const endPosition : number = getCaretCharacterOffsetWithin(targetNode);
				window.getSelection()?.removeAllRanges();
				dispatch(setBookmark({position: endPosition, textHash: text.hash}));
			}
		}
	}, [text]);

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
			case C.DELETE_COMMENT : {
				if (commentDeleteData !== undefined) {
					dispatch(deleteComment(commentDeleteData));
				}
				break;
			}
		}
	}, [hash, text, navigate, dispatch, currentUser, alertType]);

	if (text === undefined) {
		return <NotFound/>;
	}
	if (text.loading) {
		return <LoadingContainer/>;
	} else if (text.error) {
		return <ErrorHandler statusCode={text.error} redirectTo={location.pathname} />;
	} else {
		return (
			<div id="text-container">
				<div className="text-title">{text.title ? text.title : formatMessage(messages.untitledText)}</div>
				<Link to={`${paths.profile.getHref()}${text.author.username}`}>
					<div className="text-author">{formatMessage(messages.author, {
						0: text.author.firstName || text.author.lastName ? `${text.author.firstName} ${text.author.lastName}` : text.author.username})}</div>
				</Link>
				{text.series &&
					(<Link to={{pathname: `${paths.series.getHref()}${text.series.id}`}}>
						<div className="text-series-info">
							<span className="series-name">{text.series.title} {text.seriesEntry && toRoman(text.seriesEntry)}</span>
						</div>
					</Link>)
				}
				<div className="reader-genres">{text.genres.map((genre: Genre) => {
					return (<ClickableTag key={genre.tag} tag={genre.tag}/>);
				})}</div>
				<div id="text-content" onClick={handleBookmarking}><Markdown>{text.content}</Markdown></div>
				<BookmarkLocationMarker bookmarkLocation={text.bookmarkPosition}/>
				{!text.isDraft ? (
					<>
						<DoneReadingButton text={text} position={text.bookmarkPosition} />
						<div className="actions">
							<div className="reactions">
								<LikeButton liked={isLiked} text={text}/>
								<CommentButton text={text}/>
								<SaveButton saved={isSaved} text={text}/>
							</div>
							<div className="options">
								<Dropdown items={getDropdownContent()} align="end"/>
							</div>
						</div>
						<CommentSection text={text} comments={text.comments}/>
					</>
				) : isOwner ? (
					<div id="draft-actions" className="button-wrapper">
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