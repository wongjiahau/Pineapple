const Lexer = require("lex");
const parser = require("../jison/pineappe-parser-v2");

type TokenType
    = "if"
    | "elif"
    | "else"
    | "newline"
    | "space"
    | "indent"
    | "dedent"
    | "eof"
    | "number"
    | "linking_operator"
    | "operator"
    | "identifier"
    | "string";

class Token {
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

const lexer = new Lexer((char: string) => {
    throw new Error("Unexpected character at row " + Token.line + ", col " + Token.column + ": " + char);
});

lexer
.addRule(/if/, (): Token => {
    return new Token("if");
})
.addRule(/\n/, (): Token => {
    Token.line++;
    Token.column = 1;
    return new Token("newline");
}, [])
.addRule(/./, function() {
    this.reject = true;
    Token.column++;
}, [])
.addRule(/[a-z][a-z0-9]*/i, (lexeme: string) => {
    this.yytext = lexeme;
    return new Token("identifier", lexeme);
})
.addRule(/\d+([.]\d+)?(e[+-]?\d+)?/i, (lexeme: string) => {
    return new Token("number", lexeme);
})
.addRule(/(=|<\-)/i, (lexeme: string) => {
    return new Token("linkingOperator", lexeme);
})
.addRule(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]+/, (lexeme: string) => {
    return new Token("operator", lexeme);
})
;

const indent = [0];
lexer.addRule(/^[\t ]*/gm, (lexeme: string): Token | Token[] | undefined => {
    const indentation = lexeme.length;

    if (indentation > indent[0]) {
        indent.unshift(indentation); // unshift means insert element at index 0
        return new Token("indent");
    }

    const tokens: Token[] = [];

    while (indentation < indent[0]) {
        tokens.push(new Token("dedent"));
        indent.shift(); // shift means remove the first element
    }

    if (tokens.length) {
        return tokens;
    }
});

lexer.addRule(/[ ]+/, function(lexeme: string): Token {
    this.yytext = lexeme;
    return new Token("space");
});

lexer.addRule(/$/, () => {
    return new Token("eof");
});

const sample =
`if >= 3
    if hey
        hey hey
    elif yo
        ho
hi
`;

export function tokenize(input: string): string {
    lexer.input = input;
    const tokens = [];
    let result = null;
    do {
        result = lexer.lex();
        tokens.push(result);
    } while (result !== undefined);
    return tokens
        .filter((x) => x !== undefined)
        .map((x) => x.toString())
        .join("\n");
}

const tokenized = tokenize("1+32-99");

// console.log(tokenized);

const ast = parser.parse(tokenized);
console.log(JSON.stringify(ast, null, 2));
