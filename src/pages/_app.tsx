import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import reset from 'styled-reset';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { init } from '@socialgouv/matomo-next';

import theme from 'theme';
import LoginProvider from 'context/LoginContext';
import Toast from 'components/Toast';

const env = process.env.NEXT_PUBLIC_API_BASE || 'dev';

export const APOLLO_LINK = {
  local: 'http://localhost:4000/',
  dev: 'https://dev-api.phylogenyexplorerproject.co.uk/',
  prod: 'https://api.phylogenyexplorerproject.co.uk/',
}[env];

const client = new ApolloClient({
  uri: APOLLO_LINK,
  cache: new InMemoryCache(),
});

const GlobalStyle = createGlobalStyle`
  ${reset}
  html {
    @media screen and (max-width: 320px) {
      font-size: 14px;
    }
  }
  body {
    margin: 0;
    font-family: 'Roboto', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  a {
    color: ${theme.primary};
    text-decoration-color: transparent;
    transition: text-decoration 500ms;
    &:hover {
      text-decoration-color: ${theme.primary};
    }
  }
`;

const MATOMO_URL = 'https://analytics.phylogenyexplorerproject.org';
const MATOMO_SITE_ID = '2';

const App = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    init({ url: MATOMO_URL, siteId: MATOMO_SITE_ID });
  }, []);

  return (
    <LoginProvider>
      <ApolloProvider client={client}>
        <GlobalStyle />
        <ThemeProvider theme={theme}>
          <Toast />
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
          </Head>
          <Component {...pageProps} />
        </ThemeProvider>
      </ApolloProvider>
    </LoginProvider>
  );
};

export default App;
