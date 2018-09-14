export type Maybe<TResult, TError> = OK<TResult> | Fail<TError>;

interface OK<T> {
    kind: "OK";
    value: T;
}
export function ok<T>(value: T): OK<T> {
    return {
        kind: "OK",
        value: value
    };
}

export function isOK<X, Y>(result: Maybe<X, Y>): result is OK<X> {
    return result.kind === "OK";
}

export function isFail<X, Y>(result: Maybe<X, Y>): result is Fail<Y> {
    return result.kind === "Fail";
}

interface Fail<T> {
    kind: "Fail";
    error: T;
}

export function fail<T>(error: T): Fail<T> {
    return {
        kind: "Fail",
        error: error
    };
}