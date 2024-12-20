import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import toast from "react-hot-toast";
import { useAuth } from "../../utils/AuthContext"; 

const Registrationform = () => {
  const [email, set_local_email] = useState("");
  const [first_name, set_first_name] = useState("");
  const [last_name, set_last_name] = useState("");
  const [password, set_password] = useState("");
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

      // Make a POST request to the /api/check-email endpoint
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
        toast.error(`Email ${email} already exists in the database`);
        console.log(`Email ${email} already exists in the database`);
      } else if (response.status === 401) {
        toast.error('Unauthorized access. Please check credentials');
        console.log('Unauthorized access. Please check credentials');
      } else if (response.status === 404) {
        toast.success(`Email ${email} has been successfully registered`);
        console.log(`Email ${email} registered in the database`);
        exponea.identify(
          {
            'registered': email
          },
          {
            'first_name': first_name,
            'last_name': last_name
          });
          console.log(`exponea.identify(
            {
              'registered': '${email}'
            },
            {
              'first_name': '${first_name}',
              'last_name': '${last_name}'
            }
          );`);  
        setIsLoggedIn(true); // Update global login state
        setEmail(email);
        setTimeout(() => {
          navigate("/"); // Redirect after a delay
        }, 1000);         
      } else {
        toast.error('An error occurred during registration');
        console.log('An error occurred during registration');
      }
    } catch (error) {
      console.error('Error checking email:', error);
      toast.error('Error checking email');
    }
  };

  const handleRegister= (event) => {
    event.preventDefault();
    console.log('Registering with email:', email); 
    checkEmail(email);
  };

  return (
    <section className="loginform">
      <div className="container-login">
        <div className="wrapper">
          <div className="heading-login">
            <h1>Sign Up</h1>
            <p>
              Already a user?{" "}
              <span>
                <Link to="/login">Login here</Link>
              </span>
            </p>
          </div>
          <form onSubmit={handleRegister} className="form" action="">
            <label className="label">
              Email
              <input
                type="text"
                name="email"
                value={email}
                onChange={(e) => set_local_email(e.target.value)}
              />
            </label>
            <label className="label">
              First name
              <input
                type="text"
                name="first_name"
                value={first_name}
                onChange={(e) => set_first_name(e.target.value)}
              />
            </label>
            <label className="label">
              Last name
              <input
                type="text"
                name="last_name"
                value={last_name}
                onChange={(e) => set_last_name(e.target.value)}
              />
            </label>                        
            <label className="label">
              Password
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => set_password(e.target.value)}
              />
            </label>
            <p className="forgot-pass">
              By signing up you agree to our{" "}
              <span>
                <Link to="/termsNconditions">terms & conditions</Link>
              </span>
            </p>
            <button type="submit" className="submit-btn">Sign Up</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Registrationform;
