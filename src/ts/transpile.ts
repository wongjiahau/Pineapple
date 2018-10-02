/**
 * This file is to transpile Pineapple code to Javascript code
 */
import {
    AssignmentStatement,
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
    WhileStatement,
    EnsureStatement,
    PassStatement,
    ExampleDeclaration,
    ExampleStatement,
    GroupDeclaration,
} from "./ast";
import { ErrorTrace, InterpreterOptions } from "./interpret";

let GENERATE_SOURCE_MAP = false;

// Note: tp means transpile
// Example: tpDeclaration means transpileDeclaration
export function transpile(decls: Declaration[], options: InterpreterOptions): string {
    GENERATE_SOURCE_MAP = options.generateSourceMap;
    let result = ""; 

    // Initialize GroupDeclarations
    const groupDecls = decls.filter((x) => x.kind === "GroupDeclaration") as GroupDeclaration[];
    result += groupDecls.map(tpGroupDeclaration).join("\n") + "\n";

    result += decls.map((x) => tpDeclaration(x)).filter((x) => x != "").join("\n");
    return result; 
}


export function tpDeclaration(input: Declaration): string {
    if (!input) {
        return "";
    }
    switch (input.kind) {
        case "ImportDeclaration":
        case "StructDeclaration":
        case "EnumDeclaration":
        case "GroupBindingDeclaration":
            // No need to be transpiled
            // As they are only needed for static analysis
            return "";
        case "GroupDeclaration":
            // NOTE: GroupDeclaration is handled at top level
            return "";
        case "FunctionDeclaration":
            return tpFunctionDeclaration(input);
        case "ExampleDeclaration":
            return tpExampleDeclaration(input);
    }
}

export function tpGroupDeclaration(g: GroupDeclaration) {
    const x = g.name.repr;
    let result =  `$$GROUP$$["${x}"] = {};\n`;
    for (let i = 0; i < g.bindingFunctions.length; i++) {
        result += `$$GROUP$$["${x}"]["${stringifyType(g.bindingFunctions[i].parameters[0].typeExpected)}"]=(${getFullFunctionName(g.bindingFunctions[i])})\n`;
    }
    return result;
}

export function tpExampleDeclaration(e: ExampleDeclaration): string {
    return `$$examples$$.push(function(){${tpStatements(e.statements)}});`;
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
    const funcSignature = getFullFunctionName(f);
    const params = tpParameters(f.parameters);
    const statements = tpStatements(f.statements);
    let result = `${f.isAsync ? "async " : ""}function ${funcSignature}(${params}){`;

    if(f.groupBinding) {
        if(f.groupBinding.typeBinded.kind !== "GroupDeclaration") {
            throw new Error(`Should be group declaration type but got ${f.groupBinding.typeBinded.kind}`);
        }
        result += `\nreturn $$GROUP$$["${f.groupBinding.typeBinded.name.repr}"][$$typeof$$($${f.parameters[0].variable.repr})](${params})`;
    }
    result += `\n${statements}}\n`;
    return result;
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
            case "PassStatement":       result += tpPassStatement(s);     ; break;
            case "EnsureStatement":     result += tpEnsureStatement(s)    ; break;
            case "ExampleStatement":    result += tpExampleStatement(s)   ; break;
            default: throw new Error(`Cannot handle ${s.kind} yet`)
        }
        result += "\n";
    }
    return result;
}

export function tpExampleStatement(e: ExampleStatement): string {
    const originFile = JSON.stringify(e.originFile);
    const location = JSON.stringify(e.location);
    /**
     * $$handleExample$$ is defined in executeCode.ts
     */
    return `$$handleExample$$(${tpExpression(e.left)},${tpExpression(e.right)},${originFile},${location});`; 

}

export function tpPassStatement(p: PassStatement): string {
    return `$$pass$$();${GENERATE_SOURCE_MAP ? generateSourceMap({
        ...p.location,
        callingFile: p.callingFile,
        lineContent: "",
        insideWhichFunction: ""
    }): ""}`;
}

export function tpEnsureStatement(a: EnsureStatement): string {
    return `$$ensure$$(${GENERATE_SOURCE_MAP ? 
        generateSourceMap({
            ...a.location, 
            callingFile: a.callingFile, 
            lineContent: "",
            insideWhichFunction: ""
        }) + "\n" : ""}${tpExpression(a.expression)}) ` }

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
    const funcSignature = getFullFunctionName(f);
    const params = f.parameters.map((x) => tpExpression(x));
    let result = `${f.isAsync ? "await " : ""}${funcSignature}(` + 
                 `${GENERATE_SOURCE_MAP ? generateSourceMap({
                     ...f.location, 
                     callingFile: f.callingFile, 
                     lineContent: "", 
                     insideWhichFunction: ""
                }): ""}` +
                 `\n${params.join("\n,")})`;
    if (f.isAsync) {
        return "(" + result + ")";
    } else {
        return result;
    }
}

export function generateSourceMap(x: ErrorTrace): string {
    return `/*##${JSON.stringify(x)}##*/`;
}

// Full means type signature is included
export function getFullFunctionName(f: FunctionCall | FunctionDeclaration): string {
    const typeSignature = (function() {
        if(f.kind === "FunctionCall") {
            return f.parameters.map((x) => stringifyType(x.returnType)).join("_");
        } else {
            return f.parameters.map((x) => stringifyType(x.typeExpected)).join("_");
        }
    })();
    return "_" + getPartialFunctionName(f) + "_" + typeSignature;
}

// Partial means type signature is not includeed
export function getPartialFunctionName(f: FunctionCall | FunctionDeclaration): string {
    return f.signature.map((x) => getName(x.repr)).join("$");
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
        case "GroupDeclaration":
            return t.name.repr;
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
    if (e.keyValueList.length === 0) {
        return "{}";
    }
    return `{${e.constructor !== null ? `\n$kind: "${stringifyType(e.constructor)}",` : ""}
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
