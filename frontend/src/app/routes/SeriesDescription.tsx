import {TextsList} from "../../components/texts-list/TextsList.tsx";
import React, {useEffect} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {ErrorHandler} from "../../components/ErrorHandler.tsx";
import {useBunkoDispatch, useBunkoSelector} from "../../hooks/redux-hooks.ts";
import {paths} from "../../config/paths.ts";
import {fetchSeries} from "../../slices/SeriesSlice.ts";
import {BunkoText, TextDescription} from "../../types/Text.ts";
import {convertTextToDesc} from "../../features/text/text-functions.ts";
import {LoadingContainer} from "../../components/LoadingContainer.tsx";

export const SeriesDescription = () => {
	const {id} = useParams();
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useBunkoDispatch();
	const series = useBunkoSelector(state => id ? state.series[id] : undefined);

	useEffect(() => {
		if (series !== undefined) {
			document.title = series.title;
		}
		if (id === undefined) {
			navigate(paths.notFound.getHref());
		} else {
			if (!series) {
				dispatch(fetchSeries(id));
			}
		}
	}, [series, dispatch, id, navigate]);

	const getSeriesAuthorsNames = () : React.JSX.Element => {
		const authorsList: string[] = [];
		if (series !== undefined && series.entries !== undefined && series.entries.length > 0) {
			for (let entry of series.entries) {
				if (!authorsList.includes(entry.author.firstName + " " + entry.author.lastName)) {
					authorsList.push(entry.author.firstName + " " + entry.author.lastName);
				}
			}
		}
		return (<>
			{authorsList.map((author : string) => {
				return (<span key={"author-"+author} className="author">{author}</span>)
			})
			}
		</>)
	}

	if (!series) {
		return null;
	} else if (series.loading) {
		return <LoadingContainer />;
	} else if (series.error) {
		return <ErrorHandler statusCode={series.error} redirectTo={location.pathname} />;
	} else if (series.entries !== undefined) {
		const seriesTextDesc : TextDescription[] = series.entries.map((text : BunkoText) => {
			return convertTextToDesc(text);
		})
		return (
			<>
				<div id="series-info-container">
					<div className="series-title">{series.title}</div>
					<div className="author">{getSeriesAuthorsNames()}</div>
					<div className="synopsis">{series.synopsis}</div>
					<TextsList texts={seriesTextDesc} showSeries={false}/>
				</div>
			</>
		);
	}

}