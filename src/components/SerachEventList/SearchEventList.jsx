
import { useState, useEffect } from "react";
import EventCard from "../EventCard/EventCard";
import "./SearchEventList.css";

const SearchEventList = ({ monthYear }) => {
  const { selectedMonth, selectedYear } = monthYear;
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    if (!selectedMonth || !selectedYear) return;
  
    const url = `http://localhost:5000/api/events/filter?month=${encodeURIComponent(selectedMonth)}&year=${selectedYear}`;
    
    console.log("Fetching from:", url);
  
    fetch(url)
      .then((response) => {
        console.log("Response status:", response.status);
        return response.json();
      })
      .then((data) => {
        console.log("Fetched events:", data);
        setFilteredEvents(data);
      })
      .catch((error) => console.error("Error fetching filtered events:", error));
  }, [selectedMonth, selectedYear]);
  
  
  

  return (
    <>
      {filteredEvents.length > 0 ? (
        filteredEvents.map(({ id, year, month, heading, location, img }) => (
          <EventCard
            key={id}
            id={id}
            date={{ year, month }}
            heading={heading}
            location={location}
            img={img}
          />
        ))
      ) : (
        <p>No Events in the date</p>
      )}
    </>
  );
};

export default SearchEventList;
