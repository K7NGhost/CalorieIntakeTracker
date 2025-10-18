import React from "react";
import "tailwindcss";
import { motion } from "framer-motion";
import { BarChart3, Camera, Utensils } from "lucide-react";
import heroSectionImage from '../../assets/hero_food_dark.png'

// Optional: shared animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerParent = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

type Props = {};

const HomePage = (props: Props) => {
  return (
    <>
      {/* HERO */}
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
          <div className="space-y-4">
            <button className="bg-orange-500 cursor-pointer hover:bg-orange-600 px-6 py-3 rounded-md font-semibold w-full sm:w-auto">
              Go to Dashboard
            </button>
            <button className="border cursor-pointer border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white px-6 py-3 rounded-md font-semibold transition w-full sm:w-auto">
              Learn More
            </button>
          </div>
        </motion.div>

        {/* Illustration or Image */}
        <motion.img
          src={heroSectionImage}
          alt="Application demo photo"
          className="w-full md:w-[450px] rounded-2xl shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        />
      </main>

      {/* CORE FEATURES */}
      <section id="features" className="py-20 px-8 md:px-16 bg-neutral-900 border-t border-neutral-800">
        <h2 className="text-center text-3xl font-bold mb-12 text-white">
          Features Built to Keep You Consistent
        </h2>
        <motion.div variants={staggerParent} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="grid md:grid-cols-3 gap-10">
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
              variants={fadeUp}
              className="bg-neutral-800 p-6 rounded-xl border border-neutral-700 shadow-sm hover:shadow-md transition"
              whileHover={{ y: -5 }}
            >
              <div className="mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-white">{f.title}</h3>
              <p className="text-gray-400">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* WHY CHOOSE */}
      <section className="py-20 px-8 md:px-16 ">
        <h2 className="text-center text-3xl font-bold mb-12 text-white">
          Why choose CalorieIntakeTracker?
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              icon: <Camera size={32} className="text-orange-400" />,
              title: "Free Up Your Time",
              desc: "{project name} automatically calculates your calories, protein, carbs, and fat. You can also add your own foods and recipes. So no need to calculate calories manually.",
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
              <h3 className="text-xl font-semibold mb-2 text-white">{f.title}</h3>
              <p className="text-gray-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 px-8 md:px-16 bg-neutral-900 border-y border-neutral-800">
        <h2 className="text-center text-3xl font-bold mb-12 text-white">How it works</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              step: '1',
              title: 'Scan or Snap',
              text: 'Use barcode scan or take a photo. Our AI recognizes foods instantly.'
            },
            {
              step: '2',
              title: 'Log & Learn',
              text: 'Your macros and calories auto-fill. Save favorites and custom recipes.'
            },
            {
              step: '3',
              title: 'Stick to Goals',
              text: 'Daily targets adapt to your progress, keeping you consistent.'
            },
          ].map((s, i) => (
            <motion.div key={i} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
              <div className="text-orange-500 text-sm font-bold">STEP {s.step}</div>
              <h3 className="text-2xl text-white font-semibold mt-2">{s.title}</h3>
              <p className="text-gray-400 mt-2">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SMART INTEGRATIONS */}
      <section id="integrations" className="py-20 px-8 md:px-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-3xl font-bold mb-3 text-white">Smart integrations</h2>
          <p className="text-center text-gray-400 mb-12">Connect wearables and apps to sync steps, workouts, and weight automatically.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {["Apple Health", "Google Fit", "Fitbit", "Garmin", "Strava", "Withings"].map((name) => (
              <div key={name} className="border border-neutral-700 text-gray-300 rounded-lg px-3 py-2 text-center bg-neutral-800">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-20 px-8 md:px-16 bg-neutral-900 border-y border-neutral-800">
        <h2 className="text-center text-3xl font-bold mb-12 text-white">Loved by busy people</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              quote: "Logging used to take forever. Now it’s 30 seconds max.",
              name: "Sara P.", role: "Nursing Student"
            },
            {
              quote: "The trends view helped me dial in protein. Energy up, weight down.",
              name: "Jamal R.", role: "Retail Manager"
            },
            {
              quote: "I love the recipe saver and weekly goals. Super simple.",
              name: "Lena W.", role: "Designer"
            },
          ].map((t, i) => (
            <motion.figure key={i} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
              <div className="text-yellow-400 mb-2">★★★★★</div>
              <blockquote className="text-gray-200">“{t.quote}”</blockquote>
              <figcaption className="mt-4 text-gray-400 text-sm">{t.name} • {t.role}</figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20 px-8 md:px-16">
        <h2 className="text-center text-3xl font-bold mb-12 text-white">Simple pricing</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {[
            {
              name: 'Free',
              price: '$0',
              period: '/mo',
              features: ['Food search & logging', 'Barcode scan', 'Basic analytics', 'Up to 50 saved foods'],
              cta: 'Start Free',
              highlighted: false,
            },
            {
              name: 'Pro',
              price: '$6',
              period: '/mo',
              features: ['AI image recognition', 'Advanced trends & export', 'Unlimited recipes & foods', 'Priority updates'],
              cta: 'Go Pro',
              highlighted: true,
            },
          ].map((p) => (
            <div key={p.name} className={`rounded-2xl border ${p.highlighted ? 'border-orange-500 bg-neutral-800/80' : 'border-neutral-700 bg-neutral-800'} p-8 shadow-lg`}>
              <div className="flex items-end gap-2">
                <h3 className="text-2xl font-semibold text-white">{p.name}</h3>
                <span className="ml-auto text-4xl font-bold text-white">{p.price}</span>
                <span className="text-gray-400">{p.period}</span>
              </div>
              <ul className="mt-6 space-y-3 text-gray-300">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-1">✔</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button className={`${p.highlighted ? 'bg-orange-500 hover:bg-orange-600' : 'border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white'} mt-8 w-full px-4 py-3 rounded-md font-semibold`}>
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-8 md:px-16 bg-neutral-900 border-y border-neutral-800">
        <h2 className="text-center text-3xl font-bold mb-10 text-white">FAQ</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            {
              q: 'Do I need an internet connection?',
              a: 'Most features work offline and sync when you reconnect. Image recognition requires connectivity.'
            },
            {
              q: 'Can I import from other apps?',
              a: 'Yes, you can import CSV exports for foods and body weight. Direct integrations are coming soon.'
            },
            {
              q: 'How accurate is AI recognition?',
              a: 'It recognizes common foods very well. You can always adjust macros before saving.'
            },
          ].map((item) => (
            <details key={item.q} className="group border border-neutral-700 rounded-lg bg-neutral-800 p-4">
              <summary className="cursor-pointer text-white font-medium flex items-center justify-between">
                {item.q}
                <span className="ml-4 text-orange-400 group-open:rotate-45 transition">＋</span>
              </summary>
              <p className="text-gray-400 mt-3">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="get-started" className="py-20 px-8 md:px-16">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-2xl p-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to build a healthier routine?</h2>
          <p className="text-gray-400 mt-3">Join thousands keeping nutrition simple and consistent.</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-md font-semibold">Create Free Account</button>
            <a href="#pricing" className="border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white px-6 py-3 rounded-md font-semibold">See Pricing</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-8 md:px-16 py-10 border-t border-neutral-800 text-gray-400">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h4 className="text-white font-semibold">CalorieIntakeTracker</h4>
            <p className="text-sm mt-2">Made for consistency-first nutrition tracking.</p>
          </div>
          <div>
            <h5 className="text-white font-medium">Product</h5>
            <ul className="mt-2 space-y-1">
              <li><a className="hover:text-white" href="#features">Features</a></li>
              <li><a className="hover:text-white" href="#how-it-works">How it works</a></li>
              <li><a className="hover:text-white" href="#integrations">Integrations</a></li>
              <li><a className="hover:text-white" href="#pricing">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-medium">Company</h5>
            <ul className="mt-2 space-y-1">
              <li><a className="hover:text-white" href="#">About</a></li>
              <li><a className="hover:text-white" href="#">Blog</a></li>
              <li><a className="hover:text-white" href="#">Careers</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-medium">Stay in the loop</h5>
            <form className="mt-2 flex gap-2">
              <input className="w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-white placeholder:text-neutral-500" placeholder="Email address" />
              <button type="button" className="rounded-md bg-orange-500 hover:bg-orange-600 px-4 text-sm font-semibold">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 text-xs">© {new Date().getFullYear()} CalorieIntakeTracker. All rights reserved.</div>
      </footer>
    </>
  );
};

export default HomePage;
