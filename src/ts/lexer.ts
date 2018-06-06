const Lexer = require("lex");
const parser = require("../jison/pineappe-parser-v2");

type TokenType
    = "if"
    | "elif"
    | "else"
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
    ;

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
.addRule(/[$][a-z][a-zA-Z0-9]*/, (lexeme: string): Token => {
    return new Token("varname", lexeme);
})
.addRule(/:/, (): Token => {
    return new Token("type_op");
})
.addRule(/=/, (): Token => {
    return new Token("bind_op");
})
.addRule(/<</, (): Token => {
    return new Token("assign_op");
})
.addRule(/>>/, (): Token => {
    return new Token("return");
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
.addRule(/(if|elif|else|isnt|is|and|or|function|iofunction|let)/, (lexeme: string): Token => {
    return new Token(lexeme as TokenType);
})
.addRule(/`.*`/, (lexeme: string) => {
    return new Token("string", lexeme);
})
.addRule(/[a-z][a-zA-Z0-9]*/, (lexeme: string) => {
    return new Token("funcname", lexeme);
})
.addRule(/[A-Z][a-z0-9]*/, (lexeme: string) => {
    return new Token("typename", lexeme);
})
.addRule(/\d+([.]\d+)?(e[+-]?\d+)?/i, (lexeme: string) => {
    return new Token("number", lexeme);
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
    return;
});

lexer.addRule(/[ ]+/, function(lexeme: string): Token {
    this.yytext = lexeme;
    return new Token("space");
});

lexer.addRule(/$/, () => {
    return new Token("eof");
});

// const sample =
// `if >= 3
//     if hey
//         hey hey
//     elif yo
//         ho
// hi
// `;

export function tokenize(input: string): string {
    lexer.input = input.trimLeft();
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

const tokenized = tokenize(`
iofunction
main >> Void
    let $myName:String << \`123\`
    print $myName
`
);

console.log(tokenized);
// console.log(Token.TokenTable);

try {
    const ast = parser.parse(tokenized);
    console.log(JSON.stringify(ast, null, 2));
} catch (error) {
    console.log(error);
}
