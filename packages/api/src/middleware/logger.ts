import expressWinston from "express-winston";
import { transports, format } from "winston";

export default expressWinston.logger({
    transports: [new transports.Console()],
    format: format.combine(format.colorize(), format.json()),
    expressFormat: true,
});
