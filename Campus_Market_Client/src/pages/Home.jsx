import { Helmet } from "react-helmet-async";
import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProducts";
import Categories from "../components/Categories";
import {
  FaShoppingBag,
  FaComments,
  FaExchangeAlt,
  FaShieldAlt,
} from "react-icons/fa";

const Home = () => {
  const features = [
    {
      icon: <FaShoppingBag className="text-5xl text-violet-600" />,
      title: "Easy Listing",
      description: "Post your items in seconds with our simple interface.",
    },
    {
      icon: <FaComments className="text-5xl text-indigo-600" />,
      title: "Direct Chat",
      description: "Communicate directly with buyers and sellers.",
    },
    {
      icon: <FaExchangeAlt className="text-5xl text-rose-600" />,
      title: "Exchange Items",
      description: "Trade items with other students easily.",
    },
    {
      icon: <FaShieldAlt className="text-5xl text-blue-600" />,
      title: "Safe & Secure",
      description: "Your data and transactions are protected.",
    },
  ];

  return (
    <div>
      <Helmet>
        <title>Campus Market - Student Exchange Platform</title>
      </Helmet>
      <Hero />

      <section className="py-20 bg-base-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-3">
            Why Choose Campus Market?
          </h2>
          <p className="text-gray-600 mb-12">
            Everything you need for student-to-student exchange
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f) => (
              <div key={f.title} className="card bg-base-100 shadow-md hover:shadow-xl transition">
                <div className="card-body text-center items-center">
                  {f.icon}
                  <h3 className="font-bold mt-3">{f.title}</h3>
                  <p className="text-gray-600">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Categories />
      <FeaturedProducts />


    </div>
  );
};

export default Home;
