# Frequent JD Interview Project

A full-stack web application built with React.js for the frontend and Express.js with MongoDB for the backend.

## 🌐 Live Links

- **Frontend (Vercel)**: [https://fjdfrontend.vercel.app/](https://fjdfrontend.vercel.app/)
- **Backend (Render)**: [https://fjdbackend.onrender.com/](https://fjdbackend.onrender.com/)

---

## 📁 Tech Stack

### 🔹 Frontend
Built using **React 19** and styled with modern icon and toast libraries.

#### Frontend Dependencies

```json
{
  "axios": "^1.10.0",
  "react": "^19.1.0",
  "react-dom": "^19.1.0",
  "react-icons": "^5.5.0",
  "react-toastify": "^11.0.5"
}
```
###🔹 Backend
Powered by Express 5, with MongoDB via Mongoose, cloud image support, and .env configuration.

Dependencies:
```{
  "body-parser": "^2.2.0",
  "cloudinary": "^2.7.0",
  "cors": "^2.8.5",
  "dotenv": "^16.6.0",
  "express": "^5.1.0",
  "mongoose": "^8.16.1"
}
```
4. Environment Variables
Create a .env file inside the /backend folder with the following keys:

### env file
```
PORT=5000
Fronend= Fronend url
MONGO_URI=your_mongodb_connection_string
coudinary_name=your_cloud_name
coudinary_api=your_api_key
coudinary_api_secret=your_api_secret
```
