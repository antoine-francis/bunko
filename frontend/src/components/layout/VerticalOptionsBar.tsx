import {Link, useNavigate} from "react-router-dom";
import {paths} from "@/config/paths.ts";
import {useBunkoDispatch, useBunkoSelector} from "@/hooks/redux-hooks.ts";
import {defineMessages, useIntl} from "react-intl";
import {
	IconHash,
	IconHome,
	IconLayoutGrid,
	IconLogout,
	IconMoon,
	IconSettings,
	IconSun,
	IconUsersGroup
} from "@tabler/icons-react";
import {toggleDarkMode, toggleVerticalBar} from "@/slices/UiStateSlice.ts";
import {useCallback, useEffect} from "react";
import {Footer} from "@/components/layout/Footer.tsx";
import {Dropdown} from "@/components/util/Dropdown.tsx";

const messages = defineMessages({
	home: {
		id: "menubar.home",
		description: "Menu bar button",
		defaultMessage: "Home",
	},
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
	const navigate = useNavigate();

	useEffect(() => {
		// hides sidebar on click -- mobile
		window.addEventListener("click", (event : MouseEvent) => {
			const isMobileScreen : boolean = window.innerWidth <= 700;
			if (isMobileScreen && event.target && event.target instanceof Element && event.target.classList.contains("nav-btn")) {
				dispatch(toggleVerticalBar(false));
			}
		})
		return window.removeEventListener("click", (event : MouseEvent) => {
			const isMobileScreen : boolean = window.innerWidth <= 700;
			if (isMobileScreen && event.target && event.target instanceof Element && event.target.classList.contains("nav-btn")) {
				dispatch(toggleVerticalBar(false));
			}
		})
	}, [showVerticalOptionsBar]);

	useEffect(() => {
		window.addEventListener("resize", () => {
			const isMobileScreen : boolean = window.innerWidth <= 700;
			if (!isMobileScreen) {
				const userPref : boolean = JSON.parse(localStorage.getItem('showVerticalOptionsBar') ?? 'true');
				if (showVerticalOptionsBar !== userPref) {
					dispatch(toggleVerticalBar(userPref));
				}
			}
			if (showVerticalOptionsBar) {
				if (isMobileScreen) {
					dispatch(toggleVerticalBar(false));
				}
			}
		})

		return window.removeEventListener("resize", () => {
			const isMobileScreen : boolean = window.innerWidth <= 700;
			if (!isMobileScreen) {
				const userPref : boolean = JSON.parse(localStorage.getItem('showVerticalOptionsBar') ?? 'true');
				if (showVerticalOptionsBar !== userPref) {
					dispatch(toggleVerticalBar(userPref));
				}
			}
			if (showVerticalOptionsBar) {
				if (isMobileScreen) {
					dispatch(toggleVerticalBar(false));
				}
			}
		})
	}, [showVerticalOptionsBar]);

	const getDropdownContent = useCallback(() => {
		const items = [];
		items.push(
			<div className="nav-btn" onClick={() => navigate(paths.settings.getHref())}>
				<IconSettings/>
				{formatMessage(messages.settings)}
			</div>
		);
		items.push(
			<div className="nav-btn" onClick={() => navigate(paths.auth.logout.getHref())}>
				<IconLogout/>
				{formatMessage(messages.logout)}
			</div>
		);
		return items;
	}, [formatMessage, navigate])

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
					 onClick={() => dispatch(toggleVerticalBar(false))}/>
				<div id="vertical-options-bar" style={showVerticalOptionsBar ? {left: "0px"} : {left: "-225px"}}>
					<div id="vertical-bar-content">
						<ul>
							<li>
								<Link to={{pathname: paths.home.getHref()}}>
									<div id="browse-tags" className="nav-btn">
										<IconHome/>
										{formatMessage(messages.home)}
									</div>
								</Link>
							</li>
							<li>
								<Link to={{pathname: paths.writers.getHref()}}>
									<div id="browse-tags" className="nav-btn">
										<IconUsersGroup/>
										{formatMessage(messages.browseWriters)}
									</div>
								</Link>
							</li>
							<li>
								<Link to={{pathname: paths.tags.getHref()}}>
									<div id="browse-tags" className="nav-btn">
										<IconHash/>
										{formatMessage(messages.browseTags)}
									</div>
								</Link>
							</li>
							<li>
								<Link to={{pathname: paths.tags.getHref()}}>
									<div id="browse-tags" className="nav-btn">
										<IconLayoutGrid/>
										{formatMessage(messages.browseSeries)}
									</div>
								</Link>
							</li>
							<hr/>
						</ul>
						<div className="more-options">
							<button id="toggle-dark-mode" onClick={handleDarkModeToggle}>{isDarkMode ? <IconSun/> :
								<IconMoon/>}</button>
							<Dropdown items={getDropdownContent()}/>
						</div>
					</div>
					<Footer/>
				</div>

			</>
		)
	}
}