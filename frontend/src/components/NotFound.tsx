import {useEffect} from "react";

export const NotFound = () => {

	useEffect(() => {
		document.title = "Not Found";
	}, []);

	return <p id="not-found-page">Page not found</p>;
}