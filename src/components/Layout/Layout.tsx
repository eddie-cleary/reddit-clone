import React, { ReactElement } from "react";
import Navbar from "../Navbar/Navbar";

type LayoutProps = {
  children: ReactElement;
};

const Layout = (props: LayoutProps) => {
  return (
    <>
      <Navbar />
      <main>{props.children}</main>
    </>
  );
};
export default Layout;
