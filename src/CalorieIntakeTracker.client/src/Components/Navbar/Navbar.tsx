import { Flame } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import "tailwindcss";
import RegisterPage from "../../Pages/RegisterPage/RegisterPage";
import { useAuth } from "../../Context/useAuth";
// commnent
type Props = {};
const test:String = "test";
const Navbar = (props: Props) => {
  const { isLoggedIn, logout } = useAuth();
  return (
    <nav className="flex justify-between items-center px-8 py-4 border-b border-neutral-800">
      {/* Brand */}
      <div className="flex items-center space-x-2">
        <Flame className="text-orange-500" size={24} />
        <Link to="/" className="text-xl font-bold text-white">
          CalorieIntakeTracker
        </Link>
      </div>

      {/* Right-side navigation */}
      <div className="space-x-4 flex flex-row items-center">
        {!isLoggedIn() ? (
          <>
            <Link to="/login" className="hover:text-orange-400 transition">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition"
            >
              Sign Up
            </Link>

          </>
        ) : (
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
