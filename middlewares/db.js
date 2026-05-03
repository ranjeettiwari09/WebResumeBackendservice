const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const { host, port, name } = mongoose.connection;
    console.log(
      `MongoDB Connected: ${host}:${port} (database: ${name})`,
    );
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
