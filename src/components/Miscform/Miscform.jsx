import React, { useState } from 'react';
import { useAuth } from "../../utils/AuthContext"; 
import toast from "react-hot-toast";
import './Miscform.css';

const Miscform = () => {
  const { email } = useAuth(); 
  const [recordLimit, setRecordLimit] = useState(10); 
  const [customers, setCustomers] = useState([]);
  const [typeformUrl, setTypeformUrl] = useState('https://e0u55g5197k.typeform.com/to/MzfVzC9W'); 
  const apiUrl = 'https://5e0mja4gfl.execute-api.eu-west-2.amazonaws.com/tst';

  const openTypeform = () => {
    if (typeformUrl) {
      window.open(typeformUrl, '_blank');
    } else {
      toast.error("Please enter a valid Typeform URL.");
    }
  };  

  const transformCustomers = (customers) => ({
    commands: customers.map(customer => ({
      name: "customers",
      data: {
        customer_ids: {
          registered: customer.registered
        },
        properties: {
          first_name: customer.first_name,
          last_name: customer.last_name,
          email: customer.email,
          gender: customer.gender,
          phone: customer.phone,
          language: customer.language
        }
      }
    }))
  });

  const addCustomers = async () => {
    try {
      // Step 1: Call Mockaroo api to get test customers
      const response = await fetch(`https://my.api.mockaroo.com/bloomreach_sandbox_customers.json?key=e4da9b70&count=${recordLimit}`);
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
        console.log('fake customer data:', data);
        toast.success('Customers fetched successfully!');

        // Step 2: Transform the fetched customer data to match the required format
        const transformedData = transformCustomers(data);
        console.log('transformed customer data:', transformedData);

        // Step 3: Send the transformed data to the specified endpoint
        const exponeaResponse = await fetch('${apiUrl}/add-customers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(transformedData)
        });

        if (exponeaResponse.ok) {
          toast.success('Customers added to Bloomreach successfully!');
        } else {
          const errorText = await exponeaResponse.text();
          toast.error('Error adding customers to Bloomreach');
          console.error('Error adding customers to Bloomreach:', errorText);
        }
      } else {
        const errorText = await response.text();
        toast.error('Error fetching Mockaroo data');
        console.error('Error fetching Mockaroo data:', errorText);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error.');
    }
  };

  return (
    <div className="content">
      <p>Current user: <strong>{email}</strong></p>
      <br />
      <b>Omniconnect</b>
      <p>Test Bloomreach Omniconnect functionality using a Typeform integration and <b><a href="https://api-demoapp.exponea.com/intg/webhook-handler/v1.0/650ce29b-b5f2-4f57-9e74-5abeaeaec120/callback" target="_new">test Omniconnect URL</a> </b></p>
      (note Typeform's 10 responses per month limit for free accounts)
      <br />     
      <br />
      <span>Enter a Typeform URL: </span>
      <textarea 
        type="text" 
        placeholder="https://e0u55g5197k.typeform.com/to/MzfVzC9W" 
        value={typeformUrl} 
        className="text-box"
        onChange={(e) => setTypeformUrl(e.target.value)} 
      />
      <button className="btn-primary" onClick={openTypeform}>Open Typeform</button>
      <br />
      <b>Add test customer data to Bloomreach from Mockaroo</b>
      <span>Enter number of records: </span>
      <input 
        type="number" 
        placeholder="Number of records" 
        value={recordLimit} 
        className="text-box"
        onChange={(e) => setRecordLimit(e.target.value)} 
      />
      <button className="btn-primary" onClick={addCustomers}>Add customers to Bloomreach</button>
      <br /> 
    </div>
  );
};

export default Miscform;