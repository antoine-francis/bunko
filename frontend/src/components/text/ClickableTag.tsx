import {Link} from "react-router-dom";
import {paths} from "@/config/paths.ts";

interface ClickableTagProps {
	tag: string;
}

export function ClickableTag({ tag } : ClickableTagProps) {
	return <Link to={paths.tag.getHref()+tag}><span className="genre-tag">#{tag}</span></Link>;
}