import '../App.css';
import '../profile.css';
import {BunkoRouter} from "./BunkoRouter.tsx";
import {IntlProvider} from "react-intl";
import {Provider} from "react-redux";
import {store} from "../store.ts";

function App() {

	return (
		<>
			<IntlProvider locale="en">
					<Provider store={store}>
						<BunkoRouter/>
					</Provider>
			</IntlProvider>
		</>
	)
}

export default App
