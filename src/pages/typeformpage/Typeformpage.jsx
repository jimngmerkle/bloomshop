import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Typeform from "../../components/Typeform/Typeform";

const Typeformpage = ({ cartItems }) => {
  return (
    <>
      <Header cartItems={cartItems} />
      <Typeform />
      <Footer />
    </>
  );
};

export default Typeformpage;