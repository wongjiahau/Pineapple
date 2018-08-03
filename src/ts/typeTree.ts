import {CompoundType, NullTokenLocation, SimpleType, TypeExpression} from "./ast";
import { typeEquals } from "./fillUpTypeInformation";

export interface TypeTree {
    current: TypeExpression;
    children: TypeTree[];
}

export function newTypeTree(type: TypeExpression): TypeTree {
    return {
        current: type,
        children: []
    };
}

export function insertChild(child: TypeExpression, parent: TypeExpression, tree: TypeTree): TypeTree {
    if (typeEquals(parent, tree.current)) {
        tree.children.push(newTypeTree(child));
    } else {
        for (let i = 0; i < tree.children.length; i++) {
            tree.children[i] = insertChild(child, parent, tree.children[i]);
        }
    }
    return tree;
}

// This function return distance of child to parent
export function childOf(child: TypeExpression, parent: TypeExpression, tree: TypeTree): number {
    if (parent.kind === "SimpleType" && parent.name.repr === "Any") {
        return 1;
    }
    const matchingParent = findParentOf(child, tree);
    if (matchingParent === null) {
        // 99 means no matching parent
        return 99;
    } else if (typeEquals(matchingParent, parent)) {
        return 1;
    } else {
        return 1 + childOf(matchingParent, parent, tree);
    }
}

export function findParentOf(child: TypeExpression, /*in*/ tree: TypeTree): TypeExpression | null {
    if (tree.children.some((x) => typeEquals(x.current, child))) {
        return tree.current;
    } else {
        for (let i = 0; i < tree.children.length; i++) {
            const parent = findParentOf(child, tree.children[i]);
            if (parent !== null) {
                return parent;
            }
        }
        return null;
    }
}

export function initTypeTree(): TypeTree {
    const anyType        = newSimpleType("Any");
    const objectType     = newSimpleType("Object");
    const dictType       = newSimpleType("Dict");
    const arrayType      = newListType(anyType);
    const numberType     = newSimpleType("Number");
    const numberListType = newListType(numberType);
    const stringType     = newSimpleType("String");
    const dateType       = newSimpleType("Date");
    let tree = newTypeTree(anyType);
    tree = insertChild(dictType, anyType, tree);
    tree = insertChild(objectType, dictType, tree);
    tree = insertChild(arrayType, anyType, tree);
    tree = insertChild(dateType, anyType, tree);
    tree = insertChild(numberListType, arrayType, tree);
    tree = insertChild(stringType, arrayType, tree);
    return tree;
}

export function newSimpleType(name: string): SimpleType {
    return {
        kind: "SimpleType",
        name: {
            repr: name,
            location: NullTokenLocation()
        },
        nullable: false
    };
}

export function newListType(arrayOfWhat: TypeExpression): CompoundType {
    return {
        name: {
            repr: "List",
            location: NullTokenLocation()
        },
        kind: "CompoundType" ,
        of: {
            current: arrayOfWhat,
            next: null
        },
        nullable: false
    };
}
