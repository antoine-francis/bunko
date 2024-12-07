import {TextsList} from "../../components/texts-list/TextsList.tsx";
import {loadSeries} from "../../features/dashboard/api/load-texts.ts";
import React, {useEffect} from "react";
import {useLocation, useParams} from "react-router-dom";
import {Loading} from "../../components/Loading.tsx";
import {NotFound} from "../../components/NotFound.tsx";
import {ErrorHandler} from "../../components/ErrorHandler.tsx";
import {useQuery} from "@tanstack/react-query";

export const SeriesDescription = () => {
	const {id} = useParams();
	const location = useLocation();

const {data: series, isLoading, error} = useQuery({
	queryKey: ["seriesId", id],
	queryFn: () => loadSeries(id!),
	refetchOnWindowFocus: false,
	retry: 0
})

	useEffect(() => {
		if (series !== undefined) {
			document.title = series.title;
		}
	}, [series]);

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

	if (isLoading) {
		return <Loading />;
	} else if (error) {
		return <ErrorHandler statusCode={error.message} redirectTo={location.pathname} />;
	} else if (series === undefined) {
		return <NotFound />;
	} else {
		return (
			<>
				<div className="series-info">
					<div className="series-title">{series.title}</div>
					<div className="author">{getSeriesAuthorsNames()}</div>
				</div>
				<TextsList texts={series.entries}/>
			</>
		);
	}

}