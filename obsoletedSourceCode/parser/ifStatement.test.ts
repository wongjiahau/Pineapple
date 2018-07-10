import {expect} from "chai";
import {parser} from "./imported";

describe("if statement", () => {
    it("case 1", () => {
        const input = `
if true
    x <- 5
`;
        const result = parser.parse(input);
        expect(result).to.deep.eq({
                kind: "CompoundStatement",
                current: {
                    kind: "If",
                    condition: {
                        kind: "Boolean",
                        value: true },
                    body: {
                        kind: "CompoundStatement",
                        current: {
                            kind: "Assignment",
                            variableNode: {
                                kind: "VariableName",
                                name: "x" },
                            dataType: null,
                            expression: {
                                kind: "Number",
                                value: 5 }},
                        next: null},
                    else : null },
                next: null
            });
    });

});
