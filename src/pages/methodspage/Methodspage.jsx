import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Methodsform from "../../components/Methodsform/Methodsform";

const Methodspage = ({ cartItems }) => {
  return (
    <>
      <Header cartItems={cartItems} />
      <Methodsform />
      <Footer />
    </>
  );
};

export default Methodspage;