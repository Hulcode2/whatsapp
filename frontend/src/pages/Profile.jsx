import { ArrowLeft, Plus } from "lucide-react";
import { useState, useRef } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import useAuthStore from "../context/AuthStore";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/paths";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { colors } from "../utils/constants";

const Profile = () => {
  const fileInputRef = useRef(null);
  const userInfo = useAuthStore((state) => state.userInfo);
  const updateUser = useAuthStore((state) => state.updateUser);
  const navigate = useNavigate();
  const [file, setFile] = useState(userInfo?.image || "");

  const [firstName, setFirstName] = useState(userInfo?.firstName || "");
  const [lastName, setLastName] = useState(userInfo?.lastName || "");
  const [colorIndex, setColorIndex] = useState(userInfo?.color || 0);

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    setFile(selectedFile);
  }
  async function handleEditProfile() {
    if (!firstName.trim()) {
      return toast.error("First name is required");
    }

    if (!lastName.trim()) {
      return toast.error("Last name is required");
    }

    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("color", colorIndex);
      formData.append("profileSetup", true);
      formData.append("image", file);

      const { data } = await axiosInstance.post(
        API_PATHS.AUTH.UPDATE_PROFILE,
        formData,
      );
      console.log(data);
      if (!data.success) {
        return toast.error(data.message);
      }

      updateUser({
        firstName,
        lastName,
        color: colorIndex,
        image: data.user.image,
        profileSetup: true,
      });

      toast.success("Profile updated successfully");

      navigate("/");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err.message || "Something went wrong",
      );
    }
  }
  const email = userInfo?.email || "";
  return (
    <div className="relative flex  items-center gap-20 w-screen h-screen bg-[#1d1d29] flex-col  md:flex-row justify-center">
      {/* Back Button */}
      <button
        onClick={() => {
          navigate(-1);
        }}
        className="absolute left-16 top-7 text-white hover:text-purple-400 transition"
      >
        <ArrowLeft size={38} />
      </button>

      {/* Avatar */}
      <div className="flex flex-col items-center">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => handleFileChange(e)}
        />
        <span
          onClick={() => fileInputRef.current?.click()}
          className="group relative w-40 h-40 cursor-pointer text-5xl border-2 border-red-800 rounded-full bg-red-950/65 flex items-center justify-center"
        >
          {file || userInfo.image ? (
            <img
              src={
                file instanceof File
                  ? URL.createObjectURL(file)
                  : file || userInfo.image
              }
              alt="Profile"
              className="w-full h-full object-cover  rounded-full"
            />
          ) : (
            <p className="group-hover:hidden text-white font-bold text-5xl">
              {email ? email[0].toUpperCase() : "?"}
            </p>
          )}

          {/* Plus Icon */}
          <Plus className="hidden group-hover:block text-white absolute w-10 h-10" />
        </span>
      </div>

      {/* Form */}
      <div className="w-96 space-y-4">
        <Input
          placeholder="Email"
          className="py-5 text-white bg-transparent"
          disabled
          value={email}
        />

        <Input
          placeholder="First Name"
          className="py-5 text-white"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <Input
          placeholder="Last Name"
          className="py-5 text-white"
          onChange={(e) => setLastName(e.target.value)}
          value={lastName}
        />

        {/* Colors */}

        <div className="flex gap-4 pt-2">
          {colors.map((color, index) => (
            <button
              onClick={() => setColorIndex(index)}
              key={color}
              className={`${color} ${index === colorIndex ? "border-3" : " border-1"} w-8 h-8 rounded-full border-white  transition`}
            />
          ))}
        </div>

        <Button
          className="w-full mt-6 bg-purple-600 hover:bg-purple-700"
          onClick={handleEditProfile}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Profile;
