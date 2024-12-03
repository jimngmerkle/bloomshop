import React, { useState } from 'react';
import { useAuth } from "../../utils/AuthContext"; 
import toast from "react-hot-toast";
import './Methodsform.css';

const Methodsform = () => {
  const { email } = useAuth(); 
  const [method, setMethod] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      eval(method.trim());
      console.log(method.trim());
      toast.success('Method submitted!');
    } catch (error) {
      console.error('Error executing method:', error);
      toast.error('Error executing method');
    }
  };

  return (
    <div className="content">
      <div className="two-column-layout">
        <div className="left-column">
          Current user: <strong>{email}</strong>
          <br />
          <p>Example methods: </p>
          <br />
          <pre>
{`exponea.track('purchase', {
purchase_status: 'success',
product_list: [
{ product_id: "abc123", quantity: 2 },
{ product_id: "abc456", quantity: 1 }
],
total_price: 7.99,
payment_type: 'credit_card'
});

exponea.update({
email: 'gordon.freeman@blackmesa.com',
first_name: 'Gordon',
last_name: 'Freeman',
company: 'Blackmesa'
});`
}
        </pre>
        </div>
        <div className="right-column">
          <form onSubmit={handleSubmit} id="form">
            <label htmlFor="method">Enter SDK method:</label>
            <br />
            <textarea
              id="method"
              name="method"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="event-textarea"
              placeholder="Enter SDK method"
              required
            />
            <button className="btn-primary" type="submit">Submit</button>
          </form>
        </div>
      </div>
      <br />
    </div>
  );
};

export default Methodsform;