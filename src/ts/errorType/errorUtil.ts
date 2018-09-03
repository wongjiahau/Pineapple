import { AtomicToken, TokenLocation, TypeExpression } from "../ast";
import { flattenLinkedNode } from "../getIntermediateForm";

export interface ErrorDetail  {
    code: string;
    name: string;
    message: string;
    relatedLocation: TokenLocation;
    hint?: string;
}

export function stringifyTypeReadable(t: TypeExpression): string {
    switch (t.kind) {
        case "UnresolvedType":
            return `${t.name.repr}`;
        case "VoidType":
            return "`Void`";
        case "GenericTypename":
            return `${t.name.repr}`;
        case "StructDeclaration":
            return `${t.name.repr}{${flattenLinkedNode(t.genericList).map((x) => stringifyTypeReadable(x)).join(",")}}`;
        case "EnumDeclaration":
            return `${t.name.repr}`;
    }
}

export function displayFuncSignature(xs: AtomicToken[]): string {
    return xs.map((x) => x.repr).join(" ");
}

export function showSuggestion(suggestions: string[]): string {
    if (suggestions.length === 0) {
        return "";
    } else if (suggestions.length === 1) {
        return "" +
`
Do you mean ${suggestions[0]} ?`;
    } else {
        return "" +
`
Do you mean one of the following?

${suggestions.map((x) => "    " + x).join("\n")}`;
    }
}
