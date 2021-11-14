import "dotenv/config";
import "reflect-metadata";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import router from "./routes";
import errorHandler from "./middleware/error-handler";
import logger from "./middleware/logger";
import createDBConnection from "./providers/database";

const { PORT } = process.env;

if (!PORT) {
    console.error("Exiting app due to missing PORT environment variable.");
    process.exit(1);
}

(async () => {
    try {
        await createDBConnection();
    } catch (error) {
        console.error(`An error occurred connecting to database: ${error}`);
    }
})();

const app = express();

app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use(logger);
app.use(router);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Listening at ${PORT}`);
});
