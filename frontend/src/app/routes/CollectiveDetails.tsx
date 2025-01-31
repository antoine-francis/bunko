import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {FormattedDate} from "react-intl";
import {paths} from "../../config/paths.ts";
import {ErrorHandler} from "../../components/ErrorHandler.tsx";
import {useBunkoDispatch, useBunkoSelector} from "../../hooks/redux-hooks.ts";
import {useEffect} from "react";
import {fetchCollective} from "../../slices/CollectivesSlice.ts";
import {LoadingContainer} from "../../components/LoadingContainer.tsx";

export const CollectiveDetails = () => {
	const {id} = useParams();
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useBunkoDispatch();
	const collective = useBunkoSelector(state => id ? state.collectives[id] : undefined);

	useEffect(() => {
		if (collective !== undefined) {
			document.title = collective.name;
		}
	}, [collective]);

	if (id === undefined) {
		navigate(paths.notFound.getHref());
	} else {
		if (!collective) {
			dispatch(fetchCollective(id));
		}
	}

	if (!collective) {
		return null;
	} else if (collective.loading) {
		return <LoadingContainer />;
	} else if (collective.error) {
		return <ErrorHandler statusCode={collective.error} redirectTo={location.pathname} />;
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