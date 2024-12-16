import {BunkoText} from "../../types/Text.ts";
import {useEffect} from "react";

import {paths} from "../../config/paths.ts";
import {Link, useLocation} from "react-router-dom";
import {Loading} from "../../components/Loading.tsx";
import {ErrorHandler} from "../../components/ErrorHandler.tsx";
import {EmptyList} from "../../components/users-list/EmptyList.tsx";
import {useBunkoDispatch, useBunkoSelector} from "../../hooks/redux-hooks.ts";
import {fetchTexts} from "../../slices/TextListSlice.ts";

export const Dashboard = () => {
	const location = useLocation();
	const dispatch = useBunkoDispatch();
	const {texts, error, loaded} = useBunkoSelector(state => state.dashboard)

	useEffect(() => {
		document.title = "Home - Bunko";
		// Dashboard content should always be refreshed on reload
		dispatch(fetchTexts());
	}, [dispatch]);

	if (!loaded) {
		return <Loading />;
	} else if (error) {
		return <ErrorHandler statusCode={error} redirectTo={location.pathname} />;
	} else if (texts === undefined || !texts.length) {
		return <EmptyList/>;
	} else {
		return (
			<div id="dashboard">
				{texts.map((text: BunkoText, index: number) => {
					return (<div className="text-preview" key={`${text}-${index}`}>
						<Link to={{pathname: `${paths.singleText.getHref()}${text.id}`}} >
							<div>{text.title}</div>
						</Link>
						{/*Ajouter le lien vers le profil*/}
						<Link to={{pathname: `${paths.profile.getHref()}${text.author.username}`}}>
							<p className="author">par {text.author.firstName} {text.author.lastName}</p>
						</Link>

						<Link to={{pathname: `${paths.singleText.getHref()}${text.id}`}}>
							<p>{text.content}</p>
						</Link>
					</div>)
				})}
			</div>
		);
	}
}