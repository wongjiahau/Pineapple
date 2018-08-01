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
