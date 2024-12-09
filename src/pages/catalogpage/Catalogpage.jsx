import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Catalogform from "../../components/Catalog/Catalogform";

const Catalogpage = ({ cartItems }) => {
  return (
    <>
      <Header cartItems={cartItems} />
      <Catalogform />
      <Footer />
    </>
  );
};

export default Catalogpage;