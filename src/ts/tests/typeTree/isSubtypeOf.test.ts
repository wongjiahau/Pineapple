import { expect } from "chai";
import { GroupDeclaration, newAtomicToken, NullTokenLocation, StructType } from "../../ast";
import { isSubtypeOf, typeEquals } from "../../fillUpTypeInformation";
import { insertChild, newBuiltinType, newTree } from "../../typeTree";

describe("isSubtypeOf", () => {
    it("case 1", () => {
        let tree = newTree(newBuiltinType(":any"));
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
                kind: "ThingDecl",
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
        tree = insertChild(animal, newBuiltinType(":any"), tree, typeEquals);
        tree = insertChild(cat, animal, tree, typeEquals);
        expect(isSubtypeOf(cat, animal, tree)).to.eq(true);
    });
});
