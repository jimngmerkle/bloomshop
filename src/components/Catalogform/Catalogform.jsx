import React, { useState } from 'react';
import { useAuth } from "../../utils/AuthContext"; 
import toast from "react-hot-toast";
import './Catalogform.css';

const Catalogform = () => {
  const { email } = useAuth(); 
  const [products, setProducts] = useState([]);
  const [catalogName, setCatalogName] = useState(''); 
  const [catalogId, setCatalogId] = useState(null); 
  const [recordLimit, setRecordLimit] = useState(); 
  const apiUrl = 'https://5e0mja4gfl.execute-api.eu-west-2.amazonaws.com/tst';

  const handleResponse = async (response, successMessage, errorMessage) => {
    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        toast.success(successMessage);
        console.log(successMessage, result);
        return result;
      } else {
        const error = JSON.parse(result.error);
        toast.error(`${errorMessage}: ${error.errors.name.join(', ')}`);
        console.error(`${errorMessage}: ${result.error}`);
      }
    } else {
      toast.error(errorMessage);
      console.error(errorMessage, response.statusText);
    }
    return null;
  };

  const fetchProducts = async () => {
    try {
      // Create the payload for the create-catalog API call
      const payload = {
        name: catalogName,
        is_product_catalog: true,
        fields: [
          { name: "title", type: "string", searchable: true },
          { name: "description", type: "string", searchable: true },
          { name: "price", type: "number", searchable: true },
          { name: "category", type: "string", searchable: true },
          { name: "image", type: "string", searchable: true }
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

      const catalogResult = await handleResponse(catalogResponse, 'Catalog created successfully in Bloomreach!', 'Error creating catalog');
      if (catalogResult) {
        const parsedData = JSON.parse(catalogResult.data);
        const catalogId = parsedData.id;
        setCatalogId(catalogId);
        console.log("catalogId: ", catalogId);

        // Fetch products from fakestoreapi
        const response = await fetch(`https://fakestoreapi.com/products?limit=${recordLimit}`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
          console.log('fake catalog data:', data);
          toast.success('Products fetched successfully!');

          // Transform the fetched products data to match the required format
          const transformedData = data.map(product => ({
            item_id: product.id.toString(),
            properties: {
              title: product.title,
              description: product.description,
              price: product.price,
              category: product.category,
              image: product.image
            }
          }));

          const populateResponse = await fetch(`${apiUrl}/populate-catalog/${catalogId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(transformedData)
          });

          await handleResponse(populateResponse, 'Catalog populated successfully in Bloomreach!', 'Error populating catalog');
        } else {
          toast.error('Error fetching products from fakestoreapi');
          console.error('Error fetching products:', response.statusText);
        }
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
      <span>Enter number of records: </span>
      <input 
        type="number" 
        placeholder="Number of records" 
        value={recordLimit} 
        className="text-box"
        onChange={(e) => setRecordLimit(e.target.value)} 
      />
      <br />
      <button className="btn-primary" onClick={fetchProducts}>Generate catalog in Bloomreach</button>
      <br />
    </div>
  );
};

export default Catalogform;