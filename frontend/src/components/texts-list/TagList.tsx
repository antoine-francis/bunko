import {Link} from "react-router-dom";
import {paths} from "../../config/paths.ts";
import {Genre} from "../../types/Genre.ts";

interface TagListProps {
	genres: Genre[];
}

export const TagList = ({genres} : TagListProps) => {
	if (genres) {
		return (<div className="genres">
			{genres.map((genre) => {
				return (
					<Link key={genre.tag} to={paths.tag.getHref() + genre.tag}>
						<span className="genre-tag">#{genre.tag}</span>
					</Link>
				)
			})}
		</div>)
	} else {
		return null;
	}
}