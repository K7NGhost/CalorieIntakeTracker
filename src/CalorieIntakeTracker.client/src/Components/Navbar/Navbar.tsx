import { Flame } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import "tailwindcss";
import RegisterPage from "../../Pages/RegisterPage/RegisterPage";

type Props = {};

const Navbar = (props: Props) => {
  return (
    <nav className="flex justify-between items-center px-8 py-4 border-b border-neutral-800">
      <div className="flex items-center space-x-2">
        <Flame className="text-orange-500" size={24}></Flame>
        <Link to="" className="text-x1 font-bold">
          CalorieIntakeTracker
        </Link>
      </div>
      <div className="space-x-4 flex flex-row items-center">
        <Link to="/login" className="hover:text-orange-400 transition">
          Login
        </Link>
        <Link
          to="/register"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
