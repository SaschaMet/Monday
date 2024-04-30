import type { AppProps } from 'next/app'
import { StoreProvider } from "../components/StoreContext";
import '@/styles/styles.scss'

export default function App({ Component, pageProps }: AppProps) {

    return (
        <StoreProvider>
            <Component {...pageProps} />
        </StoreProvider>
    );
}
