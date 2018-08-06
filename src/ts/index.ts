import { removeProperty } from "./pine2js";
import { preprocess } from "./preprocess";

const Parser = require("tree-sitter");
// const Parser = require('/home/hou32hou/Repos/node-tree-sitter/index')
const language = require("../build/Release/tree_sitter_pineapple_binding.node");
// const JavaScript = require('tree-sitter-arithmetic');
const parser = new Parser();
parser.setLanguage(language);

const sourceCode =
`
def .main
    [1 2].(0:1)
    x.show

def .toString
    pass
`;
console.log(preprocess(sourceCode));
const tree = parser.parse(preprocess(sourceCode));
console.log(tree.rootNode.toString());
// console.log(tree.rootNode);
// console.log(tree.rootNode.children[0].children);
// console.log(tree.rootNode.child(1));

// const nodes = tree.rootNode.children.map((x) => jsonify(x, x.type, combinePosition(x.startPosition, x.endPosition)));
// console.log(JSON.stringify(removeProperty(nodes, "position"), null, 2));

const nodes = tree.rootNode.children.map((x) => jsonifyV2(x));
console.log(JSON.stringify(removeProperty(removeProperty(nodes, "startPosition"), "endPosition"), null, 2));

interface Node {
    kind: string;
    position: WholePosition;
    repr: string;
}

interface TreeSitterNode {
    type: string;
    startPosition: Position;
    endPosition: Position;
    text: string;
    children: TreeSitterNode[];
}

function jsonifyV2(node: TreeSitterNode): TreeSitterNode {
    return {
        type: node.type,
        startPosition: node.startPosition,
        endPosition: node.endPosition,
        text: node.text,
        children:
        node.children
        .map((x) => jsonifyV2(x))
        .filter((x) => x.text.toLowerCase().indexOf(x.type.toLowerCase()) < 0)
    };
}

function jsonify(node: TreeSitterNode, nodeType: string, position: WholePosition): Node {
    if (node.children.length === 0) {
      return {
          kind: nodeType,
          position: position,
          repr: node.text
      };
    } else if (node.children.length === 1) {
      return {
          kind: nodeType,
          position: position,
          repr: node.text
      };
    }
    const result = {
        kind: nodeType
    };
    for (let i = 0; i < node.children.length; i++) {
        const c = node.children[i];
        const nodeId = c.type;
        const currentTree = jsonify(c, nodeId, combinePosition(c.startPosition, c.endPosition));
        if (currentTree.repr  && currentTree.repr.toLowerCase().indexOf(currentTree.kind.toLowerCase()) > -1) {
            continue;
        }
        if (result[nodeId] === undefined) {
            result[nodeId] = currentTree;
        } else if (isArray(result[nodeId])) {
            result[nodeId].push(currentTree);
        } else {
            const previousTree = result[nodeId];
            result[nodeId] = [previousTree, currentTree];
        }
    }
    return result;
}

function isArray<T>(xs: T[]) {
    return xs.length !== undefined;
}

interface Position {
    row: number;
    column: number;
}

interface WholePosition {
    rowStart: number;
    rowEnd: number;
    columnStart: number;
    columnEnd: number;
}
function combinePosition(startPosition: Position, endPosition: Position): WholePosition {
    return {
        rowStart: startPosition.row,
        rowEnd: endPosition.row,
        columnStart: startPosition.column,
        columnEnd: endPosition.column
    };
}
