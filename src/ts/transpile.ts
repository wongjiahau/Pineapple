/**
 * This file is to transpile Pineapple code to Javascript code
 */
import {
    AssignmentStatement,
    AtomicToken,
    BooleanExpression,
    BranchStatement,
    CurriedMonoFunc,
    CurriedOperatorFunc,
    Declaration,
    Expression,
    ForStatement,
    FunctionCall,
    FunctionDeclaration,
    ImportDeclaration,
    JavascriptCode,
    KeyValue,
    LinkedNode,
    ListAccess,
    ListExpression,
    NumberExpression,
    ObjectExpression,
    ReturnStatement,
    Statement,
    StringExpression,
    StructDeclaration,
    TestExpression,
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
    }
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
    } else if (/[a-z][a-zA-Z]*[:]/.test(funcSignature)) {
        return funcSignature.slice(0, -1);
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
        case "SimpleType":
            return t.name.repr;
        case "CompoundType" :
            // console.log(t);
            return t.name.repr + "Of" + flattenLinkedNode(t.of).map((x) => stringifyType(x)).join("$");
        case "FunctionType":
            return `Func$${t.inputType.map(stringifyType).join("$")}$${stringifyType(t.outputType)}`;
        case "GenericType":
            return `Generic$${t.placeholder.repr}`;
        case "StructDeclaration":
            return `Struct${t.name.repr}`;
    }
}

export function tpAssignmentStatement(a: AssignmentStatement): string {
    switch (a.variable.kind) {
        case "VariableDeclaration":
            if (a.isDeclaration) {
                return `const $${a.variable.variable.repr} = ${tpExpression(a.expression)}`;
            } else {
                throw new Error("a.isDeclaration should be true");
            }
        case "Variable":
            return `${a.variable.repr} = ${tpExpression(a.expression)}`;
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
        case "ObjectExpression":                 return tpPonExpression(e);
        case "List":               return tpArrayExpression(e);
        case "Boolean":             return tpBooleanExpression(e);
        case "ListAccess":         return tpArrayAccess(e);
        case "CurriedMonoFunc":     return tpCurriedMonoFunc(e);
        case "CurriedOperatorFunc": return tpCurriedOperatorFunc(e);
    }
}

export function tpCurriedOperatorFunc(e: CurriedOperatorFunc): string {
    const signature = stringifyFuncSignature(e.signature);
    if (!e.leftOperand && e.rightOperand) {
        return `(($$0) => ${signature}($$0, ${tpExpression(e.rightOperand)}))`;
    } else if (e.leftOperand && !e.rightOperand) {
        return `(($$0) => ${signature}(${tpExpression(e.leftOperand)}, $$0))`;
    } else if (e.leftOperand === null && e.rightOperand === null) {
        return `(($$0,$$1) => ${signature}($$0,$$1))`;
    } else {
        throw new Error("LeftOperatnd and RightOperand can't be not null together");
    }
}

export function tpCurriedMonoFunc(e: CurriedMonoFunc): string {
    return `(($$0) => ${stringifyFuncSignature(e.signature)}($$0))`;
}

export function tpArrayAccess(a: ListAccess): string {
    return `${tpExpression(a.subject)}[${tpExpression(a.index)}]`;
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

export function tpBooleanExpression(e: BooleanExpression): string {
    return e.repr;
}

export function tpArrayExpression(e: ListExpression): string {
    if (e.elements !== null) {
        return `[${tpListElements(e.elements)}]`;
    } else {
        return `[]`;
    }
    // The following code is pending
    // Because is it necessary to have the typename included?
    // For example, new ArrayOfNumber([1,2,3])
    // Is that necessary?
    const typename = stringifyType(e.returnType);
    const elements = e.elements;
    if (elements !== null) {
        return `(new ${typename}([${tpListElements(elements)}]))`;
    } else {
        return `(new ${typename}([]))`;
    }
}

export function tpListElements(e: LinkedNode<Expression>): string {
    return flattenLinkedNode(e).map((x) => tpExpression(x)).join(",");
}

export function tpPonExpression(e: ObjectExpression): string {
    return `{
${tpKeyValueList(e.keyValueList)}
}`;
}

export function tpKeyValueList(e: LinkedNode<KeyValue>): string {
    return e.current.memberName.repr.slice(1)
        + " : "
        + tpExpression(e.current.expression)
        + (e.next ? ",\n" + tpKeyValueList(e.next) : "")
        ;
}

export function removeLastComma(s: string): string {
    return s[s.length - 1] === ",\n" ? s.slice(0, -1) : s ;
}
