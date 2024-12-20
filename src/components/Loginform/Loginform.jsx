import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../utils/AuthContext"; 
import "./loginform.css";

const Loginform = () => {
  const [email, setLocalEmail] = useState('');
  const [password, setPassword] = useState('');
  const apiUrl = 'https://5e0mja4gfl.execute-api.eu-west-2.amazonaws.com/tst';
  const navigate = useNavigate(); 
  const { setIsLoggedIn, setEmail } = useAuth(); // Access the AuthContext to update login state and email

  const checkEmail = async (email) => {
    try {
      const payload = {
        customer_ids: {
          registered: email
        },
        attributes: [
          {
            type: 'id',
            id: 'registered'
          }
        ]
      };
      console.log('Sending request to /check-email with payload:', payload);

      const response = await fetch(`${apiUrl}/check-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log('Response from /check-email:', data);

      if (data.success) {
        toast.success(`Email ${email} successfully logged in`);
        console.log(`Email ${email} logged in`);
        setIsLoggedIn(true); // Update global login state
        setEmail(email); // Set email in AuthContext
        exponea.identify(email); 
        setTimeout(() => {
          navigate("/"); 
        }, 1000);
      } else if (response.status === 404) {
        toast.error(`Email ${email} does not exist in the database`);
        console.log(`Email ${email} does not exist in the database`);
      } else {
        toast.error('An error occurred while logging in');
        console.log('An error occurred while logging in');
      }
    } catch (error) {
      console.error('Error checking email:', error);
      toast.error('Error checking email');
    }
  };

  const handleLogin = (event) => {
    event.preventDefault();
    console.log('Logging in with email:', email); 
    checkEmail(email);
  };

  return (
    <section className="loginform">
      <div className="container-login">
        <div className="wrapper">
          <div className="heading-login">
            <h1>Sign In</h1>
            <p>
              New User?{" "}
              <span>
                <Link to="/registration">Create an account</Link>
              </span>
            </p>
          </div>
          <form onSubmit={handleLogin} className="form">
            <label className="label">
              Email
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setLocalEmail(e.target.value)}
                required
              />
            </label>
            <label className="label">
              Password
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <p className="forgot-pass">
              Forgot Password?{" "}
              <span>
                <Link to="/forgot-password">Click here to reset</Link>
              </span>
            </p>
            <button className="submit-btn" type="submit">Sign In</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Loginform;