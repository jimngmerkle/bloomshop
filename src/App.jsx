import React, { useState } from "react";
import AllRoutes from "./allroutes/AllRoutes";
import FlashDealsData from "./components/FlashDeals/flashDealsData";
import ShopData from "./components/Shop/shopData";
import AllProductsData from "./components/Allproducts/allProductsData";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../src/utils/AuthContext";
import "./App.css";

// Custom Modal Component
function ConfirmationModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <p>Are you sure you want to order all these products?</p>
        <button onClick={onConfirm}>Yes</button>
        <button onClick={onCancel}>No</button>
      </div>
    </div>
  );
}

function App() {
  const { productItems } = FlashDealsData;
  const { shopItems } = ShopData;
  const { allProductsData } = AllProductsData;
  const { isLoggedIn } = useAuth(); // Access login state and logout function
  const [cartItems, setCartItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addToCart = (product) => {
    const productExists = cartItems.find((item) => item.id === product.id);
    if (productExists) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id ? { ...productExists, qty: productExists.qty + 1 } : item
        )
      );
      toast.success("Item quantity increased");
    } else {
      setCartItems([...cartItems, { ...product, qty: 1 }]);
      toast.success("Item added to cart");
    }
  };

  const deleteFromCart = (product) => {
    const productExists = cartItems.find((item) => item.id === product.id);
    if (productExists.qty === 1) {
      setCartItems(cartItems.filter((item) => item.id !== product.id));
      toast.success("Item removed from cart");
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id ? { ...productExists, qty: productExists.qty - 1 } : item
        )
      );
      toast.success("Item quantity decreased");
    }
  };

  const checkOut = async () => {
    if (cartItems.length <= 0) {
      toast.error("Add an item in the cart to checkout");
      return;
    }
    setIsModalOpen(true);
  };

  const confirmCheckout = async () => {
    if (!isLoggedIn) {
      console.log('No user logged in.');
      toast.error("Please log in or register to complete purchase");
      setIsModalOpen(false);
      return; // Stop further execution if not logged in
    } else {
      console.log('logged in.');
    }
  
    console.log("Cart contents:");
    const purchase = cartItems.map((item) => ({
      id: item.id,
      name: item.name,
      qty: item.qty,
      price: item.price,
    }));
  
    console.log(purchase);
    await exponea.track('purchase', { purchase });
    setCartItems([]);
    toast.success("Order placed, Thanks!!");
    setIsModalOpen(false);
  };

  const removeFromCart = (product) => {
    setCartItems(cartItems.filter((item) => item.id !== product.id));
    toast.success("Item removed from cart");
  };

  return (
    <>
      <Toaster />
      <AllRoutes
        removeFromCart={removeFromCart}
        productItems={productItems}
        cartItems={cartItems}
        addToCart={addToCart}
        shopItems={shopItems}
        deleteFromCart={deleteFromCart}
        checkOut={checkOut}
        allProductsData={allProductsData}
      />
      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={confirmCheckout}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  );
}

export default App;
