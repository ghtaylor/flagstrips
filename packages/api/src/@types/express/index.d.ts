import { Flag, Strip, StripImageOption, User } from "@flagstrips/common";

declare global {
    namespace Express {
        interface Request {
            authenticatedUser?: User;
            flag?: Flag;
            strip?: Strip;
            stripImageOption?: StripImageOption;
        }
    }
}
