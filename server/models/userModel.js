//! Importing required modules
import mongoose from "mongoose"; // Mongoose is used to define schemas and interact with MongoDB.
import bcrypt from "bcrypt"; // Bcrypt is used for hashing passwords securely.

//! Defining the user schema
const userSchema = new mongoose.Schema({
  name: String, // User's name
  email: String, // User's email address
  password: {
    type: String, // User's password (hashed before saving)
    minLength: [8, "Password must have at least 8 characters."], // Minimum password length validation
    maxLength: [32, "Password cannot have more than 32 characters."], // Maximum password length validation
    select: false, // Ensures the password field is not returned in queries by default
  },
  phone: String, // User's phone number
  accountVerified: { type: Boolean, default: false }, // Indicates whether the user's account is verified
  verificationCode: Number, // Stores the verification code for account verification
  verificationCodeExpire: Date, // Expiration time for the verification code
  resetPasswordToken: String, // Token for resetting the password
  resetPasswordExpire: Date, // Expiration time for the reset password token
  createdAt: {
    type: Date, // Timestamp for when the user was created
    default: Date.now, // Defaults to the current date and time
  },
});

//! Pre-save middleware to hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    // If the password field is not modified, skip hashing
    next();
  }
  // Hash the password with a salt factor of 10
  this.password = await bcrypt.hash(this.password, 10);
});

//! Method to compare entered password with the hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  // Uses bcrypt to compare the entered password with the stored hashed password
  return await bcrypt.compare(enteredPassword, this.password);
};

//! Method to generate a random 5-digit verification code
userSchema.methods.generateVerificationCode = function () {
  // Helper function to generate a random 5-digit number
  function generateRandomFiveDigitNumber() {
    const firstDigit = Math.floor(Math.random() * 9) + 1; // Ensures the first digit is non-zero
    const remaninigDigits = Math.floor(Math.random() * 10000) // Generates the remaining 4 digits
      .toString()
      .padStart(4, 0); // Pads with leading zeros if necessary
    return parseInt(firstDigit + remaninigDigits); // Combines the digits into a single number
  }
  const verificationCode = generateRandomFiveDigitNumber(); // Generate the verification code
  this.verificationCode = verificationCode; // Store the code in the user document
  this.verificationCodeExpire = Date.now() + 5 * 60 * 1000; // Set expiration time (5 minutes, but incorrect calculation)
  return verificationCode; // Return the generated code
};

//! Exporting the User model
export const User = mongoose.model("User", userSchema); // Creates a Mongoose model named "User" based on the schema
