import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { addToCart } from "../../redux/cartSlice";
import Navigation from "../../components/Navigation/Navigation";
import { MdCalendarMonth } from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";
import "./EventDetails.css";

const EventDetails = () => {
  const { id } = useParams();
  const numId = Number(id);
  const dispatch = useDispatch();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch event details from backend
  useEffect(() => {
    fetch(`http://localhost:5000/api/events/${numId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Event not found");
        }
        return response.json();
      })
      .then((data) => {
        setEvent(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching event details:", error);
        setLoading(false);
      });
  }, [numId]);
  

  const handleAddToCart = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to be logged in to add items to the cart.");
      return;
    }
    dispatch(addToCart(event));
    alert("Event added to cart!");
  };

  if (loading) {
    return <p>Loading event details...</p>;
  }

  if (!event) {
    return <p>Event not found.</p>;
  }

  return (
    <div className="event-details-container">
      <Navigation />
      <div className="event-details-wrapper">
        <img src={event.img} alt="Event" />
        <div className="event-details-content">
          <h3>Event Name: {event.heading}</h3>
          <div className="small-details">
            <p className="date">
              <MdCalendarMonth className="icon" />
              <span className="font-weight-med">{event.month}</span>
              <span className="font-weight-med">{event.year}</span>
            </p>
            <p className="location font-weight-med">
              <IoLocationSharp className="icon" />
              {event.location}
            </p>
          </div>

          <p className="price">
            <span className="price-label">Price:</span>
            <span className="price-value">₹{event.price}</span>
          </p>

          <p className="description">
            <span className="description-heading">Event Description:</span>
            <span className="description-heading-para">
              {event.description}
            </span>
          </p>

          <button className="add-to-cart" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
