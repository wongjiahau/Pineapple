import {expect} from "chai";
import { BindingNode } from "../../interpreter";
import {parser} from "./imported";

describe("assignment expression", () => {
    it("typeless", () => {
        const expected: BindingNode = {
            kind: "Binding",
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
        expect(parser.parse("let x=2").current).to.deep.eq(expected);
    });

    it("typeed", () => {
        const expected: BindingNode = {
            kind: "Binding",
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
        expect(parser.parse("let x:number=2").current).to.deep.eq(expected);
    });

});
