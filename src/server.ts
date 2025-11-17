import "dotenv/config";
import app from "./app.js";
import { logger } from "./middleware/logger.js";
import environment from "./config/env.js";
import { connectDB } from "./config/db.js";

const { port } = environment;

await connectDB();
app.listen(port, () => logger.info(`Server is running on port: ${port}`));
