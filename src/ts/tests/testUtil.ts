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
        throw new Error("Expected to fail");
    } catch (error) {
        return error;
    }
}
