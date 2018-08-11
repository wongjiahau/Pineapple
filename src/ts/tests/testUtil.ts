import { expect } from "chai";
require("colors");
import { mocha } from "mocha";
import { pine2js } from "../pine2js";
const jsdiff = require("diff");

export function assertEquals(actual: string, expected: string) {
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
        console.log(result);
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

export function testError(expectedErrorName: string, input: string, logError = false) {
    const scriptName = __filename.split(/[\\/]/).pop() as string;
    describe(scriptName.split(".")[0], () => {
        it(expectedErrorName, () => {
            if (logError) {
                pine2js(input);
            } else {
                expect(catchError(() => pine2js(input)).name).to.eq(expectedErrorName);
            }
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
