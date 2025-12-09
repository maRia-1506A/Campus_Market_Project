import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FaUpload } from "react-icons/fa";
import { useState } from "react";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";
import imageUpload from "../utils/imageUpload";
import useAxiosSecure from "../hooks/useAxiosSecure";

const SellItem = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const categories = ["Books", "Electronics", "Furniture", "Clothing", "Sports", "Other"];
  const conditions = ["New", "Like New", "Good", "Fair", "Poor"];

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const onSubmit = async (form) => {
    if (!imageFile)
      return Swal.fire("Image Required", "Please upload an item image.", "warning");

    setUploading(true);

    try {
      const imageUrl = await imageUpload(imageFile);

      const newItem = {
        ...form,
        price: parseFloat(form.price),
        image: imageUrl,
        sellerName: user.displayName,
        sellerEmail: user.email,
        views: 0,
        createdAt: new Date(),
      };

      const axiosSecure = useAxiosSecure();
      const res = await axiosSecure.post("http://localhost:5001/products", newItem);

      if (res.data.insertedId) {
        Swal.fire("Listed!", "Your item is now live.", "success");
        reset();
        setPreview(null);
        navigate("/my-listings");
      }
    } catch (e) {
      Swal.fire("Error", e.message, "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <Helmet>
        <title>Sell Item - Campus Market</title>
      </Helmet>

      <div className="max-w-3xl mx-auto bg-white shadow-xl p-8 rounded-lg mt-12 border border-gray-200">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">List Your Item</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">


          <div className="form-control">
            <label className="label font-semibold text-gray-700">Product Image *</label>
            <div className="flex flex-col items-center gap-4 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              {preview && (
                <img src={preview} className="w-full h-64 rounded-lg object-cover shadow-sm" />
              )}

              <label className="btn bg-white border-gray-300 text-gray-700 hover:bg-gray-100 w-full">
                <FaUpload className="mr-2" />
                {preview ? "Change Image" : "Upload Image"}
                <input type="file" accept="image/*" hidden onChange={handleImage} />
              </label>
            </div>
          </div>


          <Input
            label="Title"
            name="title"
            register={register}
            error={errors.title}
            required="Title is required"
            placeholder="e.g., Calculus Textbook"
          />


          <Textarea
            label="Description"
            name="description"
            register={register}
            error={errors.description}
            required="Description is required"
          />


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Price ($)"
              type="number"
              step="0.01"
              name="price"
              register={register}
              error={errors.price}
              required="Price is required"
            />

            <Select
              label="Category"
              name="category"
              register={register}
              error={errors.category}
              required="Category is required"
              options={categories}
            />
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Condition"
              name="condition"
              register={register}
              error={errors.condition}
              required="Condition is required"
              options={conditions}
            />

            <Input
              label="Location (optional)"
              name="location"
              register={register}
            />
          </div>

          <button
            type="submit"
            className="btn bg-blue-700 hover:bg-blue-800 text-white btn-lg w-full mt-4"
            disabled={uploading}
          >
            {uploading ? <span className="loading loading-spinner"></span> : "List Item"}
          </button>
        </form>
      </div>
    </div>
  );
};




const Input = ({ label, name, register, required, error, ...rest }) => (
  <div className="form-control w-full">
    <label className="label font-semibold text-gray-700">{label}</label>
    <input
      {...register(name, required && { required })}
      className="input input-bordered w-full bg-gray-50 border-gray-300 text-gray-900 focus:bg-white focus:border-blue-600 focus:outline-none"
      {...rest}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
  </div>
);

const Textarea = ({ label, name, register, required, error }) => (
  <div className="form-control w-full">
    <label className="label font-semibold text-gray-700">{label}</label>
    <textarea
      {...register(name, required && { required })}
      className="textarea textarea-bordered h-32 w-full bg-gray-50 border-gray-300 text-gray-900 focus:bg-white focus:border-blue-600 focus:outline-none"
    />
    {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
  </div>
);

const Select = ({ label, name, options, register, required, error }) => (
  <div className="form-control w-full">
    <label className="label font-semibold text-gray-700">{label}</label>
    <select
      className="select select-bordered w-full bg-gray-50 border-gray-300 text-gray-900 focus:bg-white focus:border-blue-600 focus:outline-none"
      {...register(name, required && { required })}
    >
      <option value="">Select {label.toLowerCase()}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
  </div>
);

export default SellItem;


