import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { useAuth } from "../../Context/useAuth";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

type Props = {};

type RegisterFormsInputs = {
  name: string;
  email: string;
  password: string;
};

const validation = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const RegisterPage = (props: Props) => {
  const { registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormsInputs>({ resolver: yupResolver(validation) });

  const handleLogin = (form: RegisterFormsInputs) => {
    registerUser(form.email, form.password, form.name);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-gray-100 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-lg"
      >
        <div className="flex items-center justify-center mb-6">
          <Flame className="text-orange-500 mr-2" size={28} />
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(handleLogin)}>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              UserName
            </label>
            <input
              type="text"
              placeholder="Enter name"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-100"
              required
              {...register("name")}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-100"
              required
              {...register("email")}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-100"
              required
              {...register("password")}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 py-2 rounded-md font-semibold transition"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-orange-400 hover:underline hover:text-orange-300"
          >
            Log In
          </Link>
        </div>

        <div className="text-center mt-4">
          <Link
            to="/"
            className="text-gray-500 hover:text-gray-300 text-sm transition"
          >
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
