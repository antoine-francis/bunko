import {Link, NavigateFunction, useNavigate, useParams} from "react-router-dom";
import {Loading} from "../../components/Loading.tsx";
import {paths} from "../../config/paths.ts";
import {fetchProfile} from "../../slices/ProfilesSlice.ts";
import {useBunkoDispatch, useBunkoSelector} from "../../hooks/redux-hooks.ts";
import {ErrorHandler} from "../../components/ErrorHandler.tsx";
import {FormattedDate} from "react-intl";
import {useIsOwner} from "../../hooks/is-owner-hook.ts";
import {UserBadge, UserProfile} from "../../types/UserProfile.ts";
import {ReactNode} from "react";
import {TextDescription} from "../../types/Text.ts";
import {BunkoDispatch} from "../../store.ts";

export const Profile = () => {
	const {username} = useParams();
	const navigate : NavigateFunction = useNavigate();
	const dispatch : BunkoDispatch = useBunkoDispatch();
	const profile : UserProfile | undefined = useBunkoSelector(state => username ? state.userProfiles[username] : undefined);
	const currentUser : string | undefined = useBunkoSelector(state => {
		const user : UserBadge | undefined = state.currentUser.user;
		return user ? user.username : undefined;
	});
	const isOwner = useIsOwner(username, currentUser);


	if (username === undefined) {
		navigate(paths.notFound.getHref());
	} else {
		if (!profile) {
			dispatch(fetchProfile(username));
		}
		document.title = `${username}'s profile`;
	}

	const getSortedTexts = () => {
		const published : ReactNode[] = [];
		const drafts : ReactNode[] = [];
		if (profile !== undefined) {
			for (let i : number = 0; i < profile.texts.length; i++) {
				const text : TextDescription = profile.texts[i];
				if (text.isDraft && isOwner) {
					drafts.push(
						<div key={"draft" + i}>
							<div className="title-date">{text.title} - <FormattedDate value={text.modificationDate ? text.modificationDate : text.creationDate}/></div>
							{text.series !== null &&
								<div className="series">
									<Link to={{pathname: `${paths.series.getHref()}${text.series.id}`}}>
														<span
															className="series-title">{text.series.title} - part {text.seriesEntry}</span>
									</Link>
								</div>
							}
						</div>
					);
				} else {
					published.push(
						<div key={"text" + i}>
							<div className="title-date">{text.title} - <FormattedDate value={text.publicationDate}/></div>
							{text.series !== null &&
								<div className="series">
									<Link to={{pathname: `${paths.series.getHref()}${text.series.id}`}}>
														<span
															className="series-title">{text.series.title} - part {text.seriesEntry}</span>
									</Link>
								</div>
							}
						</div>
					);
				}
			}
			return (
				<>
					<div className="texts">
						<span className="text-count">{published.length} texts</span>
						{published}
					</div>
					{isOwner && (
						<div className="drafts">
							<span className="drafts-count">{drafts.length} drafts</span>
							{drafts}
						</div>
					)}
				</>
			)
		}
	}

	if (!profile) {
		return null;
	} else {
		if (profile.loading !== undefined && profile.loading) {
			return <Loading/>;
		} else if (profile.error) {
			return <ErrorHandler statusCode={profile.error}/>;
		} else {
			return (
				<div id="user-profile">
					<>
						<div className="user-info">
							{/*<UserBadge profile={profile}/>*/}
							<span className="full-name">{profile.firstName} {profile.lastName}</span>
							<div className="username">@{profile.username}</div>
							<div className="join-date">Member since <FormattedDate value={profile.signupDate}/></div>
							{!isOwner && <div className="follow-button">
								{profile.followers.filter((sub) => {return sub.user.username === currentUser}).length === 0 ?
									<button>Follow</button> :
								<button>Unfollow</button>}
								</div>}
							<div className="follows">
								<Link to={{pathname: `${paths.followers.getHref()}${profile.username}`}}>
									<div className="followers">{profile.followers.length} Followers</div>
								</Link>
								<Link to={{pathname: `${paths.following.getHref()}${profile.username}`}}>
									<div className="following">{profile.following.length} Following</div>
								</Link>

								<div className="bookmarks">{profile.bookmarks.length} Bookmarks</div>
							</div>
							<div className="bio">{profile.bio}</div>
						</div>
						{profile.collectives !== undefined && profile.collectives.length > 0 && (
							<div className="collectives">
								{profile.collectives.map((coll, index) => {
										const {collective} = coll;
										if (collective !== undefined) {
											return (
												<div key={"coll-" + index} className={"collective"}>
													<Link to={{pathname: `${paths.collective.getHref()}${collective.id}`}}>
														{collective.name} - {collective.members.length}
													</Link>
												</div>
											);
										} else {
											return null;
										}
									}
								)}
							</div>
						)}
						<div className="texts">
							{getSortedTexts()}
						</div>
					</>
				</div>
			);
		}
	}
}