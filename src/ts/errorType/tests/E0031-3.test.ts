import { testError } from "../../tests/testUtil";

testError("ErrorUnimplementedFunction", 
`
def group SyntaxNode

def group Expression

def Expression is SyntaxNode

def (this T).toJS -> String
    if T is SyntaxNode

def Addition
    :left   Number
    :right  Number

def Addition is Expression


`);
// Error because Addition did not implement the .toJS method