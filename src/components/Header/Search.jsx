import React from "react";
import { Link } from "react-router-dom";

const Search = ({ cartItems }) => {
  window.addEventListener("scroll", function () {
    const search = document.querySelector(".search");
    search.classList.toggle("active", window.scrollY > 100);
  });

  return (
    <>
      <section className="search">
        <div className="container c_flex">
          <div className="logo width">
            <Link aria-label="Home" to="/">
              <img src="/assets/main-logo/shop.jpg" alt="" />
            </Link>
          </div>

          <div className="icon f_flex width">
            <div className="cart">
              <Link to="/cart">
                <i className="fa fa-shopping-bag icon-circle"></i>
                <span>{cartItems.length === 0 ? 0 : cartItems.length}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Search;
