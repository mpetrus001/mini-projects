import React, { ReactNode } from "react";
// import Link from "next/link";
import Head from "next/head";

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = "Gist-Next" }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header>
      <h1>Gist-Next.js</h1>
      {/* <nav>
        <Link href="/">
          <a>Home</a>
        </Link>
      </nav> */}
    </header>
    {children}
    <footer>
      <span>@mpetrus001</span>
    </footer>
  </div>
);

export default Layout;
