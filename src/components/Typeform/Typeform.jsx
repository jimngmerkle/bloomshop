import React, { useState } from 'react';
import { useAuth } from "../../utils/AuthContext"; 
import toast from "react-hot-toast";
import './Typeform.css';

const Typeform = () => {
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
      <p>Test BR Omniconnect integration with a sample Typeform</p>
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

export default Typeform;