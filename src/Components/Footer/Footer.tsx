import React from "react";

type Props = {};

const Footer = (props: Props) => {
  return (
    <footer className="mt-auto py-6 text-center text-gray-500 border-t border-neutral-800">
      © {new Date().getFullYear()} CalorieIntakeTracker — Eat smart. Live
      better.
    </footer>
  );
};

export default Footer;
