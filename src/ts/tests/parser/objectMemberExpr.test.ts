import {expect} from "chai";
import {ObjectMemberNode} from "../../interpreter";
import {parser} from "./imported";

describe.skip("object member expresion", () => {
    it("typeless assignment", () => {
        const expected: ObjectMemberNode = {
            kind: "ObjectMember",
            name: ".name",
            expression: {
                kind: "Number",
                value: 5
            },
            next: null,
            type: "assignment",
            dataType: null
        };
        expect(parser.parse(" .name<-5")).to.deep.eq(expected);
    });

    it("typeless binding", () => {
        const expected: ObjectMemberNode = {
            kind: "ObjectMember",
            name: ".name",
            expression: {
                kind: "Number",
                value: 5
            },
            next: null,
            type: "binding",
            dataType: null
        };
        expect(parser.parse(" .name=5")).to.deep.eq(expected);
    });

});
