import {TextDescription} from "../../types/Text.ts";
import PropTypes from "prop-types";
import {EmptyList} from "../users-list/EmptyList.tsx";

interface TextsListProps {
	texts?: TextDescription[];
}

export const TextsList = ({texts}: TextsListProps) => {
	return (<div id="text-list">
		{texts !== undefined && texts.length > 0 ?
			texts.map((text : TextDescription, index : number) => (
			<span key={"text-item-"+index} className="text-item-title">{text.title}</span>
		)) : <EmptyList/>}
	</div>);
}

TextsList.propTypes = {
	texts: PropTypes.array,
}