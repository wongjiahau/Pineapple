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
    ListExpression,
    NumberExpression,
    ObjectAccess,
    ObjectExpression,
    ReturnStatement,
    Statement,
    StringExpression,
    StringInterpolationExpression,
    StructDeclaration,
    TupleExpression,
    TypeExpression,
    VariableDeclaration,
    WhileStatement
} from "./ast";
import { prettyPrint } from "./pine2js";

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
 * enum ${e.name.repr} = ${e.enums.map((x) => (x.repr)).join(",")}
*/
    `;
}

export function tpStructDeclaration(s: StructDeclaration): string {
    return `
    /*struct ${s.name.repr} {
        ${s.members.map((x) => `${x.name.repr}:${stringifyType(x.expectedType)}`)}
    }*/`.trim();
}

export function tpImportDeclaration(i: ImportDeclaration): string {
    return `//import ${i.filename.repr}`;
}

export function tpFunctionDeclaration(f: FunctionDeclaration): string {
    const funcSignature = stringifyFuncSignature(f.signature);
    const typeSignature = f.parameters.map((x) => stringifyType(x.typeExpected)).join("_");
    const params = tpParameters(f.parameters);
    const statements = tpStatements(f.statements);
    return `${f.isAsync ? "async " : ""}function ${funcSignature}_${typeSignature}(${params}){\n${statements}}\n\n`;
}

export function tpStatements(statements: Statement[]): string {
    let result = "";
    for (let i = 0; i < statements.length; i++) {
        const s = statements[i];
        switch (s.kind) {
            case "FunctionCall":        result += tpFunctionCall(s) + ";" ; break;
            case "AssignmentStatement": result += tpAssignmentStatement(s); break;
            case "JavascriptCode":      result += tpJavascriptCode(s)     ; break;
            case "ReturnStatement":     result += tpReturnStatement(s)    ; break;
            case "BranchStatement":     result += tpBranchStatement(s)    ; break;
            case "ForStatement":        result += tpForStatement(s)       ; break;
            case "WhileStatement":      result += tpWhileStatement(s)     ; break;
            case "PassStatement":       result += "$$pass$$();";
        }
        result += "\n";
    }
    return result;
}

export function tpWhileStatement(w: WhileStatement): string {
    return "" +
`while(${tpExpression(w.test)}){
${tpStatements(w.body)}}`;
}

export function tpForStatement(f: ForStatement): string {
    const itemsName = `itemsOf${f.iterator.repr}`;
    return "" +
`const ${itemsName} = ${tpExpression(f.expression)};
for(let i = 0; i < ${itemsName}.length; i++){
const $${f.iterator.repr} = ${itemsName}[i];
${tpStatements(f.body)}}`;
}

export function tpBranchStatement(b: BranchStatement): string {
    if (b.test === null) {
        return `{
${tpStatements(b.body)}}`;
    } else {
        return `if(${tpExpression(b.test)}){
${tpStatements(b.body)}}${b.elseBranch ? `else ${tpBranchStatement(b.elseBranch)}` : "" }`;
    }
}

export function tpReturnStatement(r: ReturnStatement): string {
    return `return ${tpExpression(r.expression)};`;
}

export function tpFunctionCall(f: FunctionCall): string {
    const funcSignature = stringifyFuncSignature(f.signature);
    const typeSignature = f.parameters.map((x) => stringifyType(x.returnType)).join("_");
    const params = f.parameters.map((x) => tpExpression(x));
    const result = `${f.isAsync ? "await " : ""}${funcSignature}_${typeSignature}(${params.join(",")})`;
    if (f.isAsync) {
        return "(" + result + ")";
    } else {
        return result;
    }
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
        case "BuiltinType":
        case "StructType":
            const genericsName = t.genericList.map((x) => stringifyType(x)).join("$");
            const typename = t.kind === "BuiltinType" ? t.name : t.reference.name.repr;
            return `${typename}${genericsName.length > 0 ? "Of" + genericsName : ""}` ;
        case "VoidType":
            return `Void`;
        case "EnumDeclaration":
            return t.name.repr;
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
                `$${a.variable.variable.repr} = ${tpExpression(a.expression)};`;
            } else {
                throw new Error("a.isDeclaration should be true");
            }
        case "Variable":
            return `$${a.variable.repr} = ${tpExpression(a.expression)};`;
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
        case "StringInterpolationExpression": return tpStringInterpolationExpression(e); default:
            throw new Error(`Cannot handle ${e.kind} yet`);
    }
}

export function tpStringInterpolationExpression(s: StringInterpolationExpression): string {
    return s.expressions.map(tpExpression).join(" + ");
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
    if (s.repr[0] !== '"' || s.repr[s.repr.length - 1] !== '"') {
        throw new Error(`String repr should be enclosed by quotes, but it was ${s.repr}`);
    }
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

export function tpListElements(e: Expression[]): string {
    return e.map((x) => tpExpression(x)).join(",");
}

export function tpObjectExpression(e: ObjectExpression): string {
    if (e.keyValueList === null) {
        return "{}";
    }
    return `{
${e.constructor !== null ? `$kind: "${stringifyType(e.constructor)}",` : ""}
${tpKeyValueList(e.keyValueList)}
}`;
}

export function tpKeyValueList(kvs: KeyValue[]): string {
    let result = "";
    for (let i = 0; i < kvs.length; i++) {
        const current = kvs[i];
        result += current.memberName.repr.slice(1)
        + " : "
        + tpExpression(current.expression)
        + ","
        ;
        if (i < kvs.length - 1) {
            result += "\n";
        }
    }
    return result;
}

export function removeLastComma(s: string): string {
    return s[s.length - 1] === ",\n" ? s.slice(0, -1) : s ;
}
