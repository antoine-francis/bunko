import {TextsList} from "../../components/texts-list/TextsList.tsx";
import {loadSeries} from "../../features/dashboard/api/load-texts.ts";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Loading} from "../../components/Loading.tsx";
import {NotFound} from "../../components/NotFound.tsx";
import type {Series} from "../../types/Series";

export const SeriesDescription = () => {
	const {id} = useParams();
	const [series, setSeries] = useState<Series>();
	const [loaded, isLoaded] = useState(false);

	useEffect(() =>{
		const getSeries = async () => {
			if (id !== undefined) {
				setSeries(await loadSeries(id));
				isLoaded(true);
			}
		}

		if (!loaded) {
			getSeries().catch(e => {
				console.error(e);
			});
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

	if (!loaded) {
		return <Loading />;
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