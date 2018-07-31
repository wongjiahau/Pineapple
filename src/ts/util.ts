export function find<T1, T2>(needle: T1, haystack: T2[], comparer: (x: T1, y: T2) => boolean): T2 | null {
    for (let i = 0; i < haystack.length; i++) {
        if (comparer(needle, haystack[i])) {
            return haystack[i];
        }
    }
    return null;
}
