import { SourceCode } from "./cli";
import { Declaration } from "./ast";
import { preprocess } from "./preprocess";
const parser     = require("../jison/pineapple-parser-v2");

export function parseCodeToSyntaxTree(sourceCode: SourceCode): Declaration[] {
    return parser.parse(preprocess(sourceCode)) as Declaration[];
}