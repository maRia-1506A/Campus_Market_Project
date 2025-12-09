import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import Loading from "../components/Loading";

const Marketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [sortOption, setSortOption] = useState("newest");


  useEffect(() => {
    if (category !== "All") {
      setSearchParams({ category });
    } else {
      searchParams.delete("category");
      setSearchParams(searchParams);
    }
  }, [category, setSearchParams, searchParams]);

  const categories = ["All", "Books", "Electronics", "Furniture", "Clothing", "Sports", "Other"];

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5001/products");
      return res.data;
    }
  });

  if (isLoading) return <Loading />;

  let filtered = products.filter(p => {
    const title = p?.title || '';
    const description = p?.description || '';
    const matchText =
      title.toLowerCase().includes(search.toLowerCase()) ||
      description.toLowerCase().includes(search.toLowerCase());

    const matchCategory = category === "All" || p.category === category;

    return matchText && matchCategory;
  });

  if (sortOption === "newest") {
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortOption === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortOption === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="min-h-screen bg-base-200 py-8 mt-20">
      <Helmet>
        <title>Marketplace - Campus Market</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600">Marketplace</h1>
          <p className="text-gray-800">Discover items posted by students</p>
        </div>

        <SearchBar searchTerm={search} setSearchTerm={setSearch} />


        <div className="bg-base-100 p-4 rounded-lg shadow mb-8 flex flex-wrap justify-between items-center gap-4">


          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`btn btn-sm px-4 ${category === cat ? "bg-blue-500 text-white" : "btn-outline"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>


          <select
            className="select select-bordered select-sm"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
          </select>
        </div>


        <p className="text-gray-600 mb-4">
          Showing {filtered.length} of {products.length} items
        </p>


        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-red-500">No items found</h2>
            <p className="text-gray-600">Try different filters</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Marketplace;




