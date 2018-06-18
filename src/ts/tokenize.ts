import { Lexer } from "./lexer";

export type TokenType
    = "if"
    | "elif"
    | "else"
    | "left_paren"
    | "right_paren"
    | "newline"
    | "indent"
    | "dedent"
    | "space"
    | "eof"
    | "number"
    | "assign_op"
    | "bind_op"
    | "type_op"
    | "return"
    | "operator"
    | "string"
    | "varname"
    | "typename"
    | "funcname"
    | "javascript"
    ;

export class Token {
    public static readonly TokenTable: {[key: number]: Token}  = {};
    public static line: number = 1;
    public static column: number = 1;
    private static nextId = 0;

    public readonly id: number | null = null;
    public readonly type: TokenType;
    public readonly line: number;
    public readonly column: number;
    public readonly value: string | null;

    public constructor(type: TokenType, value: string | null = null)  {
        this.type = type;
        this.line = Token.line;
        this.column = Token.column;
        this.value = value;
        if (this.value) {
            this.id = Token.nextId;
            Token.TokenTable[Token.nextId] = this;
            Token.nextId++;
        }
    }

    public toString(): string {
        return `${this.type.toUpperCase()}${this.value ? "::" + this.id : ""}`;
    }

}

export function tokenize(input: string): string {
    const lexer = new Lexer();
    lexer.setInput(input.trimLeft());
    const tokens = [];
    let result = null;
    do {
        result = lexer.lex();
        tokens.push(result);
    } while (result !== undefined);
    return tokens
        .filter((x) => x !== undefined)
        .map((x) => x.toString())
        .join("\n")
        .replace(/SPACE/g, ""); // remove SPACE token
}
