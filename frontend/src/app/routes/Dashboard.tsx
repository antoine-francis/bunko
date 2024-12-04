import {BunkoText} from "../../types/Text.ts";
import {useEffect, useState} from "react";

import {loadTexts} from "../../features/dashboard/api/load-texts.ts";
import {paths} from "../../config/paths.ts";
import {Link} from "react-router-dom";
import {Loading} from "../../components/Loading.tsx";

export const Dashboard = () => {
	const [texts, setTexts] = useState<BunkoText[]>([]);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		async function getTexts() {
			setTexts(await loadTexts());
			setLoaded(true);
		}

		if (!loaded) {
			getTexts().catch(e => {
				console.error(e);
			});
		}
	}, [texts]);

return (
	<div id="dashboard">
		{!loaded ? <Loading/> : texts.map((text: BunkoText, index: number) => {
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
)
}