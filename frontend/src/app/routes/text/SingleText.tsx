import {BunkoText} from "../../../types/Text.ts";
import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {loadText} from "../../../features/text/load-single-text.ts";
import {BunkoComment} from "../../../types/Comment.ts";
import {Loading} from "../../../components/Loading.tsx";
import {FormattedDate} from "react-intl";
import React from "react";
import {NotFound} from "../../../components/NotFound.tsx";
import {paths} from "../../../config/paths.ts";

export const SingleText = () => {
	const [text, setText] = useState<BunkoText>();
	const [loaded, setLoaded] = useState(false);
	const [error, setError] = useState(false);
	const {id} = useParams();

	useEffect(() => {
		async function getTextById(id: string) {
			setText(await loadText(id));
			setLoaded(true);
		}

		if (id !== undefined && parseInt(id as string, 10)) {
			getTextById(id).catch(e => {
				console.error(e);
			});
		} else {
			setError(true);
		}

	}, [id, loaded])

	if (error) {
		return <Link to={"/404"}/>;
	} else if (!loaded) {
		return <Loading/>;
	} else if (text === undefined) {
		return <NotFound/>;
	} else if (text !== undefined) {
		return (
			<div className="text-container">
				<div className="text-title">{text.title}</div>
				<div className="text-author">{text.author.firstName} {text.author.lastName}</div>
				{text.series !== null &&
					(<Link to={{pathname:`${paths.series.getHref()}${text.series.id}`}}>
					<div className="text-series-info">
						{text.series.picture !== null && (
							<div className="series-pic"><img src={text.series.picture} alt={text.series.title}/></div>)}
						<span className="series-name">{text.series.title} - part {text.seriesEntry}</span>
					</div>
				</Link>)
				}
				<span className="genres">{text.genres.map(genre => {
					return genre.tag;
				})}</span>
				<div className="text-content">{text.content}</div>
				<div className="likes">Liked by {text.likes}</div>
				<div className="bookmark-count">Bookmarked by {text.bookmarkedBy}</div>
				<div className="comments-container">
					{text.comments.map((comment : BunkoComment) => {
						return (<React.Fragment key={comment.id}>
								<div className="comment-author">{comment.author.username}</div>
								<div className="comment-date"><FormattedDate value={comment.creationDate}/></div>
								<div className="comment">{comment.content}</div>
							</React.Fragment>
						);
					})}
				</div>
			</div>);
	}
}