import { ThingDecl } from "../ast";
import { ErrorDetail } from "./ErrorDetail";

export function ErrorStructRedeclare(structDecl: ThingDecl): ErrorDetail {
    return {
        code: "0009",
        name: "ErrorStructRedeclare",
        message: `${structDecl.name} is already defined`,
        relatedLocation: structDecl.location
    };
}
