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
    <div className="min-h-screen bg-gray-100 py-8"> {/* Changed main bg slightly for contrast */}
      <Helmet>
        <title>Sell Item - Campus Market</title>
      </Helmet>

      <div className="max-w-3xl mx-auto bg-white shadow-xl p-8 rounded-lg mt-12 border border-gray-200">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">List Your Item</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Image Upload */}
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

          {/* Title */}
          <Input
            label="Title"
            name="title"
            register={register}
            error={errors.title}
            required="Title is required"
            placeholder="e.g., Calculus Textbook"
          />

          {/* Description */}
          <Textarea
            label="Description"
            name="description"
            register={register}
            error={errors.description}
            required="Description is required"
          />

          {/* Price + Category */}
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

          {/* Condition + Location */}
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

/* ----------- Reusable Components (Updated Styles) ----------- */

// Added bg-gray-50, text-gray-900, and focus classes to make inputs visible
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

// import { useForm } from 'react-hook-form';
// import { useNavigate } from 'react-router-dom';
// import { Helmet } from 'react-helmet-async';
// import { FaUpload } from 'react-icons/fa';
// import { useState } from 'react';
// import Swal from 'sweetalert2';
// import useAuth from '../hooks/useAuth';
// import imageUpload from '../utils/imageUpload';
// import axios from 'axios';

// const SellItem = () => {
//     const { register, handleSubmit, formState: { errors }, reset } = useForm();
//     const { user } = useAuth();
//     const navigate = useNavigate();
//     const [imageFile, setImageFile] = useState(null);
//     const [imagePreview, setImagePreview] = useState(null);
//     const [uploading, setUploading] = useState(false);

//     const categories = ['Books', 'Electronics', 'Furniture', 'Clothing', 'Sports', 'Other'];
//     const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setImageFile(file);
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setImagePreview(reader.result);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const onSubmit = async (data) => {
//         if (!imageFile) {
//             Swal.fire({
//                 icon: 'warning',
//                 title: 'Image Required',
//                 text: 'Please upload an image of your item'
//             });
//             return;
//         }

//         setUploading(true);

//         try {
//             // Upload image
//             const imageUrl = await imageUpload(imageFile);

//             // Create product object
//             const productData = {
//                 title: data.title,
//                 description: data.description,
//                 price: parseFloat(data.price),
//                 category: data.category,
//                 condition: data.condition,
//                 image: imageUrl,
//                 sellerName: user.displayName,
//                 sellerEmail: user.email,
//                 location: data.location || '',
//                 views: 0,
//                 createdAt: new Date()
//             };

//             // Save to database
//             const response = await axios.post('http://localhost:5001/products', productData);

//             if (response.data.insertedId) {
//                 Swal.fire({
//                     icon: 'success',
//                     title: 'Item Listed!',
//                     text: 'Your item has been successfully listed',
//                     timer: 2000
//                 });
//                 reset();
//                 setImageFile(null);
//                 setImagePreview(null);
//                 navigate('/my-listings');
//             }
//         } catch (error) {
//             console.error('Error creating listing:', error);
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Failed to List Item',
//                 text: error.message
//             });
//         } finally {
//             setUploading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-base-200 py-8">
//             <Helmet>
//                 <title>Sell Item - Campus Market</title>
//             </Helmet>

//             <div className="max-w-3xl mx-auto px-4">
//                 <div className="bg-base-100 rounded-lg shadow-xl p-8">
//                     <h1 className="text-3xl font-bold mb-6 text-center">List Your Item</h1>

//                     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//                         {/* Image Upload */}
//                         <div className="form-control">
//                             <label className="label">
//                                 <span className="label-text font-semibold">Product Image *</span>
//                             </label>
//                             <div className="flex flex-col items-center gap-4">
//                                 {imagePreview && (
//                                     <img
//                                         src={imagePreview}
//                                         alt="Preview"
//                                         className="w-full h-64 object-cover rounded-lg"
//                                     />
//                                 )}
//                                 <label className="btn btn-outline w-full">
//                                     <FaUpload className="mr-2" />
//                                     {imagePreview ? 'Change Image' : 'Upload Image'}
//                                     <input
//                                         type="file"
//                                         accept="image/*"
//                                         onChange={handleImageChange}
//                                         className="hidden"
//                                     />
//                                 </label>
//                             </div>
//                         </div>

//                         {/* Title */}
//                         <div className="form-control">
//                             <label className="label">
//                                 <span className="label-text font-semibold">Title *</span>
//                             </label>
//                             <input
//                                 type="text"
//                                 placeholder="e.g., Calculus Textbook 10th Edition"
//                                 className="input input-bordered"
//                                 {...register('title', { required: 'Title is required' })}
//                             />
//                             {errors.title && (
//                                 <span className="text-error text-sm mt-1">{errors.title.message}</span>
//                             )}
//                         </div>

//                         {/* Description */}
//                         <div className="form-control">
//                             <label className="label">
//                                 <span className="label-text font-semibold">Description *</span>
//                             </label>
//                             <textarea
//                                 placeholder="Describe your item in detail..."
//                                 className="textarea textarea-bordered h-32"
//                                 {...register('description', { required: 'Description is required' })}
//                             />
//                             {errors.description && (
//                                 <span className="text-error text-sm mt-1">{errors.description.message}</span>
//                             )}
//                         </div>

//                         {/* Price and Category Row */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             {/* Price */}
//                             <div className="form-control">
//                                 <label className="label">
//                                     <span className="label-text font-semibold">Price ($) *</span>
//                                 </label>
//                                 <input
//                                     type="number"
//                                     step="0.01"
//                                     placeholder="0.00"
//                                     className="input input-bordered"
//                                     {...register('price', {
//                                         required: 'Price is required',
//                                         min: { value: 0, message: 'Price must be positive' }
//                                     })}
//                                 />
//                                 {errors.price && (
//                                     <span className="text-error text-sm mt-1">{errors.price.message}</span>
//                                 )}
//                             </div>

//                             {/* Category */}
//                             <div className="form-control">
//                                 <label className="label">
//                                     <span className="label-text font-semibold">Category *</span>
//                                 </label>
//                                 <select
//                                     className="select select-bordered"
//                                     {...register('category', { required: 'Category is required' })}
//                                 >
//                                     <option value="">Select category</option>
//                                     {categories.map(cat => (
//                                         <option key={cat} value={cat}>{cat}</option>
//                                     ))}
//                                 </select>
//                                 {errors.category && (
//                                     <span className="text-error text-sm mt-1">{errors.category.message}</span>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Condition and Location Row */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             {/* Condition */}
//                             <div className="form-control">
//                                 <label className="label">
//                                     <span className="label-text font-semibold">Condition *</span>
//                                 </label>
//                                 <select
//                                     className="select select-bordered"
//                                     {...register('condition', { required: 'Condition is required' })}
//                                 >
//                                     <option value="">Select condition</option>
//                                     {conditions.map(cond => (
//                                         <option key={cond} value={cond}>{cond}</option>
//                                     ))}
//                                 </select>
//                                 {errors.condition && (
//                                     <span className="text-error text-sm mt-1">{errors.condition.message}</span>
//                                 )}
//                             </div>

//                             {/* Location */}
//                             <div className="form-control">
//                                 <label className="label">
//                                     <span className="label-text font-semibold">Location (Optional)</span>
//                                 </label>
//                                 <input
//                                     type="text"
//                                     placeholder="e.g., Main Campus, Building A"
//                                     className="input input-bordered"
//                                     {...register('location')}
//                                 />
//                             </div>
//                         </div>

//                         {/* Submit Button */}
//                         <div className="form-control mt-6">
//                             <button
//                                 type="submit"
//                                 className="btn btn-primary btn-lg"
//                                 disabled={uploading}
//                             >
//                                 {uploading ? (
//                                     <>
//                                         <span className="loading loading-spinner"></span>
//                                         Uploading...
//                                     </>
//                                 ) : (
//                                     'List Item'
//                                 )}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SellItem;
