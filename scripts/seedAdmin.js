import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/user.models.js";
import { SocietyDetail } from "../models/societyDetail.models.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    // await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const societyId = "SOC123";
    const adminPass = "ADMIN@123";

    // 1️⃣ Check if society exists
    let society = await SocietyDetail.findOne({ societyId });

    if (!society) {
      society = await SocietyDetail.create({
        societyId,
        name: "Green Society",
        adminPasssocietyId: "SOC123",
  societyName: "Green Society",
  societyAddress: "Mumbai",
  adminPass: "ADMIN@123",
  securityPass: "SECURITY@123"
      });
      console.log("✅ Society created");
    } else {
      console.log("⚠️ Society already exists");
    }

    // 2️⃣ Check if admin exists
    const existingAdmin = await User.findOne({
      email: "admin@test.com"
    });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists");
      process.exit();
    }

    // 3️⃣ Create admin user
    const admin = await User.create({
      name: "Main Admin",
      email: "admin@test.com",
      password: "Admin@123",
      role: "admin",
      societyId,
      block: "A",
      houseNo: "101",
      phoneNo: "9999999999"
      // ❌ rolePass save mat kar
    });

    console.log("🔥 Admin created successfully");
    console.log("Email:", admin.email);
    console.log("Password: 123456");

    process.exit();

  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

seedAdmin();

