import app from "./app";
import config from "./config";
import { initDB } from "./db";

const startServer = async () => {
  try {
    initDB()
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();