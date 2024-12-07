import {useEffect} from "react";
import {loadUserProfile} from "../../features/profile/api/load-user-profile.ts";
import {Link, useLocation, useParams} from "react-router-dom";
import {Loading} from "../../components/Loading.tsx";
import {paths} from "../../config/paths.ts";
import {TextDescription} from "../../types/Text.ts";
import {useQuery} from "@tanstack/react-query";
import {ErrorHandler} from "../../components/ErrorHandler.tsx";
import {NotFound} from "../../components/NotFound.tsx";

export const Profile = () => {
	const location = useLocation();
	const {username} = useParams();

	useEffect(() => {
		if (typeof username === "string") {
			document.title = `${username}'s profile`;
		}
	}, [username]);

	const {data: profile, isLoading, error} = useQuery({
		queryKey: ["profile", username],
		queryFn: () => loadUserProfile(username!),
		refetchOnWindowFocus: false,
		retry: 0,
	})

	if (isLoading) {
		return <Loading />;
	} else if (error) {
		return <ErrorHandler statusCode={error.message} redirectTo={location.pathname} />;
	} else if (profile === undefined) {
		return <NotFound/>;
	} else {
		return (
			<div id="user-profile">
				<>
					<div className="user-info">
						<span className="full-name">{profile.firstName} {profile.lastName}</span>
						<div className="username">@{profile.username}</div>
						<div className="follows">
							<Link to={{pathname: `${paths.followers.getHref()}${profile.username}`}}>
								<div className="followers">{profile.followers} Followers</div>
							</Link>
							<Link to={{pathname: `${paths.following.getHref()}${profile.username}`}}>
								<div className="following">{profile.following} Following</div>
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
						{
							profile.texts.map((text: TextDescription, index) => {
								return (
									<div key={"text" + index}>
										<div className="title">{text.title}</div>
										{text.series !== null &&
											<div className="series">
												<Link to={{pathname: `${paths.series.getHref()}${text.series.id}`}}>
													<span className="series-title">{text.series.title} - part {text.seriesEntry}</span>
												</Link>
											</div>
										}
									</div>
								);
							})
						}
					</div>
				</>
			</div>
		);
	}
}