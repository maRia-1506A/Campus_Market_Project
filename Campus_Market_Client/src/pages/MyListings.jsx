import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import Loading from "../components/Loading";
import Swal from "sweetalert2";

const MyListings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["my-listings", user?.email],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5001/my-products/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email
  });

  const deleteListing = useMutation({
    mutationFn: async (id) => axios.delete(`http://localhost:5001/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["my-listings"]);
      Swal.fire("Deleted!", "Your item has been removed.", "success");
    }
  });

  const confirmDelete = (id, title) => {
    Swal.fire({
      title: "Delete this item?",
      text: title,
      icon: "warning",
      showCancelButton: true
    }).then(res => {
      if (res.isConfirmed) deleteListing.mutate(id);
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-base-200 py-8 mt-12">
      <Helmet>
        <title>My Listings - Campus Market</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 mt-10">


        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">My Listings</h1>
            <p className="text-gray-600">Manage your posted items</p>
          </div>

          <a href="/sell" className="btn bg-blue-600 text-white hover:bg-blue-700">
            + New Item
          </a>
        </div>


        {listings.length > 0 ? (
          <div className="grid gap-6">
            {listings.map(item => (
              <div key={item._id} className="card lg:card-side bg-base-100 shadow-lg">

                <figure className="lg:w-64">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 lg:h-full object-cover"
                  />
                </figure>

                <div className="card-body">
                  <h2 className="card-title text-2xl">{item.title}</h2>

                  <div className="flex gap-2 mt-2">
                    <span className="badge bg-blue-500 text-white">{item.category}</span>
                    <span className="badge bg-purple-500 text-white">{item.condition}</span>
                  </div>

                  <p className="mt-2 text-gray-600">{item.description}</p>

                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">

                    <span>Posted: {new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="card-actions justify-end mt-4">
                    <button
                      onClick={() => confirmDelete(item._id, item.title)}
                      className="btn btn-error btn-sm"
                    >
                      <FaTrash className="mr-1" /> Delete
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-base-100 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-blue-600">No Listings</h2>
            <p className="text-gray-600 mb-4">You haven’t posted anything yet</p>
            <a href="/sell" className="btn bg-blue-500 text-white hover:bg-blue-600">
              Create Listing
            </a>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyListings;




