import "dotenv/config";
import mongoose from "mongoose";
import { hash } from "bcryptjs";
import connectDB from "../config/database";
import AdminUserMaster from "../Models/AdminUserMaster";

const getArg = (name: string): string | undefined => {
  const prefix = `--${name}=`;
  const arg = process.argv.find((value) => value.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : undefined;
};

export async function main() {
  const email = (process.env.ADMIN_EMAIL?.trim() || getArg("email") || "")
    .trim()
    .toLowerCase();

  const password = process.env.ADMIN_PASSWORD || getArg("password") || "";

  if (!email || !password) {
    throw new Error(
      "Missing admin credentials. Provide ADMIN_EMAIL and ADMIN_PASSWORD environment variables, or pass --email=... and --password=...",
    );
  }

  // await connectDB();

  const hashedPassword = await hash(password, 10);

  const updated = await AdminUserMaster.updateOne(
    { email },
    { $set: { password: hashedPassword, isDeleted: false } },
  );

  if (updated.matchedCount === 0) {
    await AdminUserMaster.create({
      email,
      password: hashedPassword,
      isDeleted: false,
    });
    console.log(`Created admin user: ${email}`);
  } else {
    console.log(`Updated admin credentials for: ${email}`);
  }
}

main()
  .catch((error) => {
    console.error(
      "Failed to insert admin credentials:",
      error instanceof Error ? error.message : error,
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });
