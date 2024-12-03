import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext"; // Import the AuthContext

const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const { isLoggedIn, logout } = useAuth(); // Access login state and logout function

  return (
    <>
      <header className="container">
        <div className="menu-items">
          <div className="categories">
            <span className="fa-solid fa-border-all"></span>
            <h4 className="head-categories">This is a test shop</h4>
          </div>
          <ul
            className={
              mobileMenu ? "nav-links-MobileMenu" : "link f_flex capitalize"
            }
            onClick={() => setMobileMenu(false)}
          >
            <li>
              <Link aria-label="Home" className="link-hover" to="/">
                Home
              </Link>
            </li>
            <li>
              <Link
                aria-label="All Products"
                className="link-hover"
                to="/all-products"
              >
                All Products
              </Link>
            </li>
            {isLoggedIn && ( // Show "Subscription Preferences" only if logged in
              <li>
                <Link
                  aria-label="Subscription Preferences"
                  className="link-hover"
                  to="/subscriptionpage"
                >
                  Preferences
                </Link>
              </li>
            )}
            <li>
              <Link
                aria-label="SDK Methods"
                className="link-hover"
                to="/methodspage"
              >
                SDK Methods
              </Link>
            </li>            
            {!isLoggedIn ? ( // Show "Login" if not logged in
              <li>
                <Link aria-label="Login" className="link-hover" to="/login">
                  Login
                </Link>
              </li>
            ) : ( // Show "Logout" if logged in
              <li>
                <button
                  aria-label="Logout"
                  className="link-hover logout-btn"
                  onClick={logout} // Call logout function when clicked
                >
                  Logout
                </button>
              </li>
            )}
            <li>
              <Link
                aria-label="Registration"
                className="link-hover"
                to="/registration"
              >
                Registration
              </Link>
            </li>
          </ul>
        </div>
        <button
          aria-label="Menu bar"
          className="toggle"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          {mobileMenu ? (
            <i className="fas fa-times close home-btn"></i>
          ) : (
            <i className="fa fa-bars open"></i>
          )}
        </button>
      </header>
    </>
  );
};

export default Navbar;