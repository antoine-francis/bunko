import {loadCollectiveDetails} from "../../features/collectives/api/load-collectives.ts";
import {Link, useLocation, useParams} from "react-router-dom";
import {Loading} from "../../components/Loading.tsx";
import {EmptyList} from "../../components/users-list/EmptyList.tsx";
import {FormattedDate} from "react-intl";
import {paths} from "../../config/paths.ts";
import {Collective} from "../../types/Collective.ts";
import {useQuery} from "@tanstack/react-query";
import {ErrorHandler} from "../../components/ErrorHandler.tsx";

export const CollectiveDetails = () => {
	const location = useLocation();
	const {id} = useParams();

	const { data: collective, isLoading, error } = useQuery<Collective | undefined>({
		queryKey: ["collective", id],
		queryFn: () => loadCollectiveDetails(id!),
		refetchOnWindowFocus: false,
		retry: 0,
	});

	if (isLoading) {
		return <Loading/>;
	} else if (error) {
		return <ErrorHandler statusCode={error.message} redirectTo={location.pathname} />;
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