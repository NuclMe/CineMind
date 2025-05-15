import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function LandingPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center text-white relative"
      style={{ backgroundImage: 'url(/your-bg.jpg)' }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      <div className="relative z-10 text-center p-4">
        <img
          src={logo}
          alt="CineMind Logo"
          className="w-32 mx-auto mb-4 bg-[wheat] rounded-full p-2"
        />
        <h1 className="text-4xl font-bold mb-2">CineMind 🎬</h1>
        <p className="text-lg mb-6">
          Інтелектуальна система персоналізованих рекомендацій фільмів
        </p>

        <div className="flex space-x-4 justify-center">
          <Link
            to="/login"
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
