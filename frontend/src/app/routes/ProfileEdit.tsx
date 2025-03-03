import {defineMessages, useIntl} from "react-intl";
import {useBunkoDispatch, useBunkoSelector} from "@/hooks/redux-hooks.ts";
import {UserBadge, UserProfile} from "@/types/UserProfile.ts";
import {ChangeEvent, useCallback, useEffect, useState} from "react";
import {paths} from "@/config/paths.ts";
import {fetchProfile, updateProfile} from "@/slices/ProfilesSlice.ts";
import {useNavigate} from "react-router-dom";
import {LoadingContainer} from "@/components/LoadingContainer.tsx";
import {isValidName} from "@/utils/validation-functions.ts";
import Resizer from "react-image-file-resizer";
import {HttpStatus} from "@/constants/Http.ts";

const messages = defineMessages({
	bioPlaceholder: {
		id: "profileEdit.bioPlaceholder",
		description: "input placeholder",
		defaultMessage: "Write a few words about yourself...",
	},
	firstNamePlaceholder: {
		id: "profileEdit.firstNamelaceholder",
		description: "input placeholder",
		defaultMessage: "First name",
	},
	lastNamePlaceholder: {
		id: "profileEdit.lastNamePlaceholder",
		description: "input placeholder",
		defaultMessage: "Last name",
	},
	usernamePlaceholder: {
		id: "profileEdit.usernamePlaceholder",
		description: "input placeholder",
		defaultMessage: "Username",
	},
	saveChanges: {
		id: "profileEdit.saveChanges",
		description: "Button text",
		defaultMessage: "Save changes",
	},
	cancelChanges: {
		id: "profileEdit.cancelChanges",
		description: "Button text",
		defaultMessage: "Cancel changes",
	},
	errorsDetected: {
		id: "profileEdit.errorsDetected",
		description: "Banner text",
		defaultMessage: "Some required fields were left blank!",
	},
	usernameConflict: {
		id: "profileEdit.usernameConflict",
		description: "Banner text",
		defaultMessage: "A user with that username already exists",
	},
})

export const ProfileEdit = () => {
	const [saved, setSaved] = useState<boolean>(false);
	const currentUser : UserBadge | undefined = useBunkoSelector(state => {
		return state.currentUser.user;
	});
	const {loading} = useBunkoSelector(state => state.currentUser);
	const profile : UserProfile | undefined = useBunkoSelector(state =>
		currentUser ? state.userProfiles[currentUser.username] : undefined);
	const [imgUrl, setImgUrl] = useState<string>(profile !== undefined ? profile.picture : "");
	const [imgFile, setImgFile] = useState<File | null>(null);
	const [firstName, setFirstName] = useState<string>(profile !== undefined ? profile.firstName : "");
	const [lastName, setLastName] = useState<string>(profile !== undefined ? profile.lastName : "");
	const [username, setUsername] = useState<string>(profile !== undefined ? profile.username : "");
	const [invalidUsername, setInvalidUsername] = useState<boolean>(false);
	const [invalidFirstName, setInvalidFirstName] = useState<boolean>(false);
	const [invalidLastName, setInvalidLastName] = useState<boolean>(false);
	const [bio, setBio] = useState<string>(profile !== undefined ? profile.bio : "");
	const {formatMessage} = useIntl();
	const dispatch = useBunkoDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		if (currentUser === undefined) {
			if (!loading) {
				navigate(paths.auth.login.getHref());
			}
		} else {
			if (saved) {
				if (profile !== undefined && !profile.loading && profile.error === undefined) {
					navigate(paths.profile.getHref()+currentUser.username);
				}
			} else {
				if (profile === undefined) {
					dispatch(fetchProfile(currentUser.username));
					document.title = `${currentUser.username}'s profile`;
				} else {
					setBio(profile.bio);
					setFirstName(profile.firstName);
					setLastName(profile.lastName);
					setUsername(profile.username);
					setImgUrl(profile.picture);
				}
			}

		}
	}, [dispatch ,navigate, saved, currentUser, loading, profile]);

	const handleCancel = useCallback(() => {
		navigate(paths.profile.getHref() + currentUser?.username);
	}, [navigate, currentUser]);

	const handleSave = useCallback(() => {
		if (username === "") {
			// Username validation + unique check is done server-side
			setInvalidUsername(true);
		} else {
			setInvalidUsername(false);
		}
		if (!isValidName(firstName)) {
			setInvalidFirstName(true);
		} else {
			setInvalidFirstName(false);
		}
		if (lastName !== "" && !isValidName(lastName)) {
			setInvalidLastName(true);
		} else {
			setInvalidLastName(false);
		}

		const issue = invalidUsername || invalidFirstName || invalidLastName;

		if (!issue && currentUser !== undefined) {
			const formData = new FormData();
			formData.append("picture", (imgFile as File));
			formData.append("formerUsername", currentUser.username);
			formData.append("firstName", firstName);
			formData.append("lastName", lastName);
			formData.append("username", username);

			dispatch(updateProfile(formData))
			setSaved(true);
		}

	}, [firstName, lastName, username, dispatch, currentUser, invalidLastName, invalidFirstName, invalidUsername, imgFile]);

	const handlePictureChange = useCallback((e : ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0] !== null) {
			Resizer.imageFileResizer(
				e.target.files[0],
				200,
				200,
				"webp",
				100,
				0,
				(file : string | File | Blob | ProgressEvent<FileReader>) : void => {
					if (e.target.files !== null) {
						setImgFile((file as File))
					}
				},
				"file"
			);
			const newSrc : string = URL.createObjectURL(e.target.files[0]);
			setImgUrl(newSrc);
		} else if (profile !== undefined) {
			setImgUrl(profile.picture);
		}
	}, [profile]);

	if (loading) {
		return <LoadingContainer />
	} else if (profile !== undefined) {
		return (
			<div id="profile-edit-container" className="container">
				<div id="profile-edit-form">
					<div id="picture-edit">
						<img src={imgUrl} alt={profile.username} className="profile-pic"/>
						<input type="file" className="file-upload" onChange={handlePictureChange}
							   id="profile-pic-upload" accept="image/png, image/jpeg"/>
					</div>
					{(invalidFirstName || invalidLastName || invalidUsername || profile.error) &&
						<div className="alert-banner">
							{profile.error === HttpStatus.CONFLICT ?
								formatMessage(messages.usernameConflict) : formatMessage(messages.errorsDetected)}
						</div>
					}
					<div id="full-name">
						<input className={invalidFirstName ? "invalid-input" : ""} id="first-name" value={firstName}
							   type="text" placeholder={formatMessage(messages.firstNamePlaceholder)}
							   onChange={(e: ChangeEvent<HTMLInputElement>) => {
								   setFirstName(e.target.value)
							   }}/>
						<input className={invalidLastName ? "invalid-input" : ""} id="last-name" type="text"
							   value={lastName} placeholder={formatMessage(messages.lastNamePlaceholder)}
							   onChange={(e: ChangeEvent<HTMLInputElement>) => {
								   setLastName(e.target.value)
							   }}/>
					</div>
					<input disabled id="email" type="text"
						   value={currentUser?.email} placeholder={formatMessage(messages.lastNamePlaceholder)}/>
					<div id="username">
						<span id="at-symbol">@</span>
						<input className={invalidUsername ? "invalid-input" : ""} required id="username" type="text"
							   value={username} placeholder={formatMessage(messages.usernamePlaceholder)}
							   onChange={(e: ChangeEvent<HTMLInputElement>) => {
								   setUsername(e.target.value)
							   }}/>
					</div>
					<textarea name="" id="bio" rows={3} maxLength={255}
							  placeholder={formatMessage(messages.bioPlaceholder)}
							  defaultValue={bio} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
						setBio(e.target.value)
					}}/>
					<footer className="button-wrapper" id="profile-edit-buttons">
						<button id="cancel-changes" onClick={handleCancel}>{formatMessage(messages.cancelChanges)}
						</button>
						<button id="save-changes" onClick={handleSave}>{formatMessage(messages.saveChanges)}
						</button>
					</footer>
				</div>
			</div>
		);
	}
}