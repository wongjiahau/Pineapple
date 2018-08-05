const Parser = require('tree-sitter');
// const Parser = require('/home/hou32hou/Repos/node-tree-sitter/index')
const language = require('./build/Release/tree_sitter_pineapple_binding.node');
// const JavaScript = require('tree-sitter-arithmetic');
const parser = new Parser();
parser.setLanguage(language);

const sourceCode = `def .main @NEWLINE @INDENT [1 2].(0:1) @NEWLINE @DEDENT`;
const tree = parser.parse(sourceCode);
console.log(tree.rootNode.toString());
// console.log(tree.rootNode);
// console.log(tree.rootNode.children[0].children);
// console.log(tree.rootNode.child(1));

const nodes = tree.rootNode.children.map((x) => jsonify(x, x.type))
// console.log(JSON.stringify(nodes, null, 2));


function jsonify(node /*SyntaxNode*/, nodeType /*string*/, position) {
    if(node.children.length === 0) {
        return {
            kind: nodeType,
            position: position,
            repr: node.text
        } 
    }
    const result = {
        kind: nodeType
    };
    for (let i = 0; i < node.children.length; i++) {
        const c = node.children[i];
        const nodeId = c.type;
        const currentTree = jsonify(c, nodeId, combinePosition(c.startPosition, c.endPosition));
        if(result[nodeId] === undefined) {
            result[nodeId] = currentTree;
        } else if(isArray(result[nodeId])) {
            result[nodeId].push(currentTree)
        } else {
            const previousTree = result[nodeId];
            result[nodeId] = [previousTree, currentTree];
        }
    }
    return result;
}

function isArray(xs) {
    return xs.length !== undefined;
}

function combinePosition(startPosition, endPosition) {
    return {
        rowStart: startPosition.row,
        rowEnd: endPosition.row,
        columnStart: startPosition.column,
        columnEnd: endPosition.column
    };
}