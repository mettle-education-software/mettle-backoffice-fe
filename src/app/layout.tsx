'use client';

import { Spin, ConfigProvider } from 'antd';
import { Roboto } from 'next/font/google';
import { AppProvider, useAppContext } from 'providers';
import React from 'react';
import darkToken from 'themes/dark.json';
import lightToken from 'themes/light.json';
import '../styles/globals.css';

const roboto = Roboto({
    subsets: ['latin'],
    display: 'swap',
    weight: ['100', '300', '400', '500', '700', '900'],
});

const App = ({ children }: { children: React.ReactNode }) => {
    const { theme, isAppLoading } = useAppContext();

    return (
        <ConfigProvider theme={theme === 'light' ? lightToken : darkToken}>
            <body>
                <main className={roboto.className} data-theme={theme}>
                    <Spin spinning={isAppLoading}>{children}</Spin>
                </main>
            </body>
        </ConfigProvider>
    );
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt">
            <head>
                <title>Mettle Business Manager - Bem-vindo!</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <link rel="icon" href="/favicon.ico" />
                <meta name="description" content="Mettle Business Manager" />
                <meta property="og:title" content="Mettle" />
                <meta property="og:image" content="/mettle.png" />
                <link rel="apple-touch-icon" href="/mettle.png" />
            </head>
            <AppProvider>
                <App>{children}</App>
            </AppProvider>
        </html>
    );
}
