import EventList from "../pages/EventList/EventList";
import FilterEvents from "../pages/FilterEvents/FilterEvents";
import EventDetail from "../pages/EventDetails/EventDetails";
import Login from "../pages/Login/Login";
import Register from "../pages/Login/Register";
import MyCart from "../pages/MyCart";
import Checkout from "../pages/Checkout"; 
import MyEvents from "../pages/MyEvents"; 

export const getRoutes = (setAuth) => [
  { path: "/", element: <EventList /> },
  { path: "/find-events", element: <FilterEvents /> },
  { path: "/events/:id", element: <EventDetail /> },
  { path: "/login", element: <Login setAuth={setAuth} /> },
  { path: "/register", element: <Register /> },
  { path: "/my-cart", element: <MyCart /> },
  { path: "/checkout", element: <Checkout /> }, 
  { path: "/my-events", element: <MyEvents /> }, 
];
