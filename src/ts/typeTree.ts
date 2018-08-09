import {
    newAtomicToken,
    newSimpleType,
    NullTokenLocation,
    SimpleType,
    singleLinkedNode,
    StructDeclaration,
    TypeExpression
} from "./ast";

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
export function childOf(child: TypeExpression, parent: TypeExpression, tree: TypeTree): number | null {
    if (parent.kind === "SimpleType" && parent.name.repr === "Any") {
        return 1;
    }
    const matchingParent = findParentOf(child, tree);
    if (matchingParent === null) {
        return null;
    } else if (typeEquals(matchingParent, parent)) {
        return 1;
    } else {
        const score = childOf(matchingParent, parent, tree);
        if (score === null) {
            return score;
        } else {
            return 1 + score;
        }
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

export function includes(tree: TypeTree, t: TypeExpression): boolean {
    if (typeEquals(tree.current, t)) {
        return true;
    } else {
        return tree.children.some((x) => includes(x, t));
    }
}

export function initTypeTree(): TypeTree {
    const anyType        = newSimpleType("Any");
    const enumType       = EnumType();
    const objectType     = ObjectType();
    const dictType       = newSimpleType("Dict");
    const listType       = newListType(anyType);
    const numberType     = newSimpleType("Number");
    const stringType     = newSimpleType("String");
    const dateType       = newSimpleType("Date");
    let tree = newTypeTree(anyType);
    tree = insertChild(numberType, anyType, tree);
    tree = insertChild(enumType, anyType, tree);
    tree = insertChild(dictType, anyType, tree);
    tree = insertChild(objectType, dictType, tree);
    tree = insertChild(listType, anyType, tree);
    tree = insertChild(dateType, anyType, tree);
    tree = insertChild(stringType, listType, tree);
    return tree;
}

export function ObjectType(): SimpleType {
    return newSimpleType("Object");
}

export function EnumType(): SimpleType {
    return newSimpleType("Enum");
}

export function newListType(of: TypeExpression): StructDeclaration {
    return {
        kind: "StructDeclaration",
        members: null,
        name: newAtomicToken("List"),
        location: NullTokenLocation(),
        templates: singleLinkedNode(of),
        nullable: false
    };
}
