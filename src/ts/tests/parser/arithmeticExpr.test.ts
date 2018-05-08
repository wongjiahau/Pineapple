import {expect} from "chai";
import * as mocha from "mocha";
import {BinaryOperatorNode, NumberNode, UnaryOperatorNode} from "../../interpreter";
import {parser} from "./imported";

describe("arithmetic expressions", () => {
    it("number", () => {
        const expected: NumberNode = { kind: "Number", value: 123.999 };
        expect(parser.parse("123.999")).to.deep.eq(expected);
    });

    it("plus", () => {
        const result = parser.parse("1+1");
        const expected: BinaryOperatorNode = {
            kind: "BinaryOperator",
            left: {
                kind: "Number",
                value: 1
            },
            operator: "+",
            right: {
                kind: "Number",
                value: 1
            }
        };
        expect(result)
            .to
            .deep
            .eq(expected);
    });

    it("minus", () => {
        const result = parser.parse("1-1");
        const expected: BinaryOperatorNode = {
            kind: "BinaryOperator",
            left: {
                kind: "Number",
                value: 1
            },
            operator: "-",
            right: {
                kind: "Number",
                value: 1
            }
        };
        expect(result)
            .to
            .deep
            .eq(expected);
    });

    it("multiply", () => {
        const result = parser.parse("1*1");
        const expected: BinaryOperatorNode = {
            kind: "BinaryOperator",
            left: {
                kind: "Number",
                value: 1
            },
            operator: "*",
            right: {
                kind: "Number",
                value: 1
            }
        };
        expect(result)
            .to
            .deep
            .eq(expected);
    });

    it("divide", () => {
        const result = parser.parse("1/1");
        const expected: BinaryOperatorNode = {
            kind: "BinaryOperator",
            left: {
                kind: "Number",
                value: 1
            },
            operator: "/",
            right: {
                kind: "Number",
                value: 1
            }
        };
        expect(result)
            .to
            .deep
            .eq(expected);
    });

    it("modulus", () => {
        const result = parser.parse("1%1");
        const expected: BinaryOperatorNode = {
            kind: "BinaryOperator",
            left: {
                kind: "Number",
                value: 1
            },
            operator: "%",
            right: {
                kind: "Number",
                value: 1
            }
        };
        expect(result)
            .to
            .deep
            .eq(expected);
    });

    it("unary plus", () => {
        const expected: UnaryOperatorNode = {
            kind: "UnaryOperator",
            operator: "+",
            inner: {
                kind: "Number",
                value: 1
            }
        };
        expect(parser.parse("+1")).deep.eq(expected);
    });

    it("unary minus", () => {
        const expected: UnaryOperatorNode = {
            kind: "UnaryOperator",
            operator: "-",
            inner: {
                kind: "Number",
                value: 1
            }
        };
        expect(parser.parse("-1")).deep.eq(expected);
    });

});
