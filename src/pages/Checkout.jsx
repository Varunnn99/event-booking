import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "@/redux/cartSlice";
import { useEffect } from "react";
import EventCard from "../components/EventCard/EventCard";
import "./Checkout.css";



const Checkout = () => {
  const { items: cartItems, totalAmount } = useSelector(state => state.cart);
  const user = useSelector(state => state.auth.user); // ✅ Fetch user from Redux
  const userId = user?.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🔍 Redux State in Checkout.jsx:", { user, userId });
  }, [user, userId]);


  if (!user) {
    console.error("❌ User is undefined in Redux state.");
  }

  const handlePayment = async () => {
    if (!userId) {
      alert("You must be logged in to complete the payment.");
      return;
    }
    console.log("🧑 User ID:", userId);
    console.log("🛒 Cart Items:", cartItems);

    const orderData = {
      user_id: userId,
      total_price: totalAmount,
      events: cartItems.map(event => ({ event_id: event.id })),
    };
    console.log("📦 Order Data Sent to Backend:", JSON.stringify(orderData, null, 2));

    try {
      const response = await fetch("http://localhost:5000/api/orders/place-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ Send token
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Payment successful! Tickets generated.");
        dispatch(clearCart());
        navigate("/my-events");
      } else {
        alert(data.error || "Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  return (
    <div className="checkout-container">
      <br/><br/><br/><br/><br/>
      <h2>Checkout</h2>
      <p className="total-amount">Total Amount: ₹{totalAmount.toFixed(2)}</p>

      <div className="cart-items-container">
        {cartItems.map(event => (
          <div key={event.id} className="event-card">
            <img src={event.img} alt="Event" />
            <div className="event-details">
              <h4>{event.heading}</h4>
              <p>{event.date} | {event.location}</p>
              <p><strong>Price:</strong> ₹{event.price}</p>
            </div>
          </div>
        ))}
      </div>

      <button onClick={handlePayment} className="pay-btn">
        Pay Now
      </button>
    </div>
  );
};

export default Checkout;
