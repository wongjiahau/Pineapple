// import { getFunctionTable } from "./getFunctionTable";
import { Declaration } from "./ast";
import { fillUpTypeInformation } from "./fillUpTypeInformation";
import { preprocess } from "./preprocess";
import { Token, tokenize } from "./tokenize";
import { tpDeclaration } from "./transpile";
const parser     = require("../jison/pineapple-parser-v2");

export function pine2js(input: string): string {
    // const tokenized    = tokenize(input);
    // const preprocessed = removeConsequetingNewlines(tokenized);
    const result = preprocess(input);
    let ast      = parser.parse(result);
    ast          = fillUpTypeInformation(ast);
    // prettyPrint(ast);

    const symbolized = retrieveSymbol(Token.TokenTable, ast);
    // console.log(Token.TokenTable);
    // console.log(JSON.stringify(symbolized, null, 2));
    // const functionTables = getFunctionTable(symbolized);

    // TODO: Fill in missing type info in AST
    // (a) Function call argument types
    //      1. Loop throught every function entry
    //      2. $matchingFunc = everyFunctionEntries.filter($1.signature == current.signature)
    //      3. $scores = $matchingFunc.map(getScore($1.args, current.args))
    //      4. return $matchingFunc.{indexOfMinValueOf $scores}
    //
    // function getScore [$args1,$args2]:[Type[],Type[]] >> int[]
    //      let $result : mutable Int[] << []
    //      for $i in range 1 to $args1.length
    //          let $dist = distanceBetween $args1.[$i] $args2.[$i]
    //          $result << $result append $dist
    //      return $result
    //
    // function distanceBetween(args1, args2) {
    //      if(args1 == args2)
    //          return 0
    //      else
    //          return
    // }
    //
    // (b) Variable declaration types
    /**
     * How to do generic type?
     * 1. When calling a generic function
     * 2. The function-call-node should be replace with the body of the function
     * 3. Then the generic type T, should be replace by the calling type
     */

    const code       = tpDeclaration(ast);
    // console.log(code);
    return code;
}

export function retrieveSymbol(tokenTable: {[key: number]: Token}, ast: any): any {
    for (const key in ast) {
        if (ast.hasOwnProperty(key)) {
            if (typeof ast[key] === "object") {
                ast[key] = retrieveSymbol(tokenTable, ast[key]);
            } else if (key === "tokenId") {
                const tokenId = parseInt(ast[key], 10);
                ast.token = [tokenTable[tokenId]].map((x) => ({
                    id: tokenId,
                    line: x.line,
                    column: x.column,
                    value: x.value
                }))[0];
                delete ast.tokenId;
            }
        }
    }
    return ast;
}

function removeConsequetingNewlines(input: string): string {
    return input
        .replace(/NEWLINE\s(NEWLINE\s)+/g, "NEWLINE\n")
        .replace(/NEWLINE\sEOF/g, "EOF");

}

function prettyPrint(ast: Declaration): void {
    ast = removeTokenLocation(ast);
    console.log(JSON.stringify(ast, null, 2));
}

function removeTokenLocation(ast: any): any {
    for (const key in ast) {
        if (key === "location") {
            delete ast[key];
        } else if (typeof(ast[key]) === "object") {
            ast[key] = removeTokenLocation(ast[key]);
        }
    }
    return ast;
}
