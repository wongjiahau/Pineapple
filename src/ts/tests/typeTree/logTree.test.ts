import { expect } from "chai";
import { findParentOf, insertChild, logTree, newTree } from "../../typeTree";
import { assertEquals, numberComparer } from "../testUtil";

describe("logTree", () => {
    it("case 1", () => {
        let tree = newTree(1);
        tree = insertChild(2, 1, tree, numberComparer);
        tree = insertChild(3, 2, tree, numberComparer);
        tree = insertChild(4, 2, tree, numberComparer);
        tree = insertChild(5, 3, tree, numberComparer);
        tree = insertChild(6, 1, tree, numberComparer);
        const parent = findParentOf(3, tree, numberComparer);
        const result = logTree(tree, (x: number) => x.toString());
        const expected =
`
1
    2
        3
            5
        4
    6
`;
        assertEquals(result, expected);
    });

});
