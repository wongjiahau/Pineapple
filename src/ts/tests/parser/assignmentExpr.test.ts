import {expect} from "chai";
import { AssignmentNode } from "../../interpreter";
import {parser} from "./imported";

describe("assignment expression", () => {
    it("typeless", () => {
        const expected: AssignmentNode = {
            kind: "Assignment",
            variableNode: {
                kind: "VariableName",
                name: "x"
            },
            dataType: null,
            expression: {
                kind: "Number",
                value: 2
            }
        };
        expect(parser.parse("x<-2")).to.deep.eq(expected);
    });

    it("typeed", () => {
        const expected: AssignmentNode = {
            kind: "Assignment",
            variableNode: {
                kind: "VariableName",
                name: "x"
            },
            dataType: "number",
            expression: {
                kind: "Number",
                value: 2
            }
        };
        expect(parser.parse("x:number<-2")).to.deep.eq(expected);
    });

});
