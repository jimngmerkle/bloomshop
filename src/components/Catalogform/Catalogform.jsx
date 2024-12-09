import React, { useState } from 'react';
import { useAuth } from "../../utils/AuthContext"; 
import toast from "react-hot-toast";
import './Catalogform.css';

const Catalogform = () => {
  const { email } = useAuth(); 
  const [products, setProducts] = useState([]);
  const [catalogName, setCatalogName] = useState(''); // New state for catalog name
  const [catalogId, setCatalogId] = useState(null); // New state to store catalog ID
  const apiUrl = 'https://5e0mja4gfl.execute-api.eu-west-2.amazonaws.com/tst';

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/products?limit=5');
      const data = await response.json();
      setProducts(data);
      console.log('fake catalog data:', data);
      toast.success('Products fetched successfully!');

      // Create the payload for the create-catalog API call
      const payload = {
        name: catalogName,
        is_product_catalog: true,
        fields: [
          { name: "field_text", type: "string", searchable: true },
          { name: "field_date", type: "date", searchable: true },
          { name: "field_number", type: "number", searchable: true }
        ]
      };

      // Call create catalog endpoint with the payload
      const catalogResponse = await fetch(`${apiUrl}/create-catalog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (catalogResponse.ok) {
        const result = await catalogResponse.json();
        if (result.success) {
          toast.success('Catalog created successfully in Bloomreach!');
          
          // Parse the data field to get the catalog ID
          const parsedData = JSON.parse(result.data);
          const catalogId = parsedData.id;
          
          setCatalogId(catalogId); // Store the catalog ID
          console.log('Catalog creation result:', result);
          console.log("catalogId: ", catalogId);
          
          // Using test data for the populate-catalog call
          const testData = [
            {
              "item_id": "1",
              "properties": {
                "field_date": "01012024",
                "field_number": "123",
                "field_text": "mytext"
              }
            },
            {
              "item_id": "2",
              "properties": {
                "field_date": "02012024",
                "field_number": "234",
                "field_text": "mytext2"
              }
            }
          ];

          const populateResponse = await fetch(`${apiUrl}/populate-catalog/${catalogId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
          });

          if (populateResponse.ok) {
            const populateResult = await populateResponse.json();
            if (populateResult.success) {
              toast.success('Catalog populated successfully in Bloomreach!');
              console.log('Catalog population result:', populateResult);
            } else {
              toast.error('Error populating catalog in Bloomreach');
              console.error('Error populating catalog:', populateResult);
            }
          } else {
            toast.error('Error populating catalog in Bloomreach');
            console.error('Error populating catalog:', populateResponse.statusText);
          }
        } else {
          toast.error('Error creating catalog in Bloomreach');
          console.error('Error creating catalog:', result);
        }
      } else {
        toast.error('Error creating catalog in Bloomreach');
        console.error('Error creating catalog:', catalogResponse.statusText);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error fetching products');
    }
  };

  return (
    <div className="content">
      <p>Current user: <strong>{email}</strong></p>
      <br />
      <span>Enter a catalog name: </span>
      <textarea 
        type="text" 
        placeholder="Catalog name" 
        value={catalogName} 
        className="text-box"
        onChange={(e) => setCatalogName(e.target.value)} 
      />
      <br />
      <button className="btn-primary" onClick={fetchProducts}>Generate catalog in Bloomreach</button>
      <br />
      <div>
        {products.length > 0 && (
          <ul>
            {products.map(product => (
              <li key={product.id}>{product.title} - ${product.price}</li>
            ))}
          </ul>
        )}
      </div>
      <div>
        {catalogId && (
          <p>Catalog created with ID: <strong>{catalogId}</strong></p>
        )}
      </div>
    </div>
  );
};

export default Catalogform;