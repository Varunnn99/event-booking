import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, clearCart } from "@/redux/cartSlice.js";
import { Link } from "react-router-dom";
import EventCard from "../components/EventCard/EventCard"; 
import "./MyCard.css";


const MyCart = () => {
  const { items: cartItems, totalAmount } = useSelector(state => state.cart);
  const dispatch = useDispatch();

  console.log("🔥 Redux Cart State:", cartItems); // Debugging

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  return (
    <div className="mycart-container">
      <br/><br/><br/><br/>
      <h2>My Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-container">
          {cartItems.map(event => (
            <div key={event.id} className="cart-item">
              <EventCard 
                id={event.id}
                heading={event.heading}
                date={event.date}
                location={event.location}
                img={event.img}
              />
              <button onClick={() => handleRemove(event.id)}>Remove</button>
            </div>
          ))}
        </div>
      )}

      <h3>Total: ₹{totalAmount.toFixed(2)}</h3>
      <div className="cart-buttons">
        <button className="clear-cart-btn" onClick={() => dispatch(clearCart())}>Clear Cart</button>
        {cartItems.length > 0 && (
          <Link to="/checkout" className="proceed-btn">
            Proceed to Payment
          </Link>
        )}
      </div>
    </div>
  );
};

export default MyCart;
