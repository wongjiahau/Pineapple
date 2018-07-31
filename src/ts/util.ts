export function find<T>(needle: T, haystack: T[]): T | null {
    for (let i = 0; i < haystack.length; i++) {
        if (needle === haystack[i]) {
            return needle;
        }
    }
    return null;
}
