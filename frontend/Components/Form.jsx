import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FaPencilAlt } from "react-icons/fa";
import axios from "axios";

const Form = () => {
  const notify = () => toast("Wow so easy!");
  const [formData, setFormData] = useState({
    username: "",
    currentPassword: "",
    newPassword: "",
    profession: "",
    companyName: "",
    addressLine1: "",
    country: "",
    state: "",
    city: "",
    plan: "",
    newsletter: true,
    profilePhoto: null,
  });
  const [apierror, setapiError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch countries
        const countryRes = await axios.get(
          "http://localhost:3000/api/country",
          {
            withCredentials: true,
          }
        );
        setCountries(countryRes.data);

        // Fetch user data
        const userRes = await axios.get(
          "http://localhost:3000/api/users/685f731d4027f73efe80c124",
          {
            withCredentials: true,
          }
        );
        setUserData(userRes.data);
        setFormData((prev) => ({
          ...prev,
          username: userRes.data.username || "",
          profession: userRes.data.profession || "",
          companyName: userRes.data.companyName || "",
          addressLine1: userRes.data.addressLine1 || "",
          country: userRes.data.country || "",
          state: userRes.data.state || "",
          city: userRes.data.city || "",
          plan: userRes.data.subscriptionPlan || "Basic",
          newsletter: userRes.data.newsletter ?? true,
          profilePhoto: userRes.data.profilePhoto
            ? userRes.data.profilePhoto
            : null,
        }));

        // Preload states and cities if country/state are present
        const selectedCountry = countryRes.data.find(
          (c) => c.country === userRes.data.country
        );
        if (selectedCountry) {
          setStates(selectedCountry.states || []);

          const selectedState = selectedCountry.states.find(
            (s) => s.state === userRes.data.state
          );
          if (selectedState) {
            setCities(selectedState.cities || []);
          }
        }
      } catch (err) {
        console.error(err);
        setapiError(err);
        toast.error("Failed to fetch countries or user data");
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setFormData((prev) => ({
      ...prev,
      country: selectedCountry,
      state: "",
      city: "",
    }));
    const countryObj = countries.find((c) => c.country === selectedCountry);
    setStates(countryObj?.states || []);
    setCities([]);
  };

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setFormData((prev) => ({
      ...prev,
      state: selectedState,
      city: "",
    }));
    const stateObj = states.find((s) => s.state === selectedState);
    setCities(stateObj?.cities || []);
  };

  const handleCityChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      city: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG or PNG files are allowed");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;

      setFormData((prev) => ({
        ...prev,
        profilePhoto: base64Image,
      }));
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Profile Photo
    if (!formData.profilePhoto) {
      toast.error("Profile photo is required");
      return;
    }

    // 2. Username
    if (
      !formData.username ||
      formData.username.length < 4 ||
      formData.username.length > 20 ||
      /\s/.test(formData.username)
    ) {
      toast.error("Username must be 4-20 characters and contain no spaces");
      return;
    }

    // 3 & 4. Passwords
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        toast.error("Current password is required to change password");
        return;
      }

      const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(formData.newPassword)) {
        toast.error(
          "New password must be at least 8 characters long and include 1 special character and 1 number"
        );
        return;
      }
    }

    // 5. Profession
    if (!formData.profession) {
      toast.error("Please select a profession");
      return;
    }

    // 6. Company Name
    if (formData.profession === "Entrepreneur" && !formData.companyName) {
      toast.error("Company name is required for entrepreneurs");
      return;
    }

    // 7. Address Line 1
    if (!formData.addressLine1) {
      toast.error("Address is required");
      return;
    }

    // 8–10: Country, State, City
    if (!formData.country) {
      toast.error("Please select a country");
      return;
    }

    if (!formData.state) {
      toast.error("Please select a state");
      return;
    }

    if (!formData.city) {
      toast.error("Please select a city");
      return;
    }

    // 11. Subscription Plan (always has default)
    if (!formData.plan) {
      toast.error("Please select a subscription plan");
      return;
    }

    // 12. Newsletter (optional — default checked)

    // ✅ If all valid, submit
    try {
      const submitData = new FormData();
      for (const key in formData) {
        if (key === "profilePhoto") {
          submitData.append("profilePhoto", formData.profilePhoto);
        } else {
          submitData.append(key, formData[key]);
        }
      }

      await axios.put(
        "http://localhost:3000/api/users/685f731d4027f73efe80c124",
        { ...formData },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, 
        }
      );

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Error updating profile");
      console.error(error);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container">
      <h1>Update Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="profilepic">
          <div className="avatar-wrapper">
            <img
              src={formData.profilePhoto || "./public/avatar.jpg"}
              alt="Avatar"
              className="avatar"
            />
            <label htmlFor="profilepic" className="edit-icon">
              <FaPencilAlt />
            </label>
            <input
              type="file"
              id="profilepic"
              name="profilePhoto"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>

        <div className="forminput">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            className="name"
            name="username"
            placeholder="Enter your name"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="forminput">
          <label htmlFor="currentPassword">Current Password:</label>
          <input
            type="password"
            className="name"
            name="currentPassword"
            placeholder="Enter your Current Password"
            value={formData.currentPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="forminput">
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            className="name"
            name="newPassword"
            placeholder="Enter your New Password"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="forminput">
          <label htmlFor="profession">Profession:</label>
          <select
            id="profession"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
          >
            <option value="">Select a profession</option>
            <option value="Student">Student</option>
            <option value="Developer">Developer</option>
            <option value="Entrepreneur">Entrepreneur</option>
          </select>
        </div>
        {formData.profession === "Entrepreneur" && (
          <div className="forminput">
            <label htmlFor="companyName">Company Name:</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              placeholder="Enter your company name"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className="forminput">
          <label htmlFor="addressLine1">Address Line 1:</label>
          <input
            type="text"
            name="addressLine1"
            placeholder="Enter your Address"
            value={formData.addressLine1}
            onChange={handleChange}
            required
          />
        </div>
        <div className="forminput">
          <select
            name="country"
            value={formData.country}
            onChange={handleCountryChange}
          >
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c._id} value={c.country}>
                {c.country}
              </option>
            ))}
          </select>
          <select
            name="state"
            value={formData.state}
            onChange={handleStateChange}
            disabled={!formData.country}
          >
            <option value="">Select State</option>
            {states.map((s, index) => (
              <option key={index} value={s.state}>
                {s.state}
              </option>
            ))}
          </select>
          <select
            name="city"
            value={formData.city}
            onChange={handleCityChange}
            disabled={!formData.state}
          >
            <option value="">Select City</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <div className="forminput">
          <h3>Subscription Plan</h3>
          <label>
            <input
              type="radio"
              name="plan"
              value="Basic"
              checked={formData.plan === "Basic"}
              onChange={handleChange}
            />
            Basic
          </label>
          <label>
            <input
              type="radio"
              name="plan"
              value="Pro"
              checked={formData.plan === "Pro"}
              onChange={handleChange}
            />
            Pro
          </label>
          <label>
            <input
              type="radio"
              name="plan"
              value="Enterprise"
              checked={formData.plan === "Enterprise"}
              onChange={handleChange}
            />
            Enterprise
          </label>
        </div>
        <div className="forminput">
          <label htmlFor="newsletter">Newsletter</label>
          <input
            type="checkbox"
            name="newsletter"
            id="newsletter"
            checked={formData.newsletter}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="button-28">Update Profile</button>
      </form>
      </div>
    </>
  );
};

export default Form;
