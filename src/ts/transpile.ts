import {
    Declaration,
    Expression,
    FunctionCall,
    FunctionDeclaration,
    JavascriptCode,
    KeyValueList,
    LinkStatement,
    NumberExpression,
    PonExpression,
    Statement,
    StringExpression,
    TypeExpression,
    Variable
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
    if (f.parameters.length === 0) {
        return "" +
        `
function ${f.signature}(${tpParameters(f.parameters)}){
${tpStatement(f.statements)};
}
`;
    }
    const targetType = f.parameters[0].typeExpected.name;
    if (f.parameters.length === 1) {
        return `${targetType}.prototype.${f.signature}=function(){
let ${f.parameters[0].name.value} = this;
${tpStatement(f.statements)}}
`;
    }
    if (f.parameters.length === 2) {
        return `${targetType}.prototype.${f.signature}_${f.parameters[1].typeExpected.name}`
        + `=function(${f.parameters.slice(1).map((x) => x.name.value).join(",")}){
const ${f.parameters[0].name.value} = this;
${tpStatement(f.statements)}}
`;
    }
}

function getParamsType(p: Variable[]): string {
    if (p.length === 0) {
        return "";
    }
    return p.map((x) => stringifyTypeExpression(x.type)).join("_");
}

function stringifyTypeExpression(t: TypeExpression): string {
    return t.name.token.value + (t.isList ? "List" : "");
}

export function tpStatement(s: Statement): string {
    const next = s.next　? ";\n" + tpStatement(s.next) : "";
    switch (s.body.kind) {
        case "FunctionCall": return tpFunctionCall(s.body) + next;
        case "LinkStatement": return tpLinkStatement(s.body) + next;
        case "JavascriptCode": return tpJavascriptCode(s.body) + next;
    }
}

export function tpFunctionCall(f: FunctionCall): string {
    if (f.parameters.length === 0) {
        return `${f.signature}();`;
    }
    if (f.parameters.length === 1) {
        return `${tpExpression(f.parameters[0])}.${f.signature}()`;
    }
    if (f.parameters.length === 2) {
        return `(${tpExpression(f.parameters[0])}` +
        `.${f.signature}_${stringifyType(f.parameters[1].returnType)}(${tpExpression(f.parameters[1])}))`;
    }
}

export function stringifyType(t: TypeExpression): string {
    return t.name;
}

export function tpLinkStatement(l: LinkStatement): string {
    return `${l.isDeclaration ? "const" : ""} ${l.variable.name.value} = ${tpExpression(l.expression)}`;
}

export function tpParameters(v: Variable[]): string {
    return removeLastComma(v.map((x) => x.name.value).join(","));
}

export function tpExpression(e: Expression): string {
    switch (e.kind) {
        case "FunctionCall": return tpFunctionCall(e);
        case "String": return tpStringExpression(e);
        case "Number": return tpNumberExpression(e);
        case "Variable": return e.name.value;
        case "Pon": return tpPonExpression(e);
    }
}

export function tpJavascriptCode(s: JavascriptCode): string {
    return "" +
`// <javascript>
${s.value.replace(/(<javascript>|<\/javascript>|@.+)/g, "").trim()}
// </javascript>
`;
}
export function tpStringExpression(s: StringExpression): string {
    return `"${s.value.slice(1, -1)}"`;
}

export function tpNumberExpression(e: NumberExpression): string {
    if (e.value.indexOf(".") > -1) {
        return `(${e.value})`;
    } else {
        return `new Int(${e.value})`;
    }
}

export function tpPonExpression(e: PonExpression): string {
    return `{
${tpKeyValueList(e.keyValueList)}
}`;
}

export function tpKeyValueList(e: KeyValueList): string {
    return e.keyValue.memberName.value.slice(1)
        + " : "
        + tpExpression(e.keyValue.expression)
        + (e.next ? ",\n" + tpKeyValueList(e.next) : "")
        ;
}

export function removeLastComma(s: string): string {
    return s[s.length - 1] === ",\n" ? s.slice(0, -1) : s ;
}
