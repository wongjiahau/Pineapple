import { expect } from "chai";
require("colors");

declare var describe: any;
declare var it: any;

// @ts-ignore
import { mocha } from "mocha";
import { interpret, SourceCode, ErrorStackTrace, isErrorDetail, InterpreterOptions } from "../interpret";
import { renderError } from "../errorType/renderError";
import { isOK } from "../maybeMonad";
import { executeCode } from "../executeCode";
const jsdiff = require("diff");

export function assertEquals(actual: string, expected: string, logDiff: boolean) {
    if (actual.trim() !== expected.trim()) {
        // const diff = jsdiff.diffLines(actual, expected);
        const diff = jsdiff.diffChars(actual, expected);
        const result = diff.map((part: any) => {
            // green for additions, red for deletions
            // grey for common parts
            const color =
                part.added ? "green" :
                part.removed ? "red" : "grey";

            return (part.value[color]);
        }).join("");
        if(logDiff) {
            console.log(result);
        }
        throw new Error("Failed");
    }
}

export function catchError(f: () => void): Error {
    try {
        f();
        const e = new Error();
        e.name = "No error is caught";
        return e;
    } catch (error) {
        return error;
    }
}

export function  testRuntimeError(
    description:string,
    input: string, 
    expectedStackTrace: ErrorStackTrace
): any {
    const source: SourceCode = {
        content: input,
        filename: "<UNIT_TEST>"
    };
    describe(description, () => {
        it("", () => {
            const options: InterpreterOptions = {
                generateSourceMap: true,
                loadPreludeLibrary: false,
                run: "Program",
                optimize: false
            }
            const result = interpret(source, executeCode, options);
            if(isOK(result)) {
                throw new Error("No error is caught.");
            } else {
                // console.log(result.error);
                expect(result.error).to.deep.eq(expectedStackTrace);
            }
        });
        
    });
}

export function testError(
    expectedErrorName: string, 
    input: string, 
    expectedMessage: string | undefined = undefined,
    logError = false
) {
    describe("", () => {
        it(expectedErrorName, () => {
            const source: SourceCode = {
                content: input,
                filename: "<UNIT_TEST>"
            };
            const options: InterpreterOptions = {
                optimize: false,
                loadPreludeLibrary: false,
                generateSourceMap: false,
                run: "Program"
            }
            const result = interpret(source, (x) => x, options);
            if (isOK(result)) {
                throw new Error("No error is caught");
            } else {
                const error = result.error;
                if (logError) {
                    console.log(error);
                }
                expect(error).to.not.equal(null);
                if (error !== null) {
                    expect(error.name).to.eq(expectedErrorName);
                    if(isErrorDetail(error)) {
                        if(expectedMessage) {
                            expect(error.message).to.eq(expectedMessage);
                        }
                    } else {
                        throw new Error("Failed");
                    }
                }
            }
        });
    });
}

export function testTranspile(description: string, input: string, expectedOutput: string) {
    describe("", () => {
        it(description, () => {
            const source: SourceCode = {
                content: input,
                filename: "<UNIT_TEST>"
            };
            const options: InterpreterOptions = {
                optimize: false,
                loadPreludeLibrary: false,
                generateSourceMap: false,
                run: "Program"
            }
            const result = interpret(source, (x) => x, options); 
            if (result.kind === "OK") {
                assertEquals(result.value.trim(), expectedOutput.trim(), true);
            } else {
                console.log(result.error);
                throw new Error("Caught error " + renderError(result.error));
            }
        });
    });
}

export function testTranspileSkip(description: string, input: string, expectedOutput: string) {
    console.log(input);
    console.log(expectedOutput);
    describe("", () => {
        it.skip(description, () => {

        });
    });
}

export function mockChalk(): any {
    const result: any = {};
    const self = (src: string) => src;
// (text: TemplateStringsArray, ...placeholders: string[]): string;
// constructor: ChalkConstructor;
// enabled: boolean;
// level: Level;
// rgb(r: number, g: number, b: number): this;
// hsl(h: number, s: number, l: number): this;
// hsv(h: number, s: number, v: number): this;
// hwb(h: number, w: number, b: number): this;
// bgHex(color: string): this;
// bgKeyword(color: string): this;
// bgRgb(r: number, g: number, b: number): this;
// bgHsl(h: number, s: number, l: number): this;
// bgHsv(h: number, s: number, v: number): this;
// bgHwb(h: number, w: number, b: number): this;
// hex(color: string): this;
// keyword(color: string): this;

// readonly reset: this;
// readonly bold: this;
// readonly dim: this;
// readonly italic: this;
// readonly underline: this;
// readonly inverse: this;
// readonly hidden: this;
// readonly strikethrough: this;

// readonly visible: this;

// readonly black: this;
// readonly red: this;
// readonly green: this;
// readonly yellow: this;
// readonly blue: this;
// readonly magenta: this;
// readonly cyan: this;
// readonly white: this;
// readonly gray: this;
// readonly grey: this;
// readonly blackBright: this;
// readonly greenBright: this;
// readonly yellowBright: this;
// readonly blueBright: this;
// readonly magentaBright: this;
// readonly cyanBright: this;
// readonly whiteBright: this;

// readonly bgBlack: this;
// tslint:disable-next-line:indent
    result.redBright = self;
    result.bgRed = self;
    result.bgRedBright = self;
// readonly bgGreen: this;
// readonly bgYellow: this;
// readonly bgBlue: this;
// readonly bgMagenta: this;
// readonly bgCyan: this;
// readonly bgWhite: this;
// readonly bgBlackBright: this;
// readonly bgGreenBright: this;
// readonly bgYellowBright: this;
// readonly bgBlueBright: this;
// readonly bgMagentaBright: this;
// readonly bgCyanBright: this;
// readonly bgWhiteBright: this;
    return result;
}

export const numberComparer = (x: number, y: number) => x === y;

export function dummySourceCode(content: string): SourceCode {
    return {
        filename: "dummy",
        content: content
    };
}

export function assertFail(message: string) {
    throw new Error(message);
}
