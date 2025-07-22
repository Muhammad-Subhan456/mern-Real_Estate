import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateListing() {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    regularPrice: 0,
    discountPrice: 0,
    bathrooms: 1,
    bedrooms: 1,
    furnished: false,
    parking: false,
    type: "rent",
    offer: false,
  });

  const { currentUser } = useSelector((state) => state.user);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listingId = params.listingId;
        const res = await fetch(`/api/listing/get/${listingId}`);
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          return;
        }

        setFormData({
          name: data.name || "",
          description: data.description || "",
          address: data.address || "",
          regularPrice: data.regularPrice || 0,
          discountPrice: data.discountPrice || 0,
          bathrooms: data.bathrooms || 1,
          bedrooms: data.bedrooms || 1,
          furnished: data.furnished || false,
          parking: data.parking || false,
          type: data.type || "rent",
          offer: data.offer || false,
        });

        setImageUrls(data.imageUrls || []);
      } catch (err) {
        console.error("Failed to fetch listing:", err);
      }
    };

    fetchListing();
  }, [params.listingId]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);
    setImagesPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((prev) => [...prev, reader.result]);
        }
      };
      reader.readAsDataURL(file);
      setImages((prev) => [...prev, file]);
    });
  };

  const handleImageSubmit = async () => {
    if (images.length === 0 || images.length > 6) {
      alert("Please select between 1 to 6 images.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    images.forEach((img) => formData.append("images", img));

    try {
      const res = await fetch("/api/upload-listing", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.imagesLink) {
        setImageUrls(data.imagesLink);
        alert("Images uploaded successfully!");
      } else {
        alert("Upload failed.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imageUrls.length === 0) {
      alert("Please upload images first.");
      return;
    }

    const submissionData = {
      ...formData,
      imageUrls,
      userRef: currentUser._id,
    };

    try {
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const data = await res.json();
      if (data.success) {
        alert("Listing updated!");
        navigate(`/listing/${data.listing._id}`);
      } else {
        alert("Failed to update listing");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update The Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg bg-white"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            maxLength="62"
            minLength="10"
            required
          />
          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg bg-white"
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg bg-white"
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />

          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                checked={formData.type === "sale"}
                onChange={() => setFormData({ ...formData, type: "sale" })}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                checked={formData.type === "rent"}
                onChange={() => setFormData({ ...formData, type: "rent" })}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                checked={formData.parking}
                onChange={(e) => setFormData({ ...formData, parking: e.target.checked })}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                checked={formData.furnished}
                onChange={(e) => setFormData({ ...formData, furnished: e.target.checked })}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                checked={formData.offer}
                onChange={(e) => setFormData({ ...formData, offer: e.target.checked })}
              />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg bg-white"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: +e.target.value })}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg bg-white"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: +e.target.value })}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="1"
                required
                className="p-3 border border-gray-300 rounded-lg bg-white"
                value={formData.regularPrice}
                onChange={(e) => setFormData({ ...formData, regularPrice: +e.target.value })}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                min="1"
                required
                className="p-3 border border-gray-300 rounded-lg bg-white"
                value={formData.discountPrice}
                onChange={(e) => setFormData({ ...formData, discountPrice: +e.target.value })}
              />
              <div className="flex flex-col items-center">
                <p>Discounted price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>

          <div className="flex gap-4">
            <input
              onChange={handleImageChange}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              disabled={uploading}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {imagesPreview.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {imagesPreview.map((image, idx) => (
                <img
                  key={idx}
                  src={image}
                  alt={`preview-${idx}`}
                  className="h-20 w-20 object-cover rounded"
                />
              ))}
            </div>
          )}
        
          <button
            type="submit"
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            disabled={uploading || imageUrls.length === 0}
          >
            Update Listing
          </button>
        </div>
      </form>
    </main>
  );
}
