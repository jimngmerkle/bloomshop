import React, { useState, useEffect } from 'react';
import { useAuth } from "../../utils/AuthContext"; 
import toast from "react-hot-toast";
import './Subscriptionform.css';

const Subscriptionform = () => {
  const { email } = useAuth(); // Access email from AuthContext
  const [categories, setCategories] = useState([]);
  const [initialCategories, setInitialCategories] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const apiUrl = 'https://5e0mja4gfl.execute-api.eu-west-2.amazonaws.com/tst';

  useEffect(() => {
    const fetchConsents = async () => {
      try {
        // Step 1: Fetch consent categories
        console.log('Fetching consent categories from /get-consent');
        const response = await fetch(`${apiUrl}/get-consent`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const consentsData = await response.json();
        console.log('Response from /get-consent:', consentsData);

        if (consentsData.success) {
          const parsedConsentsData = JSON.parse(consentsData.data);
          const categoryIds = parsedConsentsData.results.map(result => result.id);

          // Step 2: Fetch current status for each consent category
          const currentConsentsForEmail = {
            customer_ids: {
              registered: email
            },
            attributes: categoryIds.map(id => ({
              type: "consent",
              category: id,
              mode: "valid"
            }))
          };
          console.log('Fetching current consent status from /check-email with payload:', currentConsentsForEmail);
          const response = await fetch(`${apiUrl}/check-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(currentConsentsForEmail)
          });

          const checkEmailData = await response.json();
          console.log('Response from /check-email:', checkEmailData);

          if (checkEmailData.success) {
            const parsedCheckEmailData = JSON.parse(checkEmailData.data);
            const updatedCategories = parsedCheckEmailData.results.map((result, index) => ({
              id: index,
              name: categoryIds[index],
              valid: result.value
            }));
            setCategories(updatedCategories);
            setInitialCategories(updatedCategories); // Store initial categories
          } else {
            toast.error('Error fetching current consent status');
            console.log('Error fetching current consent status');
          }
        } else {
          toast.error('Error fetching consent categories');
          console.log('Error fetching consent categories');
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
    // Step 3: update consent statuses for each consent category
    try {
      const changedCategories = categories.filter((category, index) => 
        category.valid !== initialCategories[index].valid
      );

      const payload = {
        commands: changedCategories.map(category => ({
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

      console.log('Submitting consent updates to /update-consent with payload:', payload);

      const response = await fetch(`${apiUrl}/update-consent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Response from /update-consent:', data);

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
                <span className="checkbox-title"> {category.name}</span>
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