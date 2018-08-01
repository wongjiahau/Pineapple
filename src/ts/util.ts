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
