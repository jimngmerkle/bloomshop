import React, { useState, useEffect } from 'react';
import { useAuth } from "../../utils/AuthContext"; 
import toast from "react-hot-toast";
import './Subscriptionform.css';

const Subscriptionform = () => {
  const { email } = useAuth(); // Access email from AuthContext
  const [categories, setCategories] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const apiUrl = import.meta.env.VITE_APP_API_URL || 'http://localhost:5173';

  useEffect(() => {
    const fetchConsents = async () => {
      try {
        const response = await fetch(`${apiUrl}/check-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            customer_ids: {
              registered: email
            },
            attributes: [
              {
                type: "consent",
                category: "email",
                mode: "valid"
              },
              {
                type: "consent",
                category: "sms",
                mode: "valid"
              },
              {
                type: "consent",
                category: "newsletter",
                mode: "valid"
              }
            ]
          })
        });

        const data = await response.json();

        if (data.success) {
          const parsedData = JSON.parse(data.data); // Parse the JSON string
          const updatedCategories = parsedData.results.map((result, index) => ({
            id: index,
            name: ["email", "sms", "newsletter"][index], // Set category names explicitly
            valid: result.value
          }));
          setCategories(updatedCategories);
        } else {
          toast.error('Error fetching consents');
          console.log('Error fetching consents');
        }
      } catch (error) {
        console.error('Error fetching consents:', error);
        toast.error('Error fetching consents');
      }
    };

    fetchConsents();
  }, [apiUrl, email]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        commands: categories.map(category => ({
          name: "customers/events",
          data: {
            customer_ids: {
              registered: email
            },
            event_type: "consent",
            properties: {
              action: category.valid ? "accept" : "reject",
              category: category.name,
              valid_until: "unlimited"
            }
          }
        }))
      };

      const response = await fetch(`${apiUrl}/update-consent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        setIsSubmitted(true);
        toast.success('Settings saved!');
        console.log('Consent data: ', payload);
      } else {
        toast.error('Error updating consents');
        console.log('Error updating consents');
      }
    } catch (error) {
      console.error('Error updating consents:', error);
      toast.error('Error updating consents');
    }
  };

  const handleCheckboxChange = (id) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === id ? { ...category, valid: !category.valid } : category
      )
    );
  };

  const unsubscribeAll = () => {
    setCategories((prevCategories) =>
      prevCategories.map((category) => ({ ...category, valid: false }))
    );
  };

  return (
    <div className="content">
      <h1>Subscription preferences</h1>
      {isSubmitted && <div className="success">Settings saved!</div>}
      <div className="email-block">
        <div className="email-block-title">
        <br></br>
          Email Subscriptions for <strong>{email}</strong>
          <br></br>
          </div>
        <div className="email-block-subtitle">
        <br></br>
          Here you can change your email sending preferences.
        <br></br>
          </div>
      </div>
      <form onSubmit={handleSubmit} id="form">
        <div className="checkboxes">
        <br></br>
          {categories.map((category) => (
            <div key={category.id}>
              <label>
                <input
                  type="checkbox"
                  checked={category.valid}
                  onChange={() => handleCheckboxChange(category.id)}
                />
                <span className="checkbox-title">{category.name}</span>
              </label>
            </div>
          ))}
        </div>
        <br></br>
        <button class="btn-primary" type="submit">Change subscriptions</button>
        <br></br>
      </form>
      <br></br>
    </div>
  );
};

export default Subscriptionform;