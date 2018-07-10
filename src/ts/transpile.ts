/**
 * This file is to transpile Pineapple code to Javascript code
 */
import {
    ArrayAccess,
    ArrayElement,
    ArrayExpression,
    AssignmentStatement,
    AtomicToken,
    BooleanExpression,
    BranchStatement,
    Declaration,
    Expression,
    ForStatement,
    FunctionCall,
    FunctionDeclaration,
    JavascriptCode,
    KeyValueList,
    NumberExpression,
    PonExpression,
    ReturnStatement,
    Statement,
    StringExpression,
    TestExpression,
    TypeExpression,
    VariableDeclaration,
    WhileStatement
} from "./ast";

// Note: tp means transpile
// Example: tpDeclaration means transpileDeclaration

export function tpDeclaration(input: Declaration): string {
    if (!input) {
        return "";
    }
    const next = input.next ? tpDeclaration(input.next) : "";
    if (input.body.kind === "FunctionDeclaration") {
        return tpFunctionDeclaration(input.body) + next;
    }
}

export function tpFunctionDeclaration(f: FunctionDeclaration): string {
    const funcSignature = stringifyFuncSignature(f.signature);
    if (f.parameters.length === 0) {
        return "" +
        `
function ${funcSignature}(${tpParameters(f.parameters)}){
${tpStatement(f.statements)};
}
`;
    }
    const initStatement = `const $${f.parameters[0].variable.repr} = this;`;

    const targetType = stringifyType(f.parameters[0].typeExpected);

    if (f.parameters.length === 1) {
        return `${targetType}.prototype.${funcSignature}=function(){
${initStatement}
${tpStatement(f.statements)}
}
`;
    }
    if (f.parameters.length === 2) {
        return `${targetType}.prototype.`
        + `${funcSignature}_${stringifyType(f.parameters[1].typeExpected)}`
        + `=function(${f.parameters.slice(1).map((x) => "$" + x.variable.repr).join(",")}){
${initStatement}
${tpStatement(f.statements)}}
`;
    }
}

export function tpStatement(s: Statement): string {
    const next = s.next　? ";\n" + tpStatement(s.next) : "";
    switch (s.body.kind) {
        case "FunctionCall":        return tpFunctionCall(s.body)           + next;
        case "AssignmentStatement": return tpAssignmentStatement(s.body)    + next;
        case "JavascriptCode":      return tpJavascriptCode(s.body)         + next;
        case "ReturnStatement":     return tpReturnStatement(s.body)        + next;
        case "BranchStatement":     return tpBranchStatement(s.body)        + next;
        case "ForStatement":        return tpForStatement(s.body)           + next;
        case "WhileStatement":      return tpWhileStatement(s.body)         + next;
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
} ${b.elseBranch ? `else ${tpBranchStatement(b.elseBranch)}` : "" }
`;
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
    if (f.parameters.length === 0) {
        return `${funcSignature}();`;
    }
    if (f.parameters.length === 1) {
        return `${tpExpression(f.parameters[0])}.${funcSignature}()`;
    }
    if (f.parameters.length === 2) {
        return `(${tpExpression(f.parameters[0])}` +
        `.${funcSignature}_${stringifyType(f.parameters[1].returnType)}(${tpExpression(f.parameters[1])}))`;
    }
}

export function stringifyFuncSignature(signature: AtomicToken[]): string {
    return "_" + signature.map((x) => x.repr.slice(0, -1)).join("$");
}

export function stringifyType(t: TypeExpression): string {
    switch (t.kind) {
        case "SimpleType":
            return t.name.repr;
        case "ArrayType":
            return "ArrayOf" + stringifyType(t.arrayOf);
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
    return removeLastComma(v.map((x) => x.variable.repr).join(","));
}

export function tpExpression(e: Expression): string {
    switch (e.kind) {
        case "FunctionCall":    return tpFunctionCall(e);
        case "String":          return tpStringExpression(e);
        case "Number":          return tpNumberExpression(e);
        case "Variable":        return "$" + e.repr;
        case "Pon":             return tpPonExpression(e);
        case "Array":           return tpArrayExpression(e);
        case "Boolean":         return tpBooleanExpression(e);
        case "ArrayAccess":     return tpArrayAccess(e);
    }
}

export function tpArrayAccess(a: ArrayAccess): string {
    return `${tpExpression(a.subject)}[${tpExpression(a.index)}]`;
}

export function tpJavascriptCode(s: JavascriptCode): string {
    return "" +
`// <javascript>
${s.repr.replace(/(<javascript>|<\/javascript>|@.+)/g, "").trim()}
// </javascript>
`;
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

export function tpArrayExpression(e: ArrayExpression): string {
    const typename = stringifyType(e.returnType);
    return `(new ${typename}([${tpListElements(e.elements)}]))`;
}

export function tpListElements(e: ArrayElement): string {
    return `${tpExpression(e.value)},${e.next ? tpListElements(e.next) : ""}`;
}

export function tpPonExpression(e: PonExpression): string {
    return `{
${tpKeyValueList(e.keyValueList)}
}`;
}

export function tpKeyValueList(e: KeyValueList): string {
    return e.keyValue.memberName.repr.slice(1)
        + " : "
        + tpExpression(e.keyValue.expression)
        + (e.next ? ",\n" + tpKeyValueList(e.next) : "")
        ;
}

export function removeLastComma(s: string): string {
    return s[s.length - 1] === ",\n" ? s.slice(0, -1) : s ;
}
