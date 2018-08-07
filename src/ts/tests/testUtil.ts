import { expect } from "chai";
import { pine2js } from "../pine2js";

export function assertEquals<T>(actual: T, expected: T) {
    if (actual !== expected) {
        // console.log("Expected result:");
        // console.log(expected);
        console.log("Actual result : ");
        console.log(actual);
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

export function testError(expectedErrorName: string, input: string) {
    const scriptName = __filename.split(/[\\/]/).pop() as string;
    describe(scriptName.split(".")[0], () => {
        it(expectedErrorName, () => {
            expect(catchError(() => pine2js(input)).name).to.eq(expectedErrorName);
        });
    });
}
