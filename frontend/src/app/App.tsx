import '../App.css'
import {BunkoRouter} from "./BunkoRouter.tsx";
import {IntlProvider} from "react-intl";
import {UserProvider} from "../contexts/UserContext.tsx";

function App() {



	return (
		<>
			<IntlProvider locale="en">
				<UserProvider>
					<BunkoRouter/>
				</UserProvider>
			</IntlProvider>
		</>
	)
}

export default App
