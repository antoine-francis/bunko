import {BunkoText} from "../../types/Text.ts";
import {useEffect} from "react";

import {loadTexts} from "../../features/dashboard/api/load-texts.ts";
import {paths} from "../../config/paths.ts";
import {Link, useLocation} from "react-router-dom";
import {Loading} from "../../components/Loading.tsx";
import {useQuery} from "@tanstack/react-query";
import {ErrorHandler} from "../../components/ErrorHandler.tsx";
import {EmptyList} from "../../components/users-list/EmptyList.tsx";

export const Dashboard = () => {
	const location = useLocation();

	useEffect(() => {
		document.title = "Home - Bunko";
	}, []);

	const { data: texts, isLoading, error } = useQuery<BunkoText[] | undefined>({
		queryKey: ["dashboardTexts"],
		queryFn: () => loadTexts(),
		refetchOnWindowFocus: false,
		retry: 0,
	});

	if (isLoading) {
		return <Loading />;
	} else if (error) {
		return <ErrorHandler statusCode={error.message} redirectTo={location.pathname} />;
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