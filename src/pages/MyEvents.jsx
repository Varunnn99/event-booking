import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import EventCard from "../components/EventCard/EventCard";
import { useNavigate } from "react-router-dom";
import "./MyEvents.css";

const MyEvents = () => {
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);
  const userId = user?.id;
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const [tickets, setTickets] = useState([]);
  const [events, setEvents] = useState({});

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      navigate("/login");
      return;
    }
    if (!userId) return; 

    // Fetch purchased tickets for the user
    fetch(`http://localhost:5000/api/orders/user/${userId}`)
      .then(response => {
        if (!response.ok) throw new Error("Failed to fetch tickets");
        return response.json();
      })
      .then(data => {
        setTickets(data);

        // Fetch event details for each ticket
        const eventRequests = data.map(ticket =>
          fetch(`http://localhost:5000/api/events/${ticket.event_id}`)
            .then(res => {
              if (!res.ok) throw new Error("Failed to fetch event details");
              return res.json();
            })
            .then(eventData => ({ event_id: ticket.event_id, ...eventData }))
        );

        return Promise.all(eventRequests);
      })
      .then(eventDetails => {
        const eventsMap = {};
        eventDetails.forEach(event => {
          eventsMap[event.event_id] = event;
        });
        setEvents(eventsMap);
      })
      .catch(error => console.error("Error fetching data:", error));
  }, [userId, isAuthenticated, navigate]);

  return (
    <div className="my-events-container">
      <br /><br /><br />
      <h2 className="my-events-title">My Events</h2>

      {tickets.length === 0 ? (
        <p className="no-tickets-message">No purchased tickets.</p>
      ) : (
        <div className="ticket-list">
          {tickets.map(ticket => {
            const event = events[ticket.event_id];
            return event ? (
              <div key={ticket.ticket_id} className="event-ticket-container">
                <EventCard 
                  id={event.event_id}  
                  heading={event.heading}  
                  year={event.year}        
                  month={event.month}      
                  location={event.location}
                  img={event.img}          
                />
                <p className="ticket-id"><strong>Ticket ID:</strong> {ticket.ticket_id}</p> 
              </div>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
};

export default MyEvents;
