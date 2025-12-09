import { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaUniversity,
  FaEdit,
  FaSave,
} from "react-icons/fa";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import imageUpload from "../utils/imageUpload";

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.photoURL);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.displayName,
      email: user?.email,
      phone: "",
      university: "",
    },
  });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data) => {
    try {
      let photoURL = imagePreview;

      if (imageFile) photoURL = await imageUpload(imageFile);

      await updateUserProfile(data.name, photoURL);

      await axios.put(`http://localhost:5001/users/${user.email}`, {
        name: data.name,
        phone: data.phone,
        university: data.university,
        avatar: photoURL,
      });

      Swal.fire({ icon: "success", title: "Profile Updated!", timer: 1500 });
      setEditing(false);
      setImageFile(null);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Update Failed", text: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-8 mt-12">
      <Helmet>
        <title>Profile - Campus Market</title>
      </Helmet>

      <div className="max-w-4xl mx-auto p-6 bg-base-100 shadow-xl rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Profile</h1>

          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="btn bg-violet-600 text-white px-2"
            >
              <FaEdit className="mr-2" />
              Edit Profile
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-8 text-center">
            <div className="avatar">
              <div className="w-32 rounded-full ring ring-violet-600 ring-offset-base-100 ring-offset-2">
                <img src={imagePreview} alt="profile" />
              </div>
            </div>

            {editing && (
              <label className="btn btn-sm btn-outline mt-4">
                Change Photo
                <input type="file" accept="image/*" onChange={handleImage} hidden />
              </label>
            )}
          </div>

          <div className="space-y-4">
            <InputField
              label="Full Name"
              icon={<FaUser />}
              disabled={!editing}
              register={register}
              name="name"
              error={errors.name}
            />

            <InputField
              label="Email"
              icon={<FaEnvelope />}
              disabled
              register={register}
              name="email"
            />

            <InputField
              label="Phone Number"
              icon={<FaPhone />}
              disabled={!editing}
              register={register}
              name="phone"
            />

            <InputField
              label="University"
              icon={<FaUniversity />}
              disabled={!editing}
              register={register}
              name="university"
            />
          </div>

          {editing && (
            <div className="flex gap-4 mt-8">
              <button type="submit" className="btn bg-violet-600 text-white flex-1">
                <FaSave className="mr-2" />
                Save Changes
              </button>

              <button
                type="button"
                className="btn flex-1"
                onClick={() => {
                  setEditing(false);
                  setImagePreview(user?.photoURL);
                  setImageFile(null);
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

const InputField = ({ label, icon, disabled, register, name, error }) => (
  <div className="form-control">
    <label className="label font-semibold">
      {icon} <span className="ml-2">{label}</span>
    </label>
    <input
      className="input input-bordered"
      disabled={disabled}
      {...register(name)}
    />
    {error && <span className="text-error text-sm mt-1">{error.message}</span>}
  </div>
);

export default Profile;




