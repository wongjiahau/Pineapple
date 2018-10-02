import { expect } from 'chai';
import { TypeExpression, GroupDeclaration, newAtomicToken, NullTokenLocation, StructDeclaration, StructType } from "../../ast";
import { newTree, insertChild, newBuiltinType } from "../../typeTree";
import { typeEquals, isSubtypeOf } from "../../fillUpTypeInformation";

describe('isSubtypeOf', () => {;
    it("case 1", () => {
        let tree = newTree(newBuiltinType("Any"));
        const animal: GroupDeclaration = {
            kind: "GroupDeclaration",
            name: newAtomicToken("Animal"),
            nullable: false,
            location: NullTokenLocation(),
            bindingFunctions: []
        };

        const cat: StructType = {
            kind: "StructType",
            reference: {
                kind: "StructDeclaration",
                name: newAtomicToken("Cat"),
                members: [],
                genericList: [],
                location: NullTokenLocation(),
                originFile: ""
            },
            nullable: false,
            genericList: [],
            location: NullTokenLocation(),

        };
        tree = insertChild(animal, newBuiltinType("Any"), tree, typeEquals);
        tree = insertChild(cat, animal, tree, typeEquals);
        expect(isSubtypeOf(cat, animal, tree)).to.eq(true);
    }); 
});