import { AtomicToken, GenericList, TypeExpression } from "../ast";

export function stringifyGenericList(gs: GenericList): string {
    if (gs.length === 0) {
        return "";
    } else {
        return "{" + gs.map(stringifyTypeReadable).join(",") + "}";
    }
}

export function stringifyTypeReadable(t: TypeExpression | null): string {
    if (t === null)  {
        return `Void`;
    }
    switch (t.kind) {
        case "UnresolvedType":
        case "GenericTypename":
        case "EnumDeclaration":
        case "GroupDeclaration":
            return `${t.name.repr}`;
        case "BuiltinType":
            return `${t.name}${stringifyGenericList(t.genericList)}`;
        case "VoidType":
            return "`Void`";
        case "StructType":
            return `${t.reference.name.repr}${stringifyGenericList(t.genericList)}`;
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
