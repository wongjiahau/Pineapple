import {
    newAtomicToken,
    newGenericType,
    newSimpleType,
    NullTokenLocation,
    SimpleType,
    singleLinkedNode,
    StructDeclaration,
    TypeExpression,
    VoidType,
    LinkedNode
} from "./ast";

import { typeEquals } from "./fillUpTypeInformation";

export interface Tree<T> {
    current: T;
    children: Array<Tree<T>>;
}

export function newTree<T>(value: T): Tree<T> {
    return {
        current: value,
        children: []
    };
}

export function insertChild<T>(
    child: T,
    parent: T,
    tree: Tree<T>,
    comparer: Comparer<T>
): Tree<T> {
    if (includes(tree, child, comparer)) {
        throw new Error(`${child} already exist in tree`);
    }
    if (!includes(tree, parent, comparer)) {
        throw new Error(`${parent} does not exist in tree`);
    }
    return insert(child, parent, tree, comparer);
}

function insert<T>(
    child: T,
    parent: T,
    tree: Tree<T>,
    comparer: Comparer<T>
): Tree<T> {
    if (comparer(parent, tree.current)) {
        tree.children.push(newTree(child));
    } else {
        for (let i = 0; i < tree.children.length; i++) {
            tree.children[i] = insert(child, parent, tree.children[i], comparer);
        }
    }
    return tree;
}

// This function return distance of child to parent
export function childOf<T>(
    child: T,
    parent: T,
    tree: Tree<T>,
    comparer: Comparer<T>
): number | null {
    if (comparer(child, parent)) {
        return 0;
    }
    const matchingParent = findParentOf(child, tree, comparer);
    if (matchingParent === null) {
        return null;
    } else if (comparer(matchingParent, parent)) {
        return 1;
    } else {
        const score = childOf(matchingParent, parent, tree, comparer);
        if (score === null) {
            return score;
        } else {
            return 1 + score;
        }
    }
}

export type Comparer<T> =  (x: T, y: T) => boolean;

export function findParentOf<T>(
    child: T, /*in*/
    tree: Tree<T>,
    comparer: Comparer<T>
): T | null {
    if (tree.children.some((x) => comparer(x.current, child))) {
        return tree.current;
    } else {
        for (let i = 0; i < tree.children.length; i++) {
            const parent = findParentOf(child, tree.children[i], comparer);
            if (parent !== null) {
                return parent;
            }
        }
        return null;
    }
}

export function includes<T>(
    tree: Tree<T>,
    element: T,
    comparer: Comparer<T>
): boolean {
    if (comparer(tree.current, element)) {
        return true;
    } else {
        for (let i = 0; i < tree.children.length; i++) {
            if (includes(tree.children[i], element, comparer)) {
                return true;
            }
        }
        return false;
    }
}

export function verticalDistance<T>(x: T, y: T, tree: Tree<T>, comparer: Comparer<T>): number | null {
    if (comparer(x, y)) {
        return 0;
    }
    let score = childOf(x, y, tree, comparer);
    if ( score !== null) {
        return score;
    }
    score = childOf(y, x, tree, comparer);
    if (score !== null) {
        return score;
    }
    return null;
}

export function flattenTree<T>(tree: Tree<T>): T[] {
    let result: T[] = [];
    result.push(tree.current);
    for (let i = 0; i < tree.children.length; i++) {
        result = result.concat(flattenTree(tree.children[i]));
    }
    return result;
}

export function logTree<T>(tree: Tree<T>, stringifier: (x: T) => string, level = 0): string {
    let result = "";
    const padding = (() => {
        let x = "";
        for (let i = 0; i < level; i++) {
            x += " ";
        }
        return x;
    })();
    result += padding + stringifier(tree.current);
    result += "\n" + tree.children.map((x) => logTree(x, stringifier, level + 4)).join("");
    return result;
}

export function initTypeTree(): Tree<TypeExpression> {
    const anyType       = newSimpleType("Any");
    const enumType      = EnumType();
    const objectType    = ObjectType();
    const dictType      = newSimpleType("Dict");
    const listType      = newListType(newGenericType("T"));
    const emptyListType = EmptyListType();
    const numberType    = newSimpleType("Number");
    const integerType   = newSimpleType("Int");
    const stringType    = newSimpleType("String");
    const dateType      = newSimpleType("Date");
    const inserts = (x: TypeExpression, parent: TypeExpression) => {
        return insertChild(x, /* as child of */parent, /*in*/ tree, typeEquals);
    };
    let tree = newTree(anyType);
    tree     = inserts(numberType,  anyType);
    tree     = inserts(integerType, numberType);
    tree     = inserts(enumType,    anyType);
    tree     = inserts(dictType,    anyType);
    tree     = inserts(objectType,  dictType);
    tree     = inserts(listType,    anyType);
    tree     = inserts(emptyListType,    listType);
    tree     = inserts(dateType,    anyType);
    tree     = inserts(stringType,  listType);
    return tree;
}

export function EmptyListType(): TypeExpression {
    return newSimpleType("EmptyList");
}

export function ObjectType(): TypeExpression {
    return newSimpleType("Object");
}

export function EnumType(): TypeExpression {
    return newSimpleType("Enum");
}

export function newListType(of: TypeExpression): TypeExpression {
    return {
        kind: "StructDeclaration",
        members: null,
        originFile: "<built-in>",
        name: newAtomicToken("List"),
        location: NullTokenLocation(),
        templates: singleLinkedNode(of),
        nullable: false
    };
}

export function newTupleType(of: LinkedNode<TypeExpression> | null): TypeExpression {
    return {
        kind: "StructDeclaration",
        members: null,
        originFile: "<built-in>",
        name: newAtomicToken("Tuple"),
        location: NullTokenLocation(),
        templates: of,
        nullable: false
    };
}

export function VoidType(): VoidType {
    return {
        kind: "VoidType",
        location: NullTokenLocation(),
        nullable: false
    };
}
