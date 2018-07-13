import {expect} from "chai";
import {findParentOf, insertChild, newSimpleType, newTypeTree} from "../../typeTree";

describe("find parent of", () => {
    it("case 1", () => {
        const objectType = newSimpleType("Object");
        const numberType = newSimpleType("Number");
        const initTree = newTypeTree(objectType);
        const newTree = insertChild(numberType, /*as child of*/ objectType, /*in*/ initTree);
        const result = findParentOf(numberType, /*in*/ newTree);
        expect(result).to.deep.eq(objectType);
    });

    it("case 2", () => {
        const objectType = newSimpleType("Object");
        const nullType = newSimpleType("Null");
        const initTree = newTypeTree(objectType);
        const result = findParentOf(nullType, /*in*/ initTree);
        expect(result).to.deep.eq(null);
    });

    it("case 3", () => {
        const objectType = newSimpleType("Object");
        const numberType = newSimpleType("Number");
        const rationalType = newSimpleType("Rational");
        let tree = newTypeTree(objectType);
        tree = insertChild(numberType, /*as child of*/ objectType, /*in*/ tree);
        tree = insertChild(rationalType, /*as child of*/ numberType, /*in*/ tree);
        const result = findParentOf(rationalType, /*in*/ tree);
        expect(result).to.deep.eq(numberType);
    });
});
