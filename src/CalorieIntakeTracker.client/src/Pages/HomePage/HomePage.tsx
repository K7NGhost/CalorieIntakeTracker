import React from "react";
import "tailwindcss";
import { motion } from "framer-motion";
import { BarChart3, Camera, Utensils } from "lucide-react";
import { Link } from "react-router-dom";

type Props = {};

const HomePage = (props: Props) => {
  return (
    <>
      <main className="flex flex-col md:flex-row justify-between items-center px-8 md:px-16 py-20 gap-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl space-y-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            Track your meals. <br />
            <span className="text-orange-500">Transform your health.</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Simplify nutrition tracking with barcode scanning, AI food
            recognition, and personalized calorie goals — all in one sleek
            dashboard.
          </p>
          <div className="space-x-4">
            <Link to="/dashboard" className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-md font-semibold">
              Go to Dashboard
            </Link>
            <Link to="learnMore" className="border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white px-6 py-3 rounded-md font-semibold transition">
              Learn More
            </Link>
          </div>
        </motion.div>

        {/* Illustration or Image */}
        <motion.img
          src="/assets/hero_food_dark.svg"
          alt="Healthy food illustration"
          className="w-full md:w-[450px] rounded-2xl shadow-lg border border-neutral-800"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        />
      </main>

      <section className="py-20 px-8 md:px-16 bg-neutral-900 border-t border-neutral-800">
        <h2 className="text-center text-3xl font-bold mb-12 text-white">
          Features Built to Keep You Consistent
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              icon: <Camera size={32} className="text-orange-400" />,
              title: "AI Food Recognition",
              desc: "Snap a photo and instantly log nutritional details with smart image recognition.",
            },
            {
              icon: <BarChart3 size={32} className="text-orange-400" />,
              title: "Progress Tracking",
              desc: "Visualize calories, macros, and trends with easy-to-read analytics.",
            },
            {
              icon: <Utensils size={32} className="text-orange-400" />,
              title: "Personalized Goals",
              desc: "Set goals for weight loss, gain, or maintenance with adaptive calorie targets.",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-neutral-800 p-6 rounded-xl border border-neutral-700 shadow-sm hover:shadow-md transition"
            >
              <div className="mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                {f.title}
              </h3>
              <p className="text-gray-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
};

export default HomePage;
