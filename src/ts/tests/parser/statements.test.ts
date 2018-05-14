import { expect } from "chai";
import {parser} from "./imported";

describe("statements", () => {
    it("with enclosing brackets", () => {
        const input = "let x=5;let y=6";
        const result = parser.parse(input);
        expect(result).to.deep.eq({
            kind: "CompoundStatement",
            current: {
                kind: "Binding",
                variableNode: {
                    kind: "VariableName",
                    name: "x" },
                dataType: null,
                expression: {
                kind: "Number",
                value: 5 } },
            next: {
                kind: "CompoundStatement",
                current: {
                kind: "Binding",
                variableNode: {
                    kind: "VariableName",
                    name: "y" },
                dataType: null,
                expression: {
                    kind: "Number",
                    value: 6 } },
                next: null } }
        );

    });

    it("without enclosing brackets", () => {
        const input1 = "{let x=5;let y=6}";
        const input2 = "let x=5;let y=6";
        expect(parser.parse(input1)).to.deep.eq(parser.parse(input2));
    });

});
