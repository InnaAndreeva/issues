import type { AppProps } from 'next/app';
import '../../scripts/wdyr';
import { PageLoadProgress } from '@taskany/bricks';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { usePageLoad } from '../hooks/usePageLoad';
import { trpc } from '../utils/trpcClient';

const App = ({ Component, pageProps, router }: AppProps) => {
    const pageLoadRef = usePageLoad(router);

    return (
        <>
            <Head>
                <link rel="icon" href="/favicon.png" />
            </Head>

            <SessionProvider session={pageProps.session} refetchOnWindowFocus={true}>
                <ThemeProvider themes={['light', 'dark']}>
                    <PageLoadProgress height={2} ref={pageLoadRef} />
                    <Component {...pageProps} />
                    <ReactQueryDevtools />
                </ThemeProvider>
            </SessionProvider>
        </>
    );
};

export default trpc.withTRPC(App);
