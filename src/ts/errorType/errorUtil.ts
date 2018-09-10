import { AtomicToken, GenericList, TokenLocation, TypeExpression } from "../ast";

export interface ErrorDetail  {
    code: string;
    name: string;
    message: string;
    relatedLocation: TokenLocation;
    hint?: string;
}

export function stringifyGenericList(gs: GenericList): string {
    return "{" + gs.map(stringifyTypeReadable).join(",") + "}";
}

export function stringifyTypeReadable(t: TypeExpression | null): string {
    if (t === null)  {
        return `Void`;
    }
    switch (t.kind) {
        case "BuiltinType":
            return `${t.name}${stringifyGenericList(t.genericList)}`;
        case "UnresolvedType":
            return `${t.name.repr}`;
        case "VoidType":
            return "`Void`";
        case "GenericTypename":
            return `${t.name.repr}`;
        case "StructType":
            return `${t.reference.name.repr}${stringifyGenericList(t.genericList)}`;
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
