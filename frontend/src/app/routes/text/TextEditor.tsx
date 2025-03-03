import {defineMessages, useIntl} from "react-intl";
import {ChangeEvent, useCallback, useEffect, useState} from "react";
import {useBunkoDispatch, useBunkoSelector} from "@/hooks/redux-hooks.ts";
import {
	closeModal,
	confirmLostChanges,
	confirmPublication,
} from "@/slices/ModalSlice.ts";
import {
	createText,
	finishLoading, resetEditor
} from "@/slices/TextEditorSlice.ts";
import {ModalDialog} from "@/components/layout/ModalDialog.tsx";
import {C} from "@/constants/Constants.ts";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {paths} from "@/config/paths.ts";
import {BunkoText, EditorContent} from "@/types/Text.ts";
import {Genre} from "@/types/Genre.ts";
import {fetchText, updateText} from "@/slices/TextSlice.ts";
import {Series} from "@/types/Series.ts";
import {UserBadge, UserProfile} from "@/types/UserProfile.ts";
import {fetchProfile} from "@/slices/ProfilesSlice.ts";
import {LoadingContainer} from "@/components/LoadingContainer.tsx";

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
	seriesSynopsisPlaceholder: {
		id: "text.seriesSynopsisPlaceholder",
		description: "placeholder for text editor",
		defaultMessage: "Add a synopsis to your series...",
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
	const {newHash, loading, saved} = useBunkoSelector(state => state.textEditor);
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
	const [seriesSynopsis, setSeriesSynopsis] = useState<string>(text && text.series && text.series.synopsis ? text.series.synopsis : "");
	const [title, setTitle] = useState<string>(text ? text.title : "");
	const [tags, setTags] = useState<string>(text && !text.loading && text.genres !== undefined? text.genres.map(genre => {
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
				if (text.synopsis !== undefined) {
					setSynopsis(text.synopsis);
				}
				if (text.series) {
					setPartOfSeries(true);
					setSelectedSeries(text.series.id);
					if (text.series.synopsis !== undefined) {
						setSeriesSynopsis(text.series.synopsis);
					}
				}
			}
		} else {
			dispatch(finishLoading());
			setContent("");
			setTitle("");
			setTags("")
			setSelectedSeries(undefined);
			setSeriesSynopsis("");
		}
		// If there is a newHash it means the text was created and we redirect to the reading page
		if (newHash && saved) {
			// Copying the newHash to make sure it is not lost before the redirection
			const newHashCopy = `${newHash}`
			dispatch(resetEditor());
			navigate(paths.singleText.getHref() + newHashCopy);
		}
	}, [text, dispatch, hash, loading, saved, newHash, navigate, currentUser, currentUserProfile]);

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
		if ((text !== undefined && content === text.content) || text === undefined && content === "") {
			if (text !== undefined) {
				navigate(paths.singleText.getHref() + text.hash);
			} else {
				navigate(paths.home.getHref());
			}
		} else {
			dispatch(confirmLostChanges());
		}
	}, [dispatch, navigate, text, content]);

	const getSeriesInfo = useCallback(() => {
		let series : Series | undefined = undefined;
		if (partOfSeries) {
			if (selectedSeries && selectedSeries > 0 && currentUserProfile) {
				const tempSeries = currentUserProfile.series.find((series: Series) => {
					return series.id === selectedSeries;
				});
				if (tempSeries !== undefined) {
					series = {
						title: tempSeries.title,
						id: tempSeries.id,
						synopsis: seriesSynopsis
					};
				}
			} else if (selectedSeries !== undefined && selectedSeries === 0) {
				series = {
					title: newSeriesTitle,
					id: 0,
					synopsis: seriesSynopsis
				}
			}
			return series;
		} else {
			return undefined;
		}
	}, [currentUserProfile, newSeriesTitle, partOfSeries, selectedSeries, seriesSynopsis]);

	const save = useCallback((isDraft: boolean) => {
		const genres = [];
		if (tags !== "") {
			const tagList = tags.split(",");
			for (const tag of tagList) {
				genres.push({tag: tag.toLowerCase().trim()} as Genre);
			}
		}
		if (text) {
			// update existing text
			const series = getSeriesInfo();
			const updatedText : BunkoText = Object.assign({}, text, {
				content,
				title,
				genres,
				isDraft,
				synopsis,
				series
			});
			dispatch(updateText(updatedText));
			navigate(paths.singleText.getHref() + text.hash);
			dispatch(resetEditor())
		} else {
			const series = getSeriesInfo();
			const newText : EditorContent = {
				content,
				title,
				genres,
				isDraft,
				synopsis,
				series
			}
			dispatch(createText(newText));
		}
	}, [dispatch, synopsis, tags, title, content, navigate, text, getSeriesInfo]);

	const publishText = useCallback(() => {
		dispatch(confirmPublication());
	}, [dispatch]);

	const handleSeriesSelectChange = useCallback((e : ChangeEvent<HTMLSelectElement>) => {
		let selectedId = undefined;
		if (e.target.value !== "") {
			selectedId = parseInt(e.target.value);
		}
		setNewSeriesInput(selectedId === 0);
		setSelectedSeries(selectedId);
		const selectedSeries = currentUserProfile ? currentUserProfile.series.find((series: Series) => {
			return series.id === selectedId;
		}) : undefined;
		if (selectedSeries !== undefined && selectedSeries.synopsis) {
			setSeriesSynopsis(selectedSeries.synopsis)
		} else {
			setSeriesSynopsis("");
		}
	}, [currentUserProfile]);

	const confirmAction = useCallback(() => {
		switch (alertType) {
			case C.PUBLISH_TEXT:
				save(false);
				if (text !== undefined) {
					navigate(paths.singleText.getHref() + text.hash);
				} else {
					navigate(paths.home.getHref());
				}
				break;
			case C.CANCEL_EDIT:
				dispatch(closeModal());
				if (text !== undefined) {
					navigate(paths.singleText.getHref() + text.hash);
				} else {
					navigate(paths.home.getHref());
				}
		}
	}, [save, text, navigate, dispatch, alertType]);

	if (hash && text && (text.loading || loading || !currentUserProfile)) {
		return <LoadingContainer />;
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
				<div id="extra-fields-popup"
					 style={!extraFieldsToggled ? {height: 0} : {height: "300px", display: "block"}}>
				<textarea
					value={synopsis}
					rows={3}
					maxLength={255}
					onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setSynopsis(e.target.value)}
					id="synopsis-input"
					className="seamless-input"
					placeholder={formatMessage(messages.synopsisPlaceholder)}/>
					<div className="series-select-container">
						<label className="extra-fields-checkbox" htmlFor="series-checkbox">
							<input
								type="checkbox"
								id="series-checkbox"
								checked={partOfSeries}
								onChange={(e: ChangeEvent<HTMLInputElement>) => {
									setPartOfSeries(e.target.checked);
								}}
							/>
							Part of Series
						</label>
						{partOfSeries && (
							<select value={selectedSeries} onChange={handleSeriesSelectChange}>
								<option key="no-selection" value="">---</option>
								{currentUserProfile && currentUserProfile.series && currentUserProfile.series.map((series: Series) => (
									<option key={series.id} value={series.id}>
										{series.title}
									</option>
								))}
								<option value="0" id="new-series-opt">
									{formatMessage(messages.createNewSeries)}
								</option>
							</select>
						)}
						{newSeriesInput && <input type="text" id="new-series-input"
												  value={newSeriesTitle}
												  className="seamless-input"
												  placeholder={formatMessage(messages.seriesTitlePlaceholder)}
												  onChange={(e: ChangeEvent<HTMLInputElement>) => setNewSeriesTitle(e.target.value)}/>}
					</div>
					{partOfSeries && selectedSeries !== undefined && <textarea
						value={seriesSynopsis}
						rows={3}
						maxLength={255}
						onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setSeriesSynopsis(e.target.value)}
						id="series-synopsis-input"
						className="seamless-input"
						placeholder={formatMessage(messages.seriesSynopsisPlaceholder)}/>}
				</div>
				<footer id="editor-footer" className="button-wrapper text-editor-buttons">
					<button id="cancel-changes"
							onClick={cancelChanges}>{formatMessage(messages.cancelChanges)}</button>
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