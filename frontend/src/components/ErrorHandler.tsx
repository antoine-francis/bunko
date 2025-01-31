import {HttpStatus} from "../constants/Http.ts";
import {Navigate} from "react-router-dom";
import {paths} from "../config/paths.ts";
import {NotFound} from "./NotFound.tsx";

interface ErrorHandlerProps {
	statusCode: string,
	redirectTo?: string,
}

export const ErrorHandler = ({statusCode, redirectTo} : ErrorHandlerProps) => {
	if (statusCode === HttpStatus.UNAUTHORIZED) {
		return (<Navigate to={paths.auth.login.getHref(redirectTo)}></Navigate>);
	} else if (statusCode === HttpStatus.NOT_FOUND) {
		return (<NotFound/>);
	} else {
		return (<div id="error">Something happened, try again later...</div>);
	}
}