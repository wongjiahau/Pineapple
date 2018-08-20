import { expect } from "chai";
import { findElement, insertChild, newTree } from "../../typeTree";
import { numberComparer } from "../testUtil";

describe("find", () => {
    it("positive test", () => {
        let tree = newTree(1);
        tree = insertChild(2, 1, tree, numberComparer);
        tree = insertChild(3, 1, tree, numberComparer);
        tree = insertChild(4, 1, tree, numberComparer);
        tree = insertChild(5, 2, tree, numberComparer);
        tree = insertChild(6, 5, tree, numberComparer);
        const result = findElement(tree, 6, numberComparer);
        expect(result).to.eq(6);
    });

    it("negative test", () => {
        let tree = newTree(1);
        tree = insertChild(2, 1, tree, numberComparer);
        tree = insertChild(3, 1, tree, numberComparer);
        tree = insertChild(4, 1, tree, numberComparer);
        tree = insertChild(5, 2, tree, numberComparer);
        tree = insertChild(6, 5, tree, numberComparer);
        const result = findElement(tree, 99, numberComparer);
        expect(result).to.eq(null);
    });
});
