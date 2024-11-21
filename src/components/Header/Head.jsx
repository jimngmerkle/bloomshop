import React from "react";
import { Link } from "react-router-dom"; 
import "./Header.css";

export const Head = () => {
  return (
    <>
      <section className="head">
        <div className="container d_flex">
        <div className="left-row">
  <label>
          <Link aria-label="Home" className="left-row white-text" to="/">Merkle-Bloomreach test shop</Link>
  </label>  
</div>

        </div>
      </section>
    </>
  );
};

export default Head;
