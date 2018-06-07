import { Token, TokenType } from "./tokenize";

const jsLexer = require("lex");

export class Lexer {
    private indent: number[];
    private lexer: any;
    public constructor() {
        this.lexer = new jsLexer((char: string) => {
            throw new Error("Unexpected character at row " + Token.line + ", col " + Token.column + ": " + char);
        });

        this.lexer
        .addRule(/<javascript>(.|[\s\S])*<\/javascript>/, (lexeme: string): Token => {
            return new Token("javascript", lexeme.replace(/(<javascript>|<\/javascript>)/g, "").trim());
        })
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

        this.indent = [0];
        this.lexer.addRule(/^[\t ]*/gm, (lexeme: string): Token | Token[] | undefined => {
            const indentation = lexeme.length;

            if (indentation > this.indent[0]) {
                this.indent.unshift(indentation); // unshift means insert element at index 0
                return new Token("indent");
            }

            const tokens: Token[] = [];

            while (indentation < this.indent[0]) {
                tokens.push(new Token("dedent"));
                this.indent.shift(); // shift means remove the first element
            }
            if (tokens.length) {
                return tokens;
            }
            return;
        });

        this.lexer.addRule(/[ ]+/, (lexeme: string): Token => {
            return new Token("space");
        });
        this.lexer.addRule(/$/, () => {
            return new Token("eof");
        });
    }

    public setInput(input: string): void {
        this.lexer.input = input;
    }

    public lex(): Token {
        return this.lexer.lex();
    }
}
