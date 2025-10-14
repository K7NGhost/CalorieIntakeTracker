import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import { UserProvider } from "./Context/useAuth";
import {ToastContainer} from "react-toastify"

function App() {
  return (
    <>
      <UserProvider>
      <div className="min-h-screen bg-neutral-950 text-gray-100 flex flex-col">
        <ToastContainer></ToastContainer>
        <Navbar></Navbar>
        <Outlet></Outlet>
        <Footer></Footer>
      </div>
      </UserProvider>
    </>
  );
}

export default App;
