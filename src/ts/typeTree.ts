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
    if (comparer(parent, tree.current)) {
        tree.children.push(newTree(child));
    } else {
        for (let i = 0; i < tree.children.length; i++) {
            tree.children[i] = insertChild(child, parent, tree.children[i], comparer);
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
    const matchingParents = findParentsOf(child, tree, comparer);
    if (matchingParents.length === 0) {
        return null;
    } else if (matchingParents.some(x => comparer(x, parent))) {
        return 1;
    } else {
        const scores: (number|null)[] = [];
        for (let i = 0; i < matchingParents.length; i++) {
            scores.push(childOf(matchingParents[i], parent, tree, comparer));
            
        }
        if (scores.every((x) => x === null)) {
            return null;
        } else {
            return 1 + (scores.filter((x) => x!== null) as number[]).sort()[0];
        }
    }
}

export type Comparer<T> =  (x: T, y: T) => boolean;

export function findParentsOf<T>(
    child: T, /*in*/
    tree: Tree<T>,
    comparer: Comparer<T>
): T[] {
    let result: T[] = [];
    if (tree.children.some((x) => comparer(x.current, child))) {
        result.push(tree.current);
    }
    for (let i = 0; i < tree.children.length; i++) {
        result = result.concat(findParentsOf(child, tree.children[i], comparer));
    }
    return result;
}

export function findAllAncestorsOf<T>(
    child: T, /*in*/
    tree: Tree<T>,
    comparer: Comparer<T>
): T[] {
    let result: T[] = [];
    if (tree.children.some((x) => comparer(x.current, child))) {
        result.push(tree.current);
        result = result.concat(findAllAncestorsOf(tree.current, tree, comparer));
    }
    for (let i = 0; i < tree.children.length; i++) {
        result = result.concat(findAllAncestorsOf(child, tree.children[i], comparer));
    }
    return result;
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
    const anyType       = newBuiltinType(":any");
    const enumType      = EnumType();
    const structType    = BaseStructType();
    const tableType     = newBuiltinType(":table");
    const listType      = newListType(newGenericTypename("T"));
    const numberType    = newBuiltinType(":number");
    const integerType   = newBuiltinType(":integer");
    const stringType    = newBuiltinType(":string");
    const dateType      = newBuiltinType(":date");
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
    return newBuiltinType(":struct");
}

export function EnumType(): TypeExpression {
    return newBuiltinType(":enum");
}

export function AnyType(): TypeExpression {
    return newBuiltinType(":any");
}

export function newListType(of: TypeExpression): TypeExpression {
    return {
        kind: "BuiltinType",
        name: ":list",
        genericList: [of],
        nullable: false,
        location: NullTokenLocation()
    };
}

export function newTupleType(of: TypeExpression[]): TypeExpression {
    return {
        kind: "BuiltinType",
        name: ":tuple",
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
