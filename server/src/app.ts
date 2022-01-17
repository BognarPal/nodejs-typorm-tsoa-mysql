// external modules
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import { RegisterRoutes } from "./routes/routes";
import { createOrmConnection } from "./ormConnection";
import * as swaggerJson from './routes/swagger.json';
import * as swaggerUI from 'swagger-ui-express';
import { OperationError } from "./common/operation-error";

dotenv.config();

// App Variables
if (!process.env.PORT) {
    process.exit(1);
}
const port: number = parseInt(process.env.PORT as string, 10);
createOrmConnection();

const app = express();

//App Configuration
app.use(express.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(bodyParser.json());
if (process.env.NODE_ENV === 'development') {
    app.use(cors());
}

if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}

RegisterRoutes(app);
app.use(['/openapi', '/docs', '/swagger'], swaggerUI.serve, swaggerUI.setup(swaggerJson));

OperationError.addErrorHandler(app);

//Server Activation
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});