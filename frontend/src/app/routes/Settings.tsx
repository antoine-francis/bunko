import {Link, NavigateFunction, useNavigate} from "react-router-dom";
import {paths} from "@/config/paths.ts";
import {useBunkoDispatch} from "@/hooks/redux-hooks.ts";
import {defineMessages, useIntl} from "react-intl";
import {useEffect} from "react";
import {BunkoDispatch} from "@/store.ts";
import {
	IconEdit,
	IconSettings,
} from "@tabler/icons-react";

const messages = defineMessages({
	settings: {
		id: "settings",
		defaultMessage: "Settings",
		description: "Settings page",
	},
	editUserInfo: {
		id: "editUserInfo",
		defaultMessage: "Edit user information",
		description: "Settings page",
	},
	editUserInfoDesc: {
		id: "editUserInfo",
		defaultMessage: "Change your name, username, profile picture",
		description: "Settings page",
	},
	generalPreferences: {
		id: "generalPreferences",
		defaultMessage: "General",
		description: "Settings page",
	},
	genPrefDesc: {
		id: "genPrefDesc",
		defaultMessage: "Language, privacy, account",
		description: "Settings page",
	},
})

export const Settings = () => {
	const {formatMessage} = useIntl();
	const navigate : NavigateFunction = useNavigate();
	const dispatch : BunkoDispatch = useBunkoDispatch();
	// const currentUser : string | undefined = useBunkoSelector(state => {
	// 	const user : UserBadge | undefined = state.currentUser.user;
	// 	return user ? user.username : undefined;
	// });

	// const {settings, loading, error} = useBunkoSelector(state => state.userSettings);

	useEffect(() => {
		document.title = formatMessage(messages.settings);
	}, [dispatch ,navigate])

	return (
		<div className="user-settings">
			<h2>{formatMessage(messages.settings)}</h2>

			<div className="settings-section">
				<div className="section-icon">
					<IconEdit/>
				</div>
				<Link className="section-caption" to={paths.editProfile.getHref()}>
					<h4>{formatMessage(messages.editUserInfo)}</h4>
					<span className="description no-highlight">
					{formatMessage(messages.editUserInfoDesc)}
				</span>
				</Link>
			</div>
			<div className="settings-section">
				<div className="section-icon">
					<IconSettings/>
				</div>
				<Link className="section-caption" to={paths.editProfile.getHref()}>
					<h4>{formatMessage(messages.generalPreferences)}</h4>
					<span className="description no-highlight">
					{formatMessage(messages.genPrefDesc)}
				</span>
				</Link>
			</div>
		</div>
	);
}