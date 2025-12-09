import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ProductCard from "./ProductCard";
import Loading from "./Loading";

const FeaturedProducts = () => {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5001/products?limit=8");
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  return (
    <section className="py-20 bg-base-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-700">Featured Items</h2>
          <p className="text-gray-600">
            Check out the latest listings available for you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>

        <div className="text-center mt-8">
          <a href="/marketplace" className="btn bg-blue-600 hover:bg-blue-700 text-white">
            View All Items
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
