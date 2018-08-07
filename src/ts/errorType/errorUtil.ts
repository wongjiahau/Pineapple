import chalk from "chalk";
import { AtomicToken, TokenLocation, TypeExpression } from "../ast";
import { flattenLinkedNode } from "../getIntermediateForm";
import { SourceCode } from "../interpreter";
import { labelLineNumbers } from "../labelLineNumbers";
const boxen = require("boxen");

export interface ErrorDetail  {
    code: string;
    name: string;
    message: string;
    relatedLocation: TokenLocation;
    hint?: string;
}

export function renderError(
    sourceCode: SourceCode,
    errorDetail: ErrorDetail,
): string {
    const errorMessageStyle = {borderStyle: "double", padding: 1, borderColor: "red"};
    const sourceCodeStyle = {padding: 1, borderColor: "grey"};
    const hintStyle = {padding: 1, borderColor: "cyan"};

    let result = "\n";
    result += boxen(chalk.bold("ERROR: ") + errorDetail.message, errorMessageStyle) + "\n";
    result += boxen(
        labelLineNumbers(
            sourceCode.content,
            errorDetail.relatedLocation,
            3
        ),
        sourceCodeStyle
    );
    if (errorDetail.hint) {
        result += "\n" + boxen(chalk.bold("HINT:") + "\n\n" + errorDetail.hint, hintStyle);
    }
    // tslint:disable-next-line:max-line-length
    result += `\nThe error is located at ${chalk.underline(sourceCode.filename)} at line ${errorDetail.relatedLocation.first_line}.`;

    return result
        .split("\n")
        .map((x) => "  " + x)
        .join("\n") + "\n";

}

export function stringifyTypeReadable(t: TypeExpression): string {
    switch (t.kind) {
        case "CompoundType":
            return `${t.name.repr}{${flattenLinkedNode(t.of).map(stringifyTypeReadable).join(",")}}`;
        case "SimpleType":
            return `${t.name.repr}`;
        case "VoidType":
            return "`Void`";
        case "GenericType":
            return `${t.placeholder.repr}`;
    }
}

export function displayFuncSignature(xs: AtomicToken[]): string {
    return xs.map((x) => x.repr).join(" ");
}
