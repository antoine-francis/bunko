import {TextsList} from "../../components/texts-list/TextsList.tsx";
import {useEffect} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {Loading} from "../../components/Loading.tsx";
import {ErrorHandler} from "../../components/ErrorHandler.tsx";
import {useBunkoDispatch, useBunkoSelector} from "../../hooks/redux-hooks.ts";
import {paths} from "../../config/paths.ts";
import {fetchTextsByTag} from "../../slices/TagSlice.ts";
import {TagLoadingState} from "../../types/Genre.ts";

export const Tag = () => {
	const {tag: tagParam} = useParams();
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useBunkoDispatch();
	const tag : TagLoadingState = useBunkoSelector(state => tagParam ? state.tags[tagParam] : {
		loading: true, error: undefined, texts: []
	});

	useEffect(() => {
		if (tagParam !== undefined) {
			document.title = `#${tagParam}`;
			dispatch(fetchTextsByTag(tagParam));
		} else {
			navigate(paths.notFound.getHref());
		}
	}, [navigate, tagParam, dispatch]);

	if (!tag) {
		return null;
	} else if (tag.loading) {
		return <Loading />;
	} else if (tag.error) {
		return <ErrorHandler statusCode={tag.error} redirectTo={location.pathname} />;
	} else {
		return (
			<>
				<div className="tag-name">#{tagParam}</div>
				<div id="tag-info">
					<TextsList texts={tag.texts} />
				</div>
			</>
		);
	}
}