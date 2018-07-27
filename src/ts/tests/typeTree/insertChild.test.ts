import {expect} from "chai";
import {prettyPrint} from "../../pine2js";
import {
    findParentOf,
    insertChild,
    newListType,
    newSimpleType,
    newTypeTree,
    TypeTree
} from "../../typeTree";

describe("insertChild", () => {
    it("case 1", () => {
        const objectType = newSimpleType("Object");
        const arrayType = newListType(objectType);
        const numberType = newSimpleType("Number");
        const numberListType = newListType(numberType);
        let tree = newTypeTree(objectType);
        tree = insertChild(arrayType, objectType, tree);
        tree = insertChild(numberListType, arrayType, tree);
        const parent = findParentOf(numberListType, tree);
        const expected  = {
            name: {
                repr: "List",
                location: null
            },
            kind: "CompoundType",
            of: {
                current: {
                    kind: "SimpleType",
                    name: {
                        repr: "Object",
                        location: null
                    },
                    nullable: false
                },
                next: null
            },
            nullable: false
        };

        expect(parent).deep.eq(expected);
    });

});
