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
        case "SimpleType":
            return `${t.name.repr}`;
        case "VoidType":
            return "`Void`";
        case "GenericType":
            return `${t.placeholder.repr}`;
        case "StructDeclaration":
            return `${t.name.repr}{${flattenLinkedNode(t.templates).map((x) => stringifyTypeReadable(x)).join(",")}}`;
        case "EnumDeclaration":
            return `${t.name.repr}`;
    }
}

export function displayFuncSignature(xs: AtomicToken[]): string {
    return xs.map((x) => x.repr).join(" ");
}
