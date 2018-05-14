import { preprocess } from "../../repl";

export const parser = {
    parse: (input: string) => {
        return require("../../../jison/pineapple-parser.js").parse(preprocess(input));
    }
};
