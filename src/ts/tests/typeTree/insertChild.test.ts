import {expect} from "chai";
import {insertChild, newArrayType, newSimpleType, newTypeTree} from "../../typeTree";

describe("insertChild", () => {
    it("case 1", () => {
        const objectType = newSimpleType("Object");
        const arrayType = newArrayType(objectType);
        const initTree = newTypeTree(objectType);
        const newTree = insertChild(arrayType, /*as child of*/ objectType, /*in*/ initTree);
        const expected = {
            current: {
                kind: "SimpleType",
                name: {
                    repr: "Object",
                    location: null
                },
                nullable: false
            },
            children: [
                {
                    current: {
                        kind: "ArrayType",
                        arrayOf: {
                            kind: "SimpleType",
                            name: {
                                repr: "Object",
                                location: null
                            },
                            nullable: false
                        },
                        nullable: false
                    },
                    children: []
                }
            ]
        };
        expect(newTree)
            .to
            .deep
            .eq(expected);
    });

    it("case 2", () => {
        const objectType = newSimpleType("Object");
        const arrayType = newArrayType(objectType);
        const numberType = newSimpleType("Number");
        const numberArrayType = newArrayType(numberType);
        let tree = newTypeTree(objectType);
        tree = insertChild(arrayType, objectType, tree);
        tree = insertChild(numberArrayType, arrayType, tree);
        const expected = {
            current: {
                kind: "SimpleType",
                name: {
                    repr: "Object",
                    location: null
                },
                nullable: false
            },
            children: [
                {
                    current: {
                        kind: "ArrayType",
                        arrayOf: {
                            kind: "SimpleType",
                            name: {
                                repr: "Object",
                                location: null
                            },
                            nullable: false
                        },
                        nullable: false
                    },
                    children: [
                        {
                            current: {
                                kind: "ArrayType",
                                arrayOf: {
                                    kind: "SimpleType",
                                    name: {
                                        repr: "Number",
                                        location: null
                                    },
                                    nullable: false
                                },
                                nullable: false
                            },
                            children: []
                        }
                    ]
                }
            ]
        };
        expect(tree).to.deep.eq(expected);
    });

});
