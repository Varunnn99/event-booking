
import { useState, useEffect } from "react";
import EventCard from "../../components/EventCard/EventCard.jsx";
import Navigation from "../../components/Navigation/Navigation.jsx";
import "./EventList.css";

const EventList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  return (
    <div>
      <Navigation />
      <div className="event-list-wrapper">
        <div className="event-list">
          {events.length > 0 ? (
            events.map(({ id, year, month, heading, location, img }) => (
              <EventCard
              key={id}
              id={id}
              year={year}     
              month={month}   
              heading={heading}
              location={location}
              img={img}
              />

            ))
          ) : (
            <p>No events available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventList;
