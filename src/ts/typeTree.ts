import {
    BuiltinTypename,
    GenericList,
    newAtomicToken,
    newGenericTypename,
    NullTokenLocation,
    StructDeclaration,
    StructType,
    TypeExpression,
    VoidType
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
    if (findElement(tree, child, comparer) !== null) {
        throw new Error(`${JSON.stringify(child)} already exist in tree`);
    }
    if (findElement(tree, parent, comparer) === null) {
        throw new Error(`${JSON.stringify(parent)} does not exist in tree`);
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

export function findElement<T>(
    tree: Tree<T>,
    element: T,
    comparer: Comparer<T>
): T | null {
    if (comparer(tree.current, element)) {
        return tree.current;
    } else {
        for (let i = 0; i < tree.children.length; i++) {
            const result = findElement(tree.children[i], element, comparer);
            if (result !== null) {
                return result;
            }
        }
        return null;
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
    const anyType       = newBuiltinType("Any");
    const enumType      = EnumType();
    const structType    = BaseStructType();
    const tableType     = newBuiltinType("Table");
    const listType      = newListType(newGenericTypename("T"));
    const numberType    = newBuiltinType("Number");
    const integerType   = newBuiltinType("Integer");
    const stringType    = newBuiltinType("String");
    const dateType      = newBuiltinType("Date");
    const inserts = (x: TypeExpression, parent: TypeExpression) => {
        return insertChild(x, /* as child of */parent, /*in*/ tree, typeEquals);
    };
    let tree = newTree(anyType);
    tree     = inserts(numberType,  anyType);
    tree     = inserts(integerType, numberType);
    tree     = inserts(enumType,    anyType);
    tree     = inserts(tableType,    anyType);
    tree     = inserts(structType,  tableType);
    tree     = inserts(listType,    anyType);
    tree     = inserts(dateType,    anyType);
    tree     = inserts(stringType,  anyType);
    return tree;
}

export function BaseStructType(): TypeExpression {
    return newBuiltinType("Struct");
}

export function EnumType(): TypeExpression {
    return newBuiltinType("Enum");
}

export function AnyType(): TypeExpression {
    return newBuiltinType("Any");
}

export function newListType(of: TypeExpression): TypeExpression {
    return {
        kind: "BuiltinType",
        name: "List",
        genericList: [of],
        nullable: false,
        location: NullTokenLocation()
    };
}

export function newTupleType(of: TypeExpression[]): TypeExpression {
    return {
        kind: "BuiltinType",
        name: "Tuple",
        genericList: of,
        nullable: false,
        location: NullTokenLocation()
    };
}

export function VoidType(): VoidType {
    return {
        name: newAtomicToken("Void"),
        kind: "VoidType",
        location: NullTokenLocation(),
        nullable: false,
    };
}

export function newStructType(s: StructDeclaration, genericList: GenericList): StructType {
    return {
        kind: "StructType",
        reference: s,
        nullable: false,
        genericList: genericList,
        location: s.location
    };
}

export function newBuiltinType(name: BuiltinTypename): TypeExpression {
    return {
        kind: "BuiltinType",
        name: name,
        nullable: false,
        genericList: [],
        location: NullTokenLocation()
    };
}
