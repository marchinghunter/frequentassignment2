import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  profilePhoto: {
    type: String,
    default: null,
  },

  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
    maxlength: 20,
    validate: {
      validator: function (v) {
        return !/\s/.test(v);
      },
      message: "Username must not contain spaces",
    },
  },

  password: {
    type: String,
  },

  profession: {
    type: String,
    enum: ["Student", "Developer", "Entrepreneur"],
  },

  companyName: {
    type: String,
    default: null,
  },

  addressLine1: {
    type: String,
  },

  country: {
    type: String,
  },

  state: {
    type: String,
  },

  city: {
    type: String,
  },

  subscriptionPlan: {
    type: String,
    enum: ["Basic", "Pro", "Enterprise"],
  },

  newsletter: {
    type: Boolean,
    default: true,
  },
});
const User = mongoose.model("User", userSchema);

export default User;
