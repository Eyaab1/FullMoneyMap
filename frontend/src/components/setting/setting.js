import React, { useEffect, useState } from "react";
import axios from "axios";
import "./setting.css";
import adminPhoto from "../../admin.png";

const SettingsProfile = () => {
  const [formData, setFormData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch user data from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setFormData({
        id: user.id,
        firstName: user.nom || "",
        lastName: user.prenom || "",
        email: user.email || "",
        role: user.role || "User",
      });
    }
    setLoading(false);
  }, []);

  // Handle input changes for profile
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle input changes for password
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle profile form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing) return;

    try {
      const updatedData = {
        nom: formData.firstName,
        prenom: formData.lastName,
        email: formData.email,
        role: formData.role,
      };

      await axios.put(
        `http://localhost:5000/api/utilisateurs/update/${formData.id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: formData.id,
          nom: updatedData.nom,
          prenom: updatedData.prenom,
          email: updatedData.email,
          role: formData.role,
        })
      );

      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err.response?.data || err.message);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:5000/api/utilisateurs/change-password`,
        {
          email: formData.email,
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
          confirmNewPassword: passwordData.confirmNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Password changed successfully!");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setIsChangingPassword(false);
    } catch (err) {
      console.error("Error changing password:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to change password. Please try again.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="settings-profile-container">
      {/* Profile Picture Section */}
      <div className="profile-pic-section">
        <img src={adminPhoto} alt="Profile" className="profile-pic" />
        <p className="profile-name">{formData.role}</p>
      </div>

      {/* Account Settings Form */}
      <div className="settings-profile-form">
  <h2 className="headerr">Account Settings</h2>
  <form onSubmit={handleSubmit}>
    <div className="form-group">
      <label htmlFor="first-name">First Name</label>
      <input
        type="text"
        id="first-name"
        name="firstName"
        value={formData.firstName}
        onChange={handleInputChange}
        disabled={!isEditing}
        placeholder="Enter your first name"
      />
    </div>
    <div className="form-group">
      <label htmlFor="last-name">Last Name</label>
      <input
        type="text"
        id="last-name"
        name="lastName"
        value={formData.lastName}
        onChange={handleInputChange}
        disabled={!isEditing}
        placeholder="Enter your last name"
      />
    </div>
    <div className="form-group">
      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        disabled={!isEditing}
        placeholder="Enter your email"
      />
    </div>
    {isEditing && (
      <button type="submit" className="save-button">
        Save Changes
      </button>
    )}
  </form>

  {/* Edit Profile Button Outside the Form */}
  {!isEditing && (
    <button
      type="button"
      className="save-button"
      onClick={() => setIsEditing(true)}
    >
      Edit Profile
    </button>
  )}
</div>

      {/* Change Password Section */}
      <div className="change-password-section">
        <h3 className="headerr">Change Password</h3>
        {isChangingPassword ? (
          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label htmlFor="old-password">Old Password</label>
              <input
                type="password"
                id="old-password"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                placeholder="Enter old password"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="new-password">New Password</label>
              <input
                type="password"
                id="new-password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirm-new-password">Confirm New Password</label>
              <input
                type="password"
                id="confirm-new-password"
                name="confirmNewPassword"
                value={passwordData.confirmNewPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                required
              />
            </div>
            <button type="submit" className="save-button">
              Save Password
            </button>
          </form>
        ) : (
          <button
            type="button"
            className="save-button"
            onClick={() => setIsChangingPassword(true)}
          >
            Change Password
          </button>
        )}
      </div>
    </div>
  );
};

export default SettingsProfile;
