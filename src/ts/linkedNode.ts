export interface LinkedNode<T> {
    current: T;
    next: LinkedNode<T> | null;
}

export function flattenLinkedNode<T>(ast: LinkedNode<T> | null): T[] {
    if (ast === null) {
        return [];
    }
    const result: T[] = [];
    let next: LinkedNode<T> | null = ast;
    while (next) {
        result.push(next.current);
        next = next.next;
    }
    return result;
}

export function convertToLinkedNode<T>(array: T[]): LinkedNode<T> | null {
    if (array.length === 0) {
        return null;
    } else {
        const result: LinkedNode<T> = {
            current: array[0],
            next: null
        };
        let now: LinkedNode<T> | null = result;
        for (let i = 1; i < array.length; i++) {
            if (now !== null) {
                now.next = {
                    current: array[i],
                    next: null
                };
                now = now.next;
            } else {
                throw new Error("Impossible, if the flow reach here, this algo have bug");
            }
        }
        return result;
    }
}
