// pages/layout.tsx

import React, { ReactNode } from 'react';
import Head from 'next/head';
import styles from './page.module.css'; // Assurez-vous d'importer le style global ici

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="/app/globals.css" />
      </Head>
      <div className={styles.container}>
        {children}
      </div>
    </>
  );
};

export default Layout;
