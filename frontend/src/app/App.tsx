import '../App.css'
import {BunkoRouter} from "./BunkoRouter.tsx";
import {IntlProvider} from "react-intl";

function App() {



	return (
		<>
			<IntlProvider locale="en">
				<BunkoRouter/>
			</IntlProvider>
		</>
	)
}

export default App
