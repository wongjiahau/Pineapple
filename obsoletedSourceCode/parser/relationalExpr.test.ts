import { expect } from "chai";
import { BinaryOperatorNode } from "../../interpreter";
import {parser} from "./imported";

describe("relational expression", () => {
    it("greater than", () => {
        const expected: BinaryOperatorNode = {
            kind: "BinaryOperator",
            left: {
                kind: "Number",
                value: 1
            },
            operator: ">",
            right: {
                kind: "Number",
                value: 2
            }
        };
        expect(parser.parse("1>2").current).to.deep.eq(expected);
    });

    it("greater than or equals", () => {
        const expected: BinaryOperatorNode = {
            kind: "BinaryOperator",
            left: {
                kind: "Number",
                value: 1
            },
            operator: ">=",
            right: {
                kind: "Number",
                value: 2
            }
        };
        expect(parser.parse("1>=2").current).to.deep.eq(expected);
    });

    it("less than", () => {
        const expected: BinaryOperatorNode = {
            kind: "BinaryOperator",
            left: {
                kind: "Number",
                value: 1
            },
            operator: "<",
            right: {
                kind: "Number",
                value: 2
            }
        };
        expect(parser.parse("1<2").current).to.deep.eq(expected);
    });

    it("less than or equals", () => {
        const expected: BinaryOperatorNode = {
            kind: "BinaryOperator",
            left: {
                kind: "Number",
                value: 1
            },
            operator: "<=",
            right: {
                kind: "Number",
                value: 2
            }
        };
        expect(parser.parse("1<=2").current).to.deep.eq(expected);
    });

    it("equal", () => {
        const expected: BinaryOperatorNode = {
            kind: "BinaryOperator",
            left: {
                kind: "Number",
                value: 1
            },
            operator: "==",
            right: {
                kind: "Number",
                value: 2
            }
        };
        expect(parser.parse("1==2").current).to.deep.eq(expected);
    });

    it("not equal", () => {
        const expected: BinaryOperatorNode = {
            kind: "BinaryOperator",
            left: {
                kind: "Number",
                value: 1
            },
            operator: "!=",
            right: {
                kind: "Number",
                value: 2
            }
        };
        expect(parser.parse("1!=2").current).to.deep.eq(expected);
    });

});
