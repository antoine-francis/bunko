import {TextsList} from "@/components/texts-list/TextsList.tsx";
import {useEffect} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {ErrorHandler} from "@/components/ErrorHandler.tsx";
import {useBunkoSelector} from "@/hooks/redux-hooks.ts";
import {paths} from "@/config/paths.ts";
import {UserProfile} from "@/types/UserProfile.ts";
import {TextDescription} from "@/types/Text.ts";
import {Bookmark} from "@/types/Bookmark.ts";
import {LoadingContainer} from "@/components/LoadingContainer.tsx";

export const UserBookmarks = () => {
	const {username} = useParams();
	const location = useLocation();
	const navigate = useNavigate();
	const profile : UserProfile | undefined = useBunkoSelector(state => username ? state.userProfiles[username] : undefined);

	useEffect(() => {
		if (profile !== undefined) {
			document.title = `${profile.username}'s bookmarks`;
		}
		if (username === undefined) {
			navigate(paths.notFound.getHref());
		}
	}, [profile, username, navigate]);

	if (!profile) {
		return null;
	} else if (profile.loading) {
		return <LoadingContainer />;
	} else if (profile.error) {
		return <ErrorHandler statusCode={profile.error} redirectTo={location.pathname} />;
	} else {
		const bookmarksTextDesc : TextDescription[] = profile.bookmarks.map((bookmark : Bookmark) => {
			return bookmark.text;
		})
		return (
			<>
				<div id="bookmarks-container">
					<TextsList texts={bookmarksTextDesc}/>
				</div>
			</>
		);
	}

}