import { FaBook, FaLaptop, FaCouch, FaTshirt, FaFootballBall, FaEllipsisH } from "react-icons/fa";
import { Link } from "react-router-dom";

const Categories = () => {
  const categories = [
    { name: "Books", icon: <FaBook className="text-4xl" />, color: "text-blue-600" },
    { name: "Electronics", icon: <FaLaptop className="text-4xl" />, color: "text-violet-600" },
    { name: "Furniture", icon: <FaCouch className="text-4xl" />, color: "text-emerald-600" },
    { name: "Clothing", icon: <FaTshirt className="text-4xl" />, color: "text-rose-600" },
    { name: "Sports", icon: <FaFootballBall className="text-4xl" />, color: "text-amber-600" },
    { name: "Other", icon: <FaEllipsisH className="text-4xl" />, color: "text-sky-600" },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-2">Browse by Category</h2>
          <p className="text-gray-600">Find exactly what you're looking for</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((c) => (
            <Link
              key={c.name}
              to={`/marketplace?category=${c.name}`}
              className="card bg-base-100 shadow-md hover:shadow-xl cursor-pointer transition"
            >
              <div className="card-body items-center text-center">
                <div className={c.color}>{c.icon}</div>
                <h3 className="font-semibold mt-2">{c.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
