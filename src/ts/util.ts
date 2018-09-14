
// @ts-ignore
import levenshtein from "fast-levenshtein";

export function find<T1, T2>(needle: T1, haystack: T2[], comparer: (x: T1, y: T2) => boolean): T2 | null {
    for (let i = 0; i < haystack.length; i++) {
        if (comparer(needle, haystack[i])) {
            return haystack[i];
        }
    }
    return null;
}

export function hasDuplicates(array: string[]) {
    const valuesSoFar: {[key: string]: boolean} = {};
    for (let i = 0; i < array.length; ++i) {
        const value = array[i];
        if (value in valuesSoFar) {
            return true;
        }
        valuesSoFar[value] = true;
    }
    return false;
}

export function values<T>(dict: {[key: string]: T}): T[] {
    return Object.keys(dict).map((x) => dict[x]);
}

export function findSimilarStrings(needle: string, haystack: string[]): string[] {
    const result: string[] = [];
    const acceptedDistance = needle.length / 2;
    for (let i = 0; i < haystack.length; i++) {
        if (levenshtein.get(needle, haystack[i]) <= acceptedDistance) {
            result.push(haystack[i]);
        }
    }
    return result;
}

export function copy < T >(x: T): T {
    return JSON.parse(JSON.stringify(x));
}

export function endsWith(s: string, suffixes: string): boolean {
    return s.slice(-suffixes.length) === suffixes;
}

export function startsWith(s: string, prefixes: string): boolean {
    return s.slice(0, prefixes.length) === prefixes;
}
