import {ArrayType, SimpleType, TypeExpression} from "./ast";
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
    const objectType = newSimpleType("Object");
    const arrayType = newArrayType(objectType);
    const numberType = newSimpleType("Number");
    const numberArrayType = newArrayType(numberType);
    let tree = newTypeTree(objectType);
    tree = insertChild(arrayType, objectType, tree);
    tree = insertChild(numberArrayType, arrayType, tree);
    return tree;
}

export function newSimpleType(name: string): SimpleType {
    return {
        kind: "SimpleType",
        name: {
            repr: name,
            location: null
        },
        nullable: false
    };
}

export function newArrayType(arrayOfWhat: TypeExpression): ArrayType {
    return {
        kind: "ArrayType" ,
        arrayOf: arrayOfWhat,
        nullable: false
    };
}
