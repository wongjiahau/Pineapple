import { AtomicToken, StructDeclaration } from "../ast";
import { StructTable } from "../fillUpTypeInformation";
import { findSimilarStrings } from "../util";
import { ErrorDetail } from "./errorUtil";

export function ErrorUsingUndefinedStruct(
    undefinedStruct: AtomicToken,
    structTab: StructTable
): ErrorDetail {
    const structs: StructDeclaration[] = Object.keys(structTab).map((x: string) => structTab[x]);
    const similarStructs = findSimilarStrings(undefinedStruct.repr, structs.map((x) => x.name.repr));
    return {
        code: "0012",
        name: "ErrorUsingUndefinedStruct",
        message:
    `You cannot use ${undefinedStruct.repr} as it does not exist

    Do you mean one of the following?

    ${similarStructs.map((x) => "    " + x).join("\n")}
    `,
    relatedLocation: undefinedStruct.location
};
}
