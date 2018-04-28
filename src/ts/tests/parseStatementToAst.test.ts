import { expect } from "chai";
import {IStatement, newStatement} from "../groupStatements";
import {ExpressionNode} from "../interpreter";
import {parseStatementToAst} from "../parseStatementToAst";

describe("parseStatementToAst", () => {
  it("case 1", () => {
    const input: IStatement = newStatement(0, "myFruit:any=", [
      newStatement(1, ".name='pine'"),
      newStatement(1, ".sibling=",
        [newStatement(2, ".price=123")
      ]),
      newStatement(1, ".name='durian'")
    ]);
    const expected: ExpressionNode = {
      kind: "Assignment",
      variableNode: {
        kind: "VariableName",
        name: "myFruit"
      },
      dataType: "any",
      expression: {
        kind: "Object",
        memberNode: {
          kind: "ObjectMember",
          name: ".name",
          expression: {
            kind: "String",
            value: "pine"
          },
          next: {
            kind: "ObjectMember",
            name: ".sibling",
            expression: {
              kind: "Object",
              memberNode: {
                kind: "ObjectMember",
                name: ".price",
                expression: {
                  kind: "Number",
                  value: 123
                },
                next: null
              }
            },
            next: {
              kind: "ObjectMember",
              name: ".name",
              expression: {
                kind: "String",
                value: "durian"
              },
              next: null
            }
          }
        }
      }
    };

    const result = parseStatementToAst(input);
    expect(result).to.deep.eq(expected);
  });
});
