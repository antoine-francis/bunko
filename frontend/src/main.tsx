import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App.tsx'
import {HelmetProvider} from "react-helmet-async";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<HelmetProvider>
				<App />
			</HelmetProvider>
		</QueryClientProvider>
	</StrictMode>,
)
