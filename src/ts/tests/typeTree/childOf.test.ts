import {expect} from "chai";
import {
    childOf,
    insertChild,
    newTree
} from "../../typeTree";
import { numberComparer } from "../testUtil";

describe("childOf", () => {
    it("distance 1", () => {
        let tree = newTree(1);
        tree = insertChild(2, /*asChildOf*/ 1, /*in*/ tree, numberComparer);
        const distance = childOf(2, 1, tree, numberComparer);
        expect(distance).eq(1);
    });

    it("distance 2", () => {
        let tree = newTree(1);
        tree = insertChild(2, /*asChildOf*/ 1, /*in*/ tree, numberComparer);
        tree = insertChild(3, /*asChildOf*/ 2, /*in*/ tree, numberComparer);
        const distance = childOf(3, 1, tree, numberComparer);
        expect(distance).eq(2);
    });

    it("null distance", () => {
        let tree = newTree(1);
        tree = insertChild(4, /*asChildOf*/ 1, /*in*/ tree, numberComparer);
        tree = insertChild(2, /*asChildOf*/ 1, /*in*/ tree, numberComparer);
        const distance = childOf(4, 2, tree, numberComparer);
        expect(distance).eq(null);
    });
});
