import {defineMessages, useIntl} from "react-intl";
import {ChangeEvent, useCallback, useEffect, useState} from "react";
import {useBunkoDispatch, useBunkoSelector} from "../../../hooks/redux-hooks.ts";
import {
	closeModal,
	confirmLostChanges,
	confirmPublication,
} from "../../../slices/ModalSlice.ts";
import {
	createText,
	finishLoading, resetEditor
} from "../../../slices/TextEditorSlice.ts";
import {ModalDialog} from "../../../components/layout/ModalDialog.tsx";
import {C} from "../../../constants/Constants.ts";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {paths} from "../../../config/paths.ts";
import {EditorContent} from "../../../types/Text.ts";
import {Genre} from "../../../types/Genre.ts";
import {fetchText, updateText} from "../../../slices/TextSlice.ts";
import {Series} from "../../../types/Series.ts";
import {UserBadge, UserProfile} from "../../../types/UserProfile.ts";
import {fetchProfile} from "../../../slices/ProfilesSlice.ts";
import {Loading} from "../../../components/Loading.tsx";

const messages = defineMessages({
	textPlaceholder: {
		id: "text.placeholder",
		description: "placeholder for text editor",
		defaultMessage: "Start writing here!",
	},
	synopsisPlaceholder: {
		id: "text.synopsisPlaceholder",
		description: "placeholder for text editor",
		defaultMessage: "Type a few words to summarize your story",
	},
	titlePlaceholder: {
		id: "title.placeholder",
		description: "placeholder for text editor",
		defaultMessage: "Title",
	},
	seriesTitlePlaceholder: {
		id: "title.seriesTitlePlaceholder",
		description: "placeholder for text editor",
		defaultMessage: "Series title...",
	},
	addTags: {
		id: "text.genreTags",
		description: "placeholder for adding tags",
		defaultMessage: "Add some tags separated by a coma...",
	},
	saveAsDraft: {
		id: "text.saveAsDraft",
		description: "Button text",
		defaultMessage: "Save as draft",
	},
	saveDraft: {
		id: "text.saveDraft",
		description: "Button text",
		defaultMessage: "Save draft",
	},
	publish: {
		id: "text.publish",
		description: "Button text",
		defaultMessage: "Publish",
	},
	saveAndPublish: {
		id: "text.saveAndPublish",
		description: "Button text",
		defaultMessage: "Save and publish",
	},
	publishChanges: {
		id: "text.publishChanges",
		description: "Button text",
		defaultMessage: "Publish changes",
	},
	cancelChanges: {
		id: "text.cancelChanges",
		description: "Button text",
		defaultMessage: "Cancel changes",
	},
	untitledText: {
		id: "title.untitledText",
		description: "untitled text title",
		defaultMessage: "(Untitled)",
	},
	partOfSeries: {
		id: "text.partOfSeries",
		description: "Label for extra fields",
		defaultMessage: "Part of a series",
	},
	createNewSeries: {
		id: "text.createNewSeries",
		description: "Label for extra fields",
		defaultMessage: "Create a new series...",
	}
})

export const TextEditor = () => {
	const {hash} = useParams();
	const {newHash, loading} = useBunkoSelector(state => state.textEditor);
	const {showAlert, alertType} = useBunkoSelector(state => state.modal);
	const text = useBunkoSelector(state => hash ? state.texts[hash] : undefined);
	const {formatMessage} = useIntl();
	const navigate = useNavigate();
	const dispatch = useBunkoDispatch();
	const [extraFieldsToggled, setExtraFieldsToggled] = useState(false);
	const currentUser : string | undefined = useBunkoSelector(state => {
		const user : UserBadge | undefined = state.currentUser.user;
		return user ? user.username : undefined;
	});
	const currentUserProfile : UserProfile | undefined = useBunkoSelector(state => currentUser ? state.userProfiles[currentUser] : undefined);
	const [partOfSeries, setPartOfSeries] = useState<boolean>(false);
	const [selectedSeries, setSelectedSeries] = useState<number | undefined>(undefined);
	const [newSeriesInput, setNewSeriesInput] = useState<boolean>(false);
	const [newSeriesTitle, setNewSeriesTitle] = useState<string>("");
	const [content, setContent] = useState<string>(text ? text.content : "");
	const [synopsis, setSynopsis] = useState<string>(text && text.synopsis ? text.synopsis : "");
	const [title, setTitle] = useState<string>(text ? text.title : "");
	const [tags, setTags] = useState<string>(text && !text.loading ? text.genres.map(genre => {
		return genre.tag
	}).join(", ") : "");

	useEffect(() => {
		if (!currentUserProfile && currentUser) {
			dispatch(fetchProfile(currentUser));
		}
		if (hash) {
			if (loading) {
				dispatch(fetchText(hash));
				dispatch(finishLoading());
			}
			if (!loading && text && !text.loading) {
				setContent(text.content);
				setTitle(text.title);
				setTags(text.genres.map(genre => {
					return genre.tag
				}).join(", "));
				text.synopsis && setSynopsis(text.synopsis);
				if (text.series) {
					setPartOfSeries(true);
					setSelectedSeries(text.series.id);
				}
			}
		} else {
			dispatch(finishLoading());
			setContent("");
			setTitle("");
			setTags("")
		}

		// If there is a newHash it means the text was created and we redirect to the reading page
		newHash && navigate(paths.singleText.getHref() + newHash);
	}, [text, dispatch, hash, loading, newHash, navigate, currentUser, currentUserProfile]);

	const toggleExtraFields = useCallback(() => {
		setExtraFieldsToggled(!extraFieldsToggled);
		const popup = document.getElementById("extra-fields-popup");
		if (popup !== null) {
			if (extraFieldsToggled) {
				popup.style.display = "block";
			} else {
				popup.style.display = "none";
			}

		}
	}, [extraFieldsToggled]);

	const saveDraft = () => {
		save(true);
	}

	const cancelChanges = useCallback(() => {
		dispatch(confirmLostChanges());
	}, [dispatch]);

	const save = useCallback((isDraft: boolean) => {
		const genres = [];
		if (tags !== "") {
			const tagList = tags.split(",");
			for (let tag of tagList) {
				genres.push({tag: tag.toLowerCase().trim()} as Genre);
			}
		}
		if (text) {
			const updatedText = Object.assign({}, text, {
				content,
				title: title !== "" ? title : formatMessage(messages.untitledText),
				genres,
				isDraft,
				synopsis,
				series: partOfSeries && selectedSeries && currentUserProfile ? currentUserProfile.series.find((s: Series) => {
					return s.id === selectedSeries;
				}) : undefined,
				// If the series exists,
				seriesEntry: selectedSeries && text.series ?
					text.series.entries.length + 1 :
					partOfSeries ? 0 : undefined
			});
			dispatch(updateText(updatedText));
			navigate(paths.singleText.getHref() + text.hash);
			dispatch(resetEditor())
		} else {
			const newText : EditorContent = {
				content,
				title: title !== "" ? title : formatMessage(messages.untitledText),
				genres,
				isDraft,
				synopsis,
			}
			dispatch(createText(newText));
		}
	}, [dispatch, synopsis, currentUserProfile, tags, title, content, navigate, text, formatMessage, partOfSeries, selectedSeries]);

	const publishText = useCallback(() => {
		dispatch(confirmPublication());
	}, [dispatch]);

	const handleSeriesSelectChange = useCallback((e : React.ChangeEvent<HTMLSelectElement>) => {
		const selectedId = parseInt(e.target.value);
		setNewSeriesInput(selectedId === 0);
		setSelectedSeries(selectedId);
	}, [])

	const confirmAction = useCallback(() => {
		switch (alertType) {
			case C.PUBLISH_TEXT:
				save(false);
				text !== undefined ? navigate(paths.singleText.getHref() + text.hash) : navigate(paths.home.getHref());
				break;
			case C.CANCEL_EDIT:
				dispatch(closeModal());
				text !== undefined ? navigate(paths.singleText.getHref() + text.hash) : navigate(paths.home.getHref());
		}
	}, [save, text, navigate, dispatch, alertType]);

	if (hash && text && (text.loading || loading || !currentUserProfile)) {
		return <Loading />;
	} else if (hash && text && !text.loading && currentUserProfile && text.author.username !== currentUserProfile.username) {
		return (<Navigate to={paths.singleText.getHref() + text.hash} />)
	} else {
		return (
			<div id="text-editor-container">
				<input type="text"
					   value={title}
					   className="seamless-input text-title-editor"
					   placeholder={formatMessage(messages.titlePlaceholder)}
					   onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}/>
				<input type="text" id="genre-tags"
					   value={tags}
					   className="seamless-input"
					   placeholder={formatMessage(messages.addTags)}
					   onChange={(e: ChangeEvent<HTMLInputElement>) => setTags(e.target.value)}/>
				<textarea
					value={content}
					onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
					className="text-editor seamless-input"
					placeholder={formatMessage(messages.textPlaceholder)}/>
				<div id="extra-fields-popup" style={!extraFieldsToggled ? {display: "none"} : {display: "block"}}>
				<textarea
					value={synopsis}
					rows={3}
					maxLength={255}
					onChange={(e : ChangeEvent<HTMLTextAreaElement>) => setSynopsis(e.target.value)}
					id="synopsis-input"
					className="seamless-input"
					placeholder={formatMessage(messages.synopsisPlaceholder)}/>
					<div className="series-info-container">
						<label className="extra-fields-checkbox" htmlFor="series-checkbox">
							<input
								type="checkbox"
								id="series-checkbox"
								checked={partOfSeries}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
									setPartOfSeries(e.target.checked);
								}}
							/>
							Part of Series
						</label>
						{partOfSeries && <select value={selectedSeries} onChange={handleSeriesSelectChange}>
							<option value={undefined}>---</option>
							{currentUserProfile && currentUserProfile.series && currentUserProfile.series.map((series: Series) => {
								return (
									<option key={series.id} value={series.id}
												onSelect={() => setNewSeriesInput(false)}>
										{series.title}
									</option>);
							})}
							<option value="0" id="new-series-opt"
									onSelect={() => setNewSeriesInput(true)}>
								{formatMessage(messages.createNewSeries)}
							</option>
						</select>}
						{newSeriesInput && <input type="text" id="new-series-input"
												  value={newSeriesTitle}
												  className="seamless-input"
												  placeholder={formatMessage(messages.seriesTitlePlaceholder)}
												  onChange={(e: ChangeEvent<HTMLInputElement>) => setNewSeriesTitle(e.target.value)}/>}
					</div>
				</div>
				<footer id="editor-footer" className="action-buttons text-editor-buttons">
					<button id="cancel-changes" onClick={cancelChanges}>{formatMessage(messages.cancelChanges)}</button>
					<button id="" onClick={toggleExtraFields}>{extraFieldsToggled ? "▼" : "▲"}</button>
					<button id="save-draft" onClick={saveDraft}>{text && text.isDraft ?
						formatMessage(messages.saveDraft) :
						formatMessage(messages.saveAsDraft)}
					</button>
					<button id="publish" onClick={publishText}>{!text ?
						formatMessage(messages.publish) :
						text && text.isDraft ?
							formatMessage(messages.saveAndPublish) :
							formatMessage(messages.publishChanges)
					}
					</button>
				</footer>
				<ModalDialog isOpen={showAlert}
							 type={alertType}
							 confirmFunction={confirmAction}/>
			</div>
		)
	}
}