/**
 * This file is to transpile Pineapple code to Javascript code
 */
import {
    AssignmentStatement,
    AtomicToken,
    BranchStatement,
    Declaration,
    EnumDeclaration,
    EnumExpression,
    Expression,
    ForStatement,
    FunctionCall,
    FunctionDeclaration,
    ImportDeclaration,
    JavascriptCode,
    KeyValue,
    LinkedNode,
    ListExpression,
    NumberExpression,
    ObjectAccess,
    ObjectExpression,
    ReturnStatement,
    Statement,
    StringExpression,
    StructDeclaration,
    TestExpression,
    TupleExpression,
    TypeExpression,
    VariableDeclaration,
    WhileStatement
} from "./ast";
import { flattenLinkedNode } from "./getIntermediateForm";

// Note: tp means transpile
// Example: tpDeclaration means transpileDeclaration
export function transpile(decls: Declaration[]): string {
    return decls.map((x) => tpDeclaration(x)).join("");
}

export function tpDeclaration(input: Declaration): string {
    if (!input) {
        return "";
    }
    switch (input.kind) {
        case "FunctionDeclaration":
            return tpFunctionDeclaration(input);
        case "ImportDeclaration":
            return tpImportDeclaration(input);
        case "StructDeclaration":
            return tpStructDeclaration(input);
        case "EnumDeclaration":
            return tpEnumDeclaration(input);
    }
}

export function tpEnumDeclaration(e: EnumDeclaration): string {
    return `
/**
 * enum ${e.name.repr} = ${flattenLinkedNode(e.enums).map((x) => (x.repr)).join(",")}
*/
    `;
}

export function tpStructDeclaration(s: StructDeclaration): string {
    return `
    /*struct ${s.name.repr} {
        ${flattenLinkedNode(s.members).map((x) => `${x.name.repr}:${stringifyType(x.expectedType)}`)}
    }*/`.trim();
}

export function tpImportDeclaration(i: ImportDeclaration): string {
    return `//import ${i.filename.repr}`;
}

export function tpFunctionDeclaration(f: FunctionDeclaration): string {
    const funcSignature = stringifyFuncSignature(f.signature);
    const typeSignature = f.parameters.map((x) => stringifyType(x.typeExpected)).join("_");
    const params = tpParameters(f.parameters);
    const statements = tpStatement(f.statements);
    return `function ${funcSignature}_${typeSignature}(${params}){\n${statements};\n}\n\n`;
}

export function tpStatement(s: LinkedNode<Statement>): string {
    const next = s.next　? ";\n" + tpStatement(s.next) : "";
    switch (s.current.kind) {
        case "FunctionCall":        return tpFunctionCall(s.current)           + next;
        case "AssignmentStatement": return tpAssignmentStatement(s.current)    + next;
        case "JavascriptCode":      return tpJavascriptCode(s.current)         + next;
        case "ReturnStatement":     return tpReturnStatement(s.current)        + next;
        case "BranchStatement":     return tpBranchStatement(s.current)        + next;
        case "ForStatement":        return tpForStatement(s.current)           + next;
        case "WhileStatement":      return tpWhileStatement(s.current)         + next;
        case "PassStatement":       return "$$pass$$()";
    }
}

export function tpWhileStatement(w: WhileStatement): string {
    return "" +
`while(${tpTestExpression(w.test)}){
    ${tpStatement(w.body)}
}
`;
}

export function tpForStatement(f: ForStatement): string {
    const itemsName = `itemsOf${f.iterator.repr}`;
    return "" +
`
const ${itemsName} = ${tpExpression(f.expression)};
for(let i = 0; i < ${itemsName}.length; i++){
    const $${f.iterator.repr} = ${itemsName}[i];
    ${tpStatement(f.body)}
}`;
}

export function tpBranchStatement(b: BranchStatement): string {
    if (b.test === null) {
        return `{
${tpStatement(b.body)}
}`;
    } else {
        return `if(${tpTestExpression(b.test)}){
${tpStatement(b.body)}
}${b.elseBranch ? `else ${tpBranchStatement(b.elseBranch)}` : "" }`;
    }
}

export function tpTestExpression(t: TestExpression): string {
    if (t === null) {
        return "";
    }
    return `${t.negated ? "!" : ""}`
        + `${tpFunctionCall(t.current)}`
        + `${t.chainOperator || ""}`
        + `${tpTestExpression(t.next)}`
        ;
}

export function tpReturnStatement(r: ReturnStatement): string {
    return `return ${tpExpression(r.expression)}`;
}

export function tpFunctionCall(f: FunctionCall): string {
    const funcSignature = stringifyFuncSignature(f.signature);
    const typeSignature = f.parameters.map((x) => stringifyType(x.returnType)).join("_");
    const params = f.parameters.map((x) => tpExpression(x));
    return `${funcSignature}_${typeSignature}(${params.join(",")})`;
}

export function stringifyFuncSignature(signature: AtomicToken[]): string {
    return "_" + signature.map((x) => getName(x.repr)).join("_");
}

export function getName(funcSignature: string): string {
    if (/[.][a-z][a-zA-Z]*/.test(funcSignature)) {
        return funcSignature.slice(1);
    } else if (/[a-z][a-zA-Z]/.test(funcSignature)) {
        return funcSignature;
    } else {
        return getOperatorName(funcSignature);
    }
}

export function getOperatorName(op: string): string {
    const dic: {[key: string]: string} = {
        "&"	 : "ampersand",      "'"	: "apostrophe",     "." : "period",
        "*"	 : "asterisk",       "@"	: "at",             "`"	: "backtick",
        "\\" : "backslash",      ":"	: "colon",          ","	: "comma",
        "$"	 : "dollar",         "="	: "equal",          "!"	: "bang",
        ">"	 : "greaterThan",    "<"	: "lessThan",       "-"	: "minus",
        "%"	 : "percent",        "|"	: "pipe",           "+"	: "plus",
        "#"	 : "hash",           ";"	: "semi",           "/"	: "slash",
        "~"	 : "tilde",          "_"	: "underscore",     "?"	: "questionMark",
        "^"  : "caret"
    };
    const result = "$" + op.split("").map((x) => dic[x]).join("$");
    return result;
}

export function stringifyType(t: TypeExpression): string {
    switch (t.kind) {
        case "UnresolvedType":
            return t.name.repr;
        case "GenericTypename":
            return `Generic$${t.name.repr}`;
        case "StructDeclaration":
            return `${t.name.repr}Of${flattenLinkedNode(t.genericList).map((x) => stringifyType(x)).join("$")}` ;
        case "VoidType":
            return `Void`;
        default:
            throw new Error(`Cant stringify ${t.kind} yet`);
    }
}

export function tpAssignmentStatement(a: AssignmentStatement): string {
    // TODO: check if the variable is required to be copied or not
    switch (a.variable.kind) {
        case "VariableDeclaration":
            if (a.isDeclaration) {
                return `${a.variable.isMutable ? "let" : "const"} ` +
                `$${a.variable.variable.repr} = ${tpExpression(a.expression)}`;
            } else {
                throw new Error("a.isDeclaration should be true");
            }
        case "Variable":
            return `$${a.variable.repr} = ${tpExpression(a.expression)}`;
    }
}

export function tpParameters(v: VariableDeclaration[]): string {
    return removeLastComma(v.map((x) => "$" + x.variable.repr).join(","));
}

export function tpExpression(e: Expression): string {
    switch (e.kind) {
        case "FunctionCall":        return tpFunctionCall(e);
        case "String":              return tpStringExpression(e);
        case "Number":              return tpNumberExpression(e);
        case "Variable":            return "$" + e.repr;
        case "ObjectExpression":    return tpObjectExpression(e);
        case "List":                return tpArrayExpression(e);
        case "ObjectAccess":        return tpObjectAccess(e);
        case "EnumExpression":      return tpEnumExpression(e);
        case "TupleExpression":     return tpTupleExpression(e);
        default:
            throw new Error(`Cannot handle ${e.kind} yet`);
    }
}

export function tpTupleExpression(t: TupleExpression): string {
    return `[${tpListElements(t.elements)}]`;
}

export function tpEnumExpression(e: EnumExpression): string {
    if (e.returnType.name.repr === "Nil") {
        return `null`;
    }
    if (["Boolean", "Nil", "Undefined"].indexOf(e.returnType.name.repr) > -1) {
        return `${e.value.repr.slice(1)}`;
    }
    return `{$kind: "_Enum${e.returnType.name.repr}", $value: "${e.value.repr.slice(1)}"}`;

}

export function tpObjectAccess(o: ObjectAccess): string {
    return `${tpExpression(o.subject)}.${o.key.repr.slice(1)}`;
}

export function tpJavascriptCode(s: JavascriptCode): string {
    return "" +
`// <javascript>
${s.repr.replace(/(<javascript>|<\/javascript>|@.+)/g, "").trim()}
// </javascript>`;
}
export function tpStringExpression(s: StringExpression): string {
    return `"${s.repr.slice(1, -1)}"`;
}

export function tpNumberExpression(e: NumberExpression): string {
    return `(${e.repr})`;
}

export function tpArrayExpression(e: ListExpression): string {
    if (e.elements !== null) {
        return `[${tpListElements(e.elements)}]`;
    } else {
        return `[]`;
    }
}

export function tpListElements(e: LinkedNode<Expression>): string {
    return flattenLinkedNode(e).map((x) => tpExpression(x)).join(",");
}

export function tpObjectExpression(e: ObjectExpression): string {
    return `{
${e.constructor !== null ? `$kind: "${e.constructor.repr}",` : ""}
${tpKeyValueList(e.keyValueList)}
}`;
}

export function tpKeyValueList(e: LinkedNode<KeyValue> | null): string {
    if (e === null) {
        return "";
    }
    return e.current.memberName.repr.slice(1)
        + " : "
        + tpExpression(e.current.expression)
        + (e.next ? ",\n" + tpKeyValueList(e.next) : "")
        ;
}

export function removeLastComma(s: string): string {
    return s[s.length - 1] === ",\n" ? s.slice(0, -1) : s ;
}
