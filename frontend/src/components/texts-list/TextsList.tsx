import {TextDescription} from "../../types/Text.ts";
import PropTypes from "prop-types";
import {EmptyList} from "../users-list/EmptyList.tsx";
import {Link} from "react-router-dom";
import {paths} from "../../config/paths.ts";
import {FormattedDate} from "react-intl";
import {toRoman} from "../../utils/roman-numerals.ts";

interface TextsListProps {
	texts?: TextDescription[];
}

export const TextsList = ({texts}: TextsListProps) => {
	return (<div className="text-list">
		{texts !== undefined && texts.length > 0 ?
			texts.map((text : TextDescription, index : number) => (
				<div className="text-item" key={"text-"+index}>
			<Link to={paths.singleText.getHref()+text.hash}>
				<div className="preview-container"><p className="content-preview">{text.content?.substring(0, 900)}</p></div>
				<div className="title">{text.title}</div>
				<div className="publ-date"><FormattedDate value={text.modificationDate ? text.modificationDate : text.creationDate}/></div>
			</Link>
			{text.series && text.seriesEntry &&
				<div className="series">
					<Link to={{pathname: `${paths.series.getHref()}${text.series.id}`}}>
						<div className="series-title">{text.series.title} - {toRoman(text.seriesEntry)}</div>
						<div></div>
					</Link>
				</div>
			}
			</div>
		)) : <EmptyList/>}
	</div>);
}

TextsList.propTypes = {
	texts: PropTypes.array,
}