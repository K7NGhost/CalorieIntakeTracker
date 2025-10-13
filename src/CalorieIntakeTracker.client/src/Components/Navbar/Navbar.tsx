import { Flame } from "lucide-react";
import React from "react";
import "tailwindcss";

type Props = {};

const Navbar = (props: Props) => {
  return (
    <nav className="flex justify-between items-center px-8 py-4 border-b border-neutral-800">
      <div className="flex items-center space-x-2">
        <Flame className="text-orange-500" size={24}></Flame>
        <span className="text-x1 font-bold">CalorieIntakeTracker</span>
      </div>
      <div className="space-x-4 flex flex-row items-center">
        <div className="hover:text-orange-400 transition">Login</div>
        <div className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition">
          Sign Up
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
