import React, { useState } from 'react';
import { useAuth } from "../../utils/AuthContext"; 
import toast from "react-hot-toast";
import './Miscform.css';

const Miscform = () => {
  const { email } = useAuth(); 
  const [customerRecordLimit, setCustomerRecordLimit] = useState(10);   
  const [catalogRecordLimit, setCatalogRecordLimit] = useState(10);     
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);  
  const [method, setMethod] = useState('');
  const [catalogName, setCatalogName] = useState(''); 
  const [catalogId, setCatalogId] = useState(null);   
  const [typeformUrl, setTypeformUrl] = useState('https://e0u55g5197k.typeform.com/to/MzfVzC9W'); 
  const apiUrl = 'https://5e0mja4gfl.execute-api.eu-west-2.amazonaws.com/tst';

  const openTypeform = () => {
    if (typeformUrl) {
      window.open(typeformUrl, '_blank');
    } else {
      toast.error("Please enter a valid Typeform URL.");
    }
  };  

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      if (method.trim()) {
        eval(method.trim());
        console.log(method.trim());
        toast.success('SDK method submitted!');
      } else {
        toast.error('Please enter a valid SDK method.');
      }
    } catch (error) {
      console.error('Error executing method:', error);
      toast.error('Error executing method');
    }
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

      if (catalogResponse.ok) {
        const catalogResult = await catalogResponse.json();
        if (catalogResult.success) {
          toast.success('Catalog created successfully in Bloomreach!');
          console.log('Catalog created successfully in Bloomreach!', catalogResult);
          
          const parsedData = JSON.parse(catalogResult.data);
          const catalogId = parsedData.id;
          setCatalogId(catalogId);

          // Fetch products from fakestoreapi
          const response = await fetch(`https://fakestoreapi.com/products?limit=${catalogRecordLimit}`);
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

  const transformCustomers = (customers) => {
    const customerArray = Array.isArray(customers) ? customers : [customers];
    return {
      commands: customerArray.map(customer => ({
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
    };
  };

  const addCustomers = async () => {
    try {
      // Step 1: Call Mockaroo api to get test customers
      const response = await fetch(`https://my.api.mockaroo.com/bloomreach_sandbox_customers.json?key=e4da9b70&count=${customerRecordLimit}`);
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
        console.log('fake customer data:', data);
        toast.success('Customers fetched successfully!');

        // Step 2: Transform the fetched customer data to match the required format
        const transformedData = transformCustomers(data);
        console.log('transformed customer data:', transformedData);

        // Step 3: Send the transformed data to batch endpoint
        const bloomreachResponse = await fetch(`${apiUrl}/batch`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(transformedData)
        });

        const bloomreachResponseData = await bloomreachResponse.text();
        console.log('Response from Bloomreach API:', bloomreachResponseData);        

        if (bloomreachResponse.ok) {
          toast.success('Customers added to Bloomreach successfully!');
        } else {
          const errorText = await bloomreachResponse.text();
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

  }
    

  return (
    <div className="content">
      <p>Current user: <strong>{email}</strong></p>
      <hr className="separator" />
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
      <hr className="separator" />
      <span><b>Add test customer data to Bloomreach from a test Mockaroo schema</b> (first_name,last_name,registered,email,gender,phone,language)</span>
      <br />
      <span>Enter number of records (note Bloomreach batch endpoint 50 command limit): </span>
      <input 
        type="number" 
        placeholder="Number of records" 
        value={customerRecordLimit} 
        className="text-box"
        onChange={(e) => setCustomerRecordLimit(e.target.value)} 
      />
      <button className="btn-primary" onClick={addCustomers}>Add customers to Bloomreach</button>
      <hr className="separator" />
      <p><b>Add a new catalog in Bloomreach </b><br />
      with fakestoreapi data (title,description,price,category,image) (see <a href="https://fakestoreapi.com/docs" target="_new">documentation</a>)</p>
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
        value={catalogRecordLimit} 
        className="text-box"
        onChange={(e) => setCatalogRecordLimit(e.target.value)} 
      />
      <br />
      <button className="btn-primary" onClick={fetchProducts}>Generate catalog in Bloomreach</button>
      <br />      
      <hr className="separator" />
      <div className="two-column-layout">
       <div className="left-column">
    <p><b>Send SDK method</b><br /> 
      (see <a href='https://documentation.bloomreach.com/engagement/docs/tracking' target="_new">documentation</a>)
    </p>
    <br />
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
    </form>
    <br /><button className="btn-primary" type="submit">Submit</button>
  </div>
  <div className="right-column">
    <p>Some examples</p>
    <br />
    <pre>
    exponea.identify('john.smith@example.com');
    </pre>
    <br />
    <pre>
    exponea.update(&#123;
    email: 'gordon.freeman@blackmesa.com',
    first_name: 'Gordon',
    last_name: 'Freeman',
    company: 'Blackmesa'&#125;);
    </pre>
    <br />
    <pre>
    exponea.track('purchase', &#123;<br />
    purchase_status: 'success',<br />
    product_list: [<br />
    product_id: "abc123", quantity: 2&#125;,<br />
    product_id: "abc456", quantity: 1&#125;<br />
    ],<br />
    total_price: 7.99,<br />
    payment_type: 'credit_card'<br />
    &#125;);
    </pre>
    <br />
    <pre>
    exponea.anonymize();
    </pre>
    <br />
    <pre>
    exponea.showWebLayer('67865c6fd9fb6b37a889aa37');
    </pre>
  </div>
</div>   
<hr className="separator" />
      <span><b>Test web browser push subscription weblayer</b></span>
      <br />
      <button className="btn-primary" onClick={() => window.location.href = 'https://main.da7anuwx8hniw.amplifyapp.com/miscformpage/#test-notification'}>
  Test subscription weblayer
</button>
      <br />
    </div>
    
  );
};

export default Miscform;