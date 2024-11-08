import React, { useState, useEffect } from "react";
import axios from "axios";
import "./stylesheets/Profile.css";

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    mobile: "",
    comment: "",
    image: null,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("email");
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          `process.env.REACT_APP_BASEURL/api/users/profile/${email}`
        );
        setProfileData(response.data);
        setFormData({ ...response.data, image: null });
      } catch (error) {
        setError("Error fetching profile data.");
        console.error("Fetch Error:", error);
      }
    };
    fetchProfileData();
  }, []);

  const handleEditClick = () => setIsEditMode(true);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === "file" ? e.target.files[0] : value;
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const response = await axios.post(
        "process.env.REACT_APP_BASEURL/api/users/profile",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSuccess(response.data.message || "Profile updated successfully.");
      setProfileData({ ...formData, image: response.data.imageUrl });
      setIsEditMode(false);
    } catch (error) {
      console.error("Submit Error:", error);
      setError(
        error.response
          ? error.response.data.message
          : "An error occurred while saving."
      );
    }
  };

  return (
    <div className="main-profile">
      <div className="profile-head">Your Profile</div>

      {profileData && !isEditMode ? (
        <div id="profile-display">
          <p className="edit-sec">
            <strong>Profile photo: </strong>
            {profileData.image && (
              <img
                src={`process.env.REACT_APP_BASEURL/${profileData.image}`} // Full path to display uploaded image
                alt="Profile"
                style={{ width: "200px", marginTop: "10px" }}
              />
            )}
          </p>
          <p className="edit-sec">
            <strong>Username: </strong> {profileData.username}
          </p>
          <p className="edit-sec">
            <strong>Name: </strong> {profileData.name}
          </p>
          <p className="edit-sec">
            <strong>Mobile: </strong> {profileData.mobile}
          </p>
          <p className="edit-sec">
            <strong>Comment: </strong> {profileData.comment}
          </p>
          <button className="profile-btn" onClick={handleEditClick}>
            Edit
          </button>
        </div>
      ) : (
        <form className="profile-sec" onSubmit={handleSubmit}>
          <label className="edit-sec">
            <span className="input-name">Profile Photo:</span>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
            />
            {formData.image && (
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Preview"
                style={{ width: "200px", marginTop: "10px" }}
              />
            )}
          </label>
          <label className="edit-sec">
            <span className="input-name">Username:</span>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </label>
          <label className="edit-sec">
            <span className="input-name">Name:</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label className="edit-sec">
            <span className="input-name">Mobile:</span>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
              pattern="[0-9]{10}" // Validates 10-digit numbers
              title="Enter a 10-digit mobile number"
            />
          </label>
          <label className="edit-sec">
            <span className="input-name">Comment:</span>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
            />
          </label>

          {success && <p className="success-message">{success}</p>}
          {error && <p className="error-message">{error}</p>}

          <button className="profile-btn" type="submit">
            Save
          </button>
        </form>
      )}
    </div>
  );
}

export default Profile;
