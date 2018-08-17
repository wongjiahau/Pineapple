import { expect } from "chai";
import { flattenTree, insertChild, newTree } from "../../typeTree";
import { numberComparer } from "../testUtil";

describe("flattenTree", () => {
    it("case 1", () => {
        let tree = newTree(1);
        tree = insertChild(2, 1, tree, numberComparer);
        tree = insertChild(3, 1, tree, numberComparer);
        tree = insertChild(4, 1, tree, numberComparer);
        tree = insertChild(5, 2, tree, numberComparer);
        tree = insertChild(6, 5, tree, numberComparer);
        const result = flattenTree(tree);
        expect(result.sort()).to.deep.eq([1, 2, 3, 4, 5, 6]);
    });
});
