import { expect } from "chai";
import { groupStatements, IStatement, newStatement } from "./../groupStatements";

describe("groupStatements", () => {
    it("case 1", () => {
        const inputStatements: IStatement[] = [
            newStatement(0, "if hello"),
            newStatement(1, "print yo"),
            newStatement(0, "else"),
            newStatement(1, "print bye"),
            newStatement(1, "if saymorebye"),
            newStatement(2, "byebye"),
        ];
        const expected: IStatement[] = [
            newStatement(0, "if hello", [
                newStatement(1, "print yo"),
            ]),
            newStatement(0, "else", [
                newStatement(1, "print bye"),
                newStatement(1, "if saymorebye", [
                    newStatement(2, "byebye"),
                ]),
            ]),
        ];
        const result = groupStatements(inputStatements);
        expect(result).to.deep.eq(expected);
    });

    it("case 2", () => {
        const inputStatements: IStatement[] = [
            newStatement(0, "myFruit="),
            newStatement(1, ".price=123"),
            newStatement(1, ".sibling="),
            newStatement(2, ".price='456'"),
            newStatement(1, ".name='pine'"),
            newStatement(0, "x=5"),
        ];
        const expected: IStatement[] = [
            newStatement(0, "myFruit=", [
                newStatement(1, ".price=123"),
                newStatement(1, ".sibling=", [
                    newStatement(2, ".price='456'"),
                ]),
                newStatement(1, ".name='pine'"),
            ]),
            newStatement(0, "x=5"),
        ];
        const result = groupStatements(inputStatements);
        expect(result).to.deep.eq(expected);

    });
});
