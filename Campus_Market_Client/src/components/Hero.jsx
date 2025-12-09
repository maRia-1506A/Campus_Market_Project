


import { Link } from "react-router-dom";
import { FaSearch, FaShoppingBag } from "react-icons/fa";
import heroBg from "../assets/hero-bg.png";

const Hero = () => {
  return (
    <div className="hero min-h-[600px] bg-cover bg-center relative" style={{ backgroundImage: `url(${heroBg})` }}>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="hero-content text-center text-white relative z-10">
        <div className="max-w-3xl">
          <h1 className="mb-6 text-5xl md:text-6xl font-bold leading-tight">
            Find Everything You Need <br />
            <span className="text-blue-800">On Campus</span>
          </h1>

          <p className="mb-8 text-gray-200 text-lg md:text-xl max-w-2xl mx-auto">
            Exchange items with fellow students. Trade books, electronics, and notes within your university community. Safe, fast, and easy.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/marketplace"
              className="btn btn-lg bg-white text-indigo-600 hover:bg-gray-100 border-none"
            >
              <FaSearch className="mr-2" />
              Browse Items
            </Link>

            <Link
              to="/sell"
              className="btn btn-lg bg-indigo-600 text-white hover:bg-indigo-700 border-none"
            >
              <FaShoppingBag className="mr-2" />
              Sell an Item
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
