import { SourceCode } from "./cli";
import { Declaration, SyntaxTree } from "./ast";
import { preprocess } from "./preprocess";
const parser     = require("../jison/pineapple-parser-v2");

export function parseCodeToSyntaxTree(sourceCode: SourceCode): SyntaxTree {
    return {
        source: sourceCode,
        declarations: parser.parse(preprocess(sourceCode)) as Declaration[]
    };
}