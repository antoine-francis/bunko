import {useEffect} from "react";

export const NotFound = () => {

	useEffect(() => {
		document.title = "Not Found";
	}, []);

	return <p>Page not found</p>;
}