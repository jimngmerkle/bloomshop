import React, { useState } from 'react';
import { useAuth } from "../../utils/AuthContext"; 
import toast from "react-hot-toast";
import './Catalogform.css';

const Catalogform = () => {
  const { email } = useAuth(); 
  const [products, setProducts] = useState([]);
  const [catalogName, setCatalogName] = useState(''); 
  const [catalogId, setCatalogId] = useState(null); 
  const [recordLimit, setRecordLimit] = useState(10); 
  const apiUrl = 'https://5e0mja4gfl.execute-api.eu-west-2.amazonaws.com/tst';

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

      if (catalogResponse.ok) {
        const catalogResult = await catalogResponse.json();
        if (catalogResult.success) {
          toast.success('Catalog created successfully in Bloomreach!');
          console.log('Catalog created successfully in Bloomreach!', catalogResult);
          
          const parsedData = JSON.parse(catalogResult.data);
          const catalogId = parsedData.id;
          setCatalogId(catalogId);

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

            if (populateResponse.ok) {
              const populateResult = await populateResponse.json();
              if (populateResult.success) {
                toast.success('Catalog populated successfully in Bloomreach!');
                console.log('Catalog populated successfully in Bloomreach!', populateResult);
              } else {
                const error = JSON.parse(populateResult.error);
                toast.error(`Error populating catalog: ${error.errors.name.join(', ')}`);
                console.error('Error populating catalog:', error.errors.name.join(', '));
              }
            } else {
              const errorText = await populateResponse.text();
              toast.error('Error populating catalog in Bloomreach');
              console.error('Error populating catalog:', errorText);
            }
          } else {
            const errorText = await response.text();
            toast.error('Error fetching products from fakestoreapi');
            console.error('Error fetching products:', errorText);
          }
        } else {
          const error = JSON.parse(catalogResult.error);
          toast.error(`Error creating catalog: ${error.errors.name.join(', ')}`);
          console.error('Error creating catalog:', error.errors.name.join(', '));
        }
      } else {
        const errorText = await catalogResponse.text();
        toast.error('Error creating catalog in Bloomreach');
        console.error('Error creating catalog:', errorText);
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
      <p>Add a new catalog with fakestoreapi data (see <a href="https://fakestoreapi.com/docs" target="_new">https://fakestoreapi.com/docs</a>)</p>
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