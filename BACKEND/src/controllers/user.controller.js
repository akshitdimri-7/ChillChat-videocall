import { User } from "../models/user.model.js";
import { Meeting } from "../models/meeting.model.js";
import httpStatus from "http-status";
import bcrypt, { hash } from "bcrypt";
import crypto from "crypto";

// Login Route

const login = async (req, res) => {
  const { username, password } = req.body; // Extract username and password from request body

  // Check if both fields are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Please enter credentials." });
  }

  try {
    // Check if a user with this username exists in MongoDB
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "This user doesn't exists." });
    }

    // Compare input password with hashed password stored in database
    let isMatch = await bcrypt.compare(password, existingUser.password);

    // If password matches → generate a login token
    if (isMatch) {
      // Generate a secure random token (session token)
      let token = crypto.randomBytes(20).toString("hex");

      // Save this token to the user's record in the database
      existingUser.token = token;
      await existingUser.save();

      // Return success with token
      return res.status(httpStatus.OK).json({ token: token });
    }

    // If password does NOT match → return Unauthorized
    return res.status(401).json({ message: "Invalid username or password." });
  } catch (error) {
    // If something unexpected goes wrong
    return res.status(500).json({ message: "Something went bad." });
  }
};

// Register Route
const register = async (req, res) => {
  const { username, name, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(httpStatus.CONFLICT) // 409 is the correct status
        .json({ message: "User already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      name,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    // IMPORTANT: You must send a response body
    return res
      .status(httpStatus.CREATED)
      .json({ message: "User registered successfully." });
  } catch (error) {
    console.error(error);

    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getHistoryOfUser = async (req, res) => {
  const { token } = req.query;
  try {
    const user = await User.findOne({ token: token });
    const meetings = await Meeting.find({ user_id: user.username });
    res.json(meetings);
  } catch (error) {
    res.json({ message: `Something went bad ${error}` });
  }
};

const addToUserHistory = async (req, res) => {
  const { token, meeting_code } = req.body;

  try {
    const user = await User.findOne({ token: token });
    const newMeeting = new Meeting({
      user_id: user.username,
      meetingCode: meeting_code,
    });

    await newMeeting.save();

    res.status(httpStatus.CREATED).json({ message: "Added to history." });
  } catch (error) {
    res.json({ message: `Something went bad ${error}` });
  }
};

export { register, login, getHistoryOfUser, addToUserHistory };
