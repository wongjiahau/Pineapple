import { expect } from "chai";
import { hasVerticalRelationship, insertChild, newTree } from "../../typeTree";

const stringComparer = (x: string, y: string) => x === y;
describe("has relationship", () => {
    it("positive case", () => {
        let tree = newTree("any");
        tree = insertChild("number", "any", tree, stringComparer);
        tree = insertChild("int", "number", tree, stringComparer);
        expect(hasVerticalRelationship("int", "number", tree, stringComparer)).to.eq(true);
        expect(hasVerticalRelationship("number", "int", tree, stringComparer)).to.eq(true);

    });

    it("negative case", () => {
        let tree = newTree("any");
        tree = insertChild("number", "any", tree, stringComparer);
        tree = insertChild("int", "number", tree, stringComparer);
        tree = insertChild("string", "any", tree, stringComparer);
        expect(hasVerticalRelationship("string", "number", tree, stringComparer)).to.eq(false);
        expect(hasVerticalRelationship("string", "int", tree, stringComparer)).to.eq(false);
    });

});
