import { expect } from "chai";
import { insertChild, newTree, verticalDistance } from "../../typeTree";

const stringComparer = (x: string, y: string) => x === y;
describe("has relationship", () => {
    it("positive case", () => {
        let tree = newTree("any");
        tree = insertChild("number", "any", tree, stringComparer);
        tree = insertChild("int", "number", tree, stringComparer);
        expect(verticalDistance("int", "number", tree, stringComparer)).to.eq(1);
        expect(verticalDistance("number", "int", tree, stringComparer)).to.eq(1);
        expect(verticalDistance("number", "number", tree, stringComparer)).to.eq(0);

    });

    it("negative case", () => {
        let tree = newTree("any");
        tree = insertChild("number", "any", tree, stringComparer);
        tree = insertChild("int", "number", tree, stringComparer);
        tree = insertChild("string", "any", tree, stringComparer);
        expect(verticalDistance("string", "number", tree, stringComparer)).to.eq(null);
        expect(verticalDistance("string", "int", tree, stringComparer)).to.eq(null);
    });

});
