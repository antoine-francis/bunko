import {Link} from "react-router-dom";
import {paths} from "@/config/paths.ts";
import {useBunkoDispatch, useBunkoSelector} from "@/hooks/redux-hooks.ts";
import {defineMessages, useIntl} from "react-intl";
import {
	IconHash,
	IconLayoutGrid,
	IconLogout,
	IconMoon,
	IconSettings,
	IconSun,
	IconUsersGroup
} from "@tabler/icons-react";
import {toggleDarkMode, toggleVerticalBar} from "@/slices/UiStateSlice.ts";
import {useCallback} from "react";

const messages = defineMessages({
	browseTags: {
		id: "menubar.browseTags",
		description: "Menu bar button",
		defaultMessage: "Browse tags",
	},
	browseSeries: {
		id: "menubar.browseSeries",
		description: "Menu bar button",
		defaultMessage: "Browse series",
	},
	browseWriters: {
		id: "menubar.browseWriters",
		description: "Menu bar button",
		defaultMessage: "Discover writers",
	},
	settings: {
		id: "menubar.settings",
		description: "Menu bar button",
		defaultMessage: "Settings",
	},
	logout: {
		id: "menubar.logout",
		description: "Menu bar button",
		defaultMessage: "Logout",
	}

})

export const VerticalOptionsBar = () => {
	const {formatMessage} = useIntl();
	const dispatch = useBunkoDispatch();
	const {showVerticalOptionsBar, isDarkMode} = useBunkoSelector(state => state.uiState)
	const {user} = useBunkoSelector(state => state.currentUser);

	const handleDarkModeToggle = useCallback(() => {
		const newMode : string = isDarkMode ? "light" : "dark";
		dispatch(toggleDarkMode());
		localStorage.setItem('theme', newMode);
		document.documentElement.setAttribute('data-theme', newMode);
	}, [dispatch, isDarkMode]);

	if (user) {
		return (
			<>
				<div className="close-bar-veil" style={!showVerticalOptionsBar ? {display: "none"} : {display: "block"}}
					 onClick={() => dispatch(toggleVerticalBar())}/>
				<div id="vertical-options-bar" style={showVerticalOptionsBar ? {width: "250px"} : {width: "0"}}>
					<ul>
						<li>
							<IconUsersGroup/>
							<Link to={{pathname: paths.tags.getHref()}}>
								<div id="browse-tags" className="menu-bar-btn">
									{formatMessage(messages.browseWriters)}
								</div>
							</Link>
						</li>
						<li>
							<IconHash/>
							<Link to={{pathname: paths.tags.getHref()}}>
								<div id="browse-tags" className="menu-bar-btn">
									{formatMessage(messages.browseTags)}
								</div>
							</Link>
						</li>
						<li>
							<IconLayoutGrid/>
							<Link to={{pathname: paths.tags.getHref()}}>
								<div id="browse-tags" className="menu-bar-btn">
									{formatMessage(messages.browseSeries)}
								</div>
							</Link>
						</li>
						<li>
							<IconSettings/>
							<Link to={{pathname: paths.profile.getHref() + user.username}}>
								<div className="menu-bar-btn">
									{formatMessage(messages.settings)}
								</div>
							</Link>
						</li>
						<li>
							<IconLogout/>
							<Link to={paths.auth.logout.getHref()}>
								<div className="menu-bar-btn">
									{formatMessage(messages.logout)}
								</div>
							</Link>
						</li>
					</ul>
					<button id="toggle-dark-mode" onClick={handleDarkModeToggle}>{isDarkMode ? <IconSun/> :
						<IconMoon/>}</button>
				</div>
			</>
		)
	}
}