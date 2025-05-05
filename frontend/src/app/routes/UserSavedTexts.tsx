import {TextsList} from "@/components/texts-list/TextsList.tsx";
import {useEffect} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {ErrorHandler} from "@/components/ErrorHandler.tsx";
import {useBunkoSelector} from "@/hooks/redux-hooks.ts";
import {paths} from "@/config/paths.ts";
import {UserProfile} from "@/types/UserProfile.ts";
import {TextDescription} from "@/types/Text.ts";
import {SavedText} from "@/types/SavedText.ts";
import {LoadingContainer} from "@/components/LoadingContainer.tsx";

export const UserSavedTexts = () => {
	const {username} = useParams();
	const location = useLocation();
	const navigate = useNavigate();
	const profile : UserProfile | undefined = useBunkoSelector(state => username ? state.userProfiles[username] : undefined);

	useEffect(() => {
		if (profile !== undefined) {
			document.title = `${profile.username}'s list`;
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
		const savedTextDesc : TextDescription[] = profile.saves.map((savedText : SavedText) => {
			return savedText.text;
		})
		return (
			<>
				<div id="savelist-container">
					<TextsList showAuthor={true} texts={savedTextDesc}/>
				</div>
			</>
		);
	}

}