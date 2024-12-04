import {useEffect, useState} from "react";
import {loadCollectiveDetails} from "../../features/collectives/api/load-collectives.ts";
import {Link, useParams} from "react-router-dom";
import {Loading} from "../../components/Loading.tsx";
import {EmptyList} from "../../components/users-list/EmptyList.tsx";
import {FormattedDate} from "react-intl";
import {paths} from "../../config/paths.ts";
import {Collective} from "../../types/Collective.ts";

export const CollectiveDetails = () => {
	const [collective, setCollective] = useState<Collective>();
	const [loaded, isLoaded] = useState(false);
	const {id} = useParams();

	useEffect(() => {
		async function getCollectiveDetails() {
			if (id !== undefined) {
				setCollective(await loadCollectiveDetails(id));
				isLoaded(true);
			}
		}

		if (!loaded) {
			getCollectiveDetails().catch(e => {
				console.error(e);
			});
		}
	}, [collective]);

	if (!loaded) {
		return <Loading/>;
	} else if (collective === undefined || collective === null) {
		return <EmptyList/>;
	} else {
		return (
			<div id="collective-container">
				<div className="collective-name">{collective.name}</div>
				<div className="description">{collective.description}</div>
				<div className="members-count"><Link to={{pathname: paths.collectiveMembers.getHref()+id}}>{collective.members.length} members</Link></div>
				<div className="creation-date"><FormattedDate value={collective.creationDate}/></div>
			</div>
		);
	}
}