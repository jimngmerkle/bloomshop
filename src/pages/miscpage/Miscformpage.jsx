import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Miscform from "../../components/Miscform/Miscform";

const Miscformpage = ({ cartItems }) => {
  return (
    <>
      <Header cartItems={cartItems} />
      <Miscform />
      <Footer />
    </>
  );
};

export default Miscformpage;