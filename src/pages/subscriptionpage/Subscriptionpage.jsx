import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Subscriptionform from "../../components/Subscriptionform/Subscriptionform";

const Subscriptionpage = ({ cartItems }) => {
  return (
    <>
      <Header cartItems={cartItems} />
      <Subscriptionform />
      <Footer />
    </>
  );
};

export default Subscriptionpage;