import React from "react";
import { Loader2Icon, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { getAllPublicListing, getAllUserListing } from "../app/features/listingSlice";
import api from "../configs/axios";

const Managelisting = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userListings } = useSelector((state) => state.listing);

  const { getToken } = useAuth();
  const dispatch = useDispatch();


  const [loadingListing, setLoadingListing] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);

  const [formData, setFormData] = React.useState({
    title: "",
    platform: "",
    username: "",
    followers_count: "",
    engagement_rate: "",
    monthly_views: "",
    niche: "",
    price: "",
    description: "",
    verified: false,
    monetized: false,
    country: "",
    age_range: "",
    images: [],
  });

  const platforms = [
    "Instagram",
    "YouTube",
    "TikTok",
    "Twitch",
    "Twitter",
    "Facebook",
    "LinkedIn",
    "Pinterest",
    "Snapchat",
    "Reddit",
  ];

  const niches = [
    "Fashion",
    "Beauty",
    "Travel",
    "Food",
    "Fitness",
    "Lifestyle",
    "Gaming",
    "Tech",
    "Education",
    "Finance",
    "Business",
    "Entertainment",
    "Other",
  ];

  const ageRanges = [
    "13-17 years",
    "18-24 years",
    "25-34 years",
    "35-44 years",
    "45-54 years",
    "55+ years",
    "Mixed ages",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    if (files.length + formData.images.length > 5) {
      toast.error("You can upload a maximum of 5 images");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  React.useEffect(() => {
  if (!id) return;

  setIsEditing(true);
  setLoadingListing(true);

  const listing = userListings.find((item) => item.id === id);

  if (listing) {
    setFormData(listing);
    setLoadingListing(false);
  } else {
    toast.error("Listing not found");
    navigate("/my-listings");
  }
}, [id, userListings, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Saving...");
    const dataCopy = structuredClone(formData);

    if (!formData.title) {
      toast.dismiss(toastId);
      toast.error("Title is required");
      return;
    }

    try {
      if (isEditing) {
        dataCopy.images = formData.images.filter((image) => typeof image === "string");
        const formDataInstance = new FormData();
        formDataInstance.append("accountDetails", JSON.stringify(dataCopy));

        formData.images
          .filter((image) => typeof image !== "string")
          .forEach((image) => {
            formDataInstance.append("images", image);
          });

        const token = await getToken();
        const { data } = await api.put("/api/listing", formDataInstance, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(data.message);
      } else {
        delete dataCopy.images;

        const formDataInstance = new FormData();
        formDataInstance.append("accountDetails", JSON.stringify(dataCopy));
        formData.images.forEach((image) => {
          formDataInstance.append("images", image);
        });

        const token = await getToken();
        const { data } = await api.post("/api/listing", formDataInstance, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(data.message);
      }

      dispatch(getAllUserListing({ getToken }));
      dispatch(getAllPublicListing());
      navigate("/my-listings");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to save listing");
    } finally {
      toast.dismiss(toastId);
    }
  };

  if (loadingListing) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2Icon className="size-7 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {isEditing ? "Edit Listing" : "List Your Account"}
          </h1>
          <p className="text-gray-600 mt-2">
            Fill out the form below to{" "}
            {isEditing ? "update your listing" : "create a new listing"}.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* BASIC INFO */}
          <Section title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Listing Title *"
                value={formData.title}
                onChange={(val) => handleInputChange("title", val)}
                placeholder="e.g. Premium Travel Instagram Account"
                required={true}
              />
              <SelectField
                label="Platform *"
                value={formData.platform}
                onChange={(val) => handleInputChange("platform", val)}
                options={platforms}
                required ={true}
              />
              <InputField
                label="Username/Handle *"
                value={formData.username}
                onChange={(val) => handleInputChange("username", val)}
                placeholder="e.g. @travelwithme"
                required={true}
              />
              <SelectField
                label="Niche"
                value={formData.niche}
                onChange={(val) => handleInputChange("niche", val)}
                options={niches}
                required={true}
              />



            </div>
          </Section>

          {/* maetrics */}
          <Section title="Account Stats">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <InputField
                label="Followers Count"
                type="number"
                min = {0}
                value={formData.followers_count}
                placeholder='100000'
                onChange={(val) =>
                  handleInputChange("followers_count", val)
                }
                required={true}
              />

              <InputField
                label="Engagement Rate (%)"
                type="number"
                min={0}
                max={100}
                placeholder='4'
                value={formData.engagement_rate}
                onChange={(val) =>
                  handleInputChange("engagement_rate", val)
                }
              />
              <InputField
                label="Monthly Views"
                type="number"
                min={0}
                placeholder='500000'
                value={formData.monthly_views}
                onChange={(val) =>
                  handleInputChange("monthly_views", val)
                }
              />
              
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
              label='Primary Audience Country'
              value={formData.country}
              onChange={(val)=>handleInputChange('country',val)}
              placeholder='e.g. India'
              />
              <SelectField
              label='Primary Audience Age Range'
              value={formData.age_range}
              onChange={(val)=>handleInputChange('age_range',val)}
              options={ageRanges}
              />


            </div>
            <div className="space-y-3">
              <CheckboxField
                label="Verified Account"
                checked={formData.verified}
                onChange={(val) =>
                  handleInputChange("verified", val)
                }
              />
              <CheckboxField
                label="Monetized Account"
                checked={formData.monetized}
                onChange={(val) =>
                  handleInputChange("monetized", val)
                }
              />

            </div>
          </Section>

          {/* Pricing */}
          <Section title="Pricing & Description">
            <InputField
              label="Listing Price (USD) *"
              type="number"
              min={0}
              value={formData.price}
              onChange={(val) => handleInputChange("price", val)}
              placeholder='e.g. 500'
              required={true}
            />

             <TextAreaField
              label="Account Description"
              value={formData.description}
              onChange={(val) => handleInputChange("description", val)}
              placeholder="Provide a detailed description of your account, including content themes, posting frequency, and any other relevant information that would help potential buyers understand the value of your listing."
            />
          </Section>

          

          {/* IMAGES */}
          <Section title="Screenshots & Proofs">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                className="hidden"
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <label
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer capitalize"
                htmlFor="images"
              >
                choose files
              </label>
              <p className="text-sm text-gray-500 mt-2">
                Upload screenshots or proof of account analytics
              </p>
            </div>
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={typeof img === "string" ? img : URL.createObjectURL(img)}
                      alt={`Upload Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      className="absolute -top-2 -right-2 size-6 bg-red-600 text-white rounded-full hover:bg-red-700"
                      type="button"
                      onClick={() => removeImage(index)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Section>
          <div className="flex justify-end gap-3 text-sm">
            <button onClick={()=>navigate(-1)} type="button" className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              cancel
            </button>
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors" type="submit">
              {isEditing ? "Update" : "Create"}

            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

/* =======================
   REUSABLE COMPONENTS
======================= */

const Section = ({ title, children }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
    <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
    {children}
  </div>
);

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  min,
  max,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      min={min}
      max={max}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
);
const SelectField = ({ label, value, onChange, options, required=false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">  
      {label}
    </label>

    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required = {required}
      className="w-full px-3 py-1.5 text-gray-400 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300"
    >
      <option value="">Select... {label.toLowerCase()}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}


      </select>

    </div>
    );
    const CheckboxField = ({ label, checked, onChange,required=false }) => (
      <label className="flex items-center space-x-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="flex items-center justify-center w-4 h-4 border border-gray-300 rounded-sm bg-white checked:bg-indigo-600 checked:border-indigo-600 focus:outline-none cursor-pointer"
        />
        <span className="text-gray-700">{label}</span>
      </label>
      
    );
    const TextAreaField = ({ label, value, onChange, placeholder, required=false }) => (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">  
          {label}
        </label>
        <textarea
          value={value}          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          rows={5}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    );
  

export default Managelisting;
