import { AtomicToken, InstantiatedTypeParams, TypeExpression } from "../ast";
import { stringifyThingName } from "../fillUpTypeInformation";

export function stringifyGenericList(gs: InstantiatedTypeParams): string {
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
        case "GenTypeParam":
        case "EnumDeclaration":
        case "GroupDeclaration":
            return `${t.name.repr}`;
        case "BuiltinType":
            return `${t.name}${stringifyGenericList(t.typeParams)}`;
        case "VoidType":
            return "`Void`";
        case "ThingType":
            return t.typeParams[0] + stringifyThingName(t.reference.name);
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
