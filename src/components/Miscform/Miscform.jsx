import React, { useState } from 'react';
import { useAuth } from "../../utils/AuthContext"; 
import toast from "react-hot-toast";
import './Miscform.css';

const Miscform = () => {
  const { email } = useAuth(); 
  const [typeformUrl, setTypeformUrl] = useState('https://e0u55g5197k.typeform.com/to/MzfVzC9W'); 

  const openTypeform = () => {
    if (typeformUrl) {
      window.open(typeformUrl, '_blank');
    } else {
      toast.error("Please enter a valid Typeform URL.");
    }
  };  

  return (
    <div className="content">
      <p>Current user: <strong>{email}</strong></p>
      <br />
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
      <br />

      <button className="btn-primary" onClick={openTypeform}>Open Typeform</button>
      <br />
    </div>
  );
};

export default Miscform;