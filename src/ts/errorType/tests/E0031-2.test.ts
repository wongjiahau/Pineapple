import { testError } from "../../tests/testUtil";

testError("ErrorUnimplementedFunction", 
`
def group Animal

def (this T).shout
    if T is Animal

def Cat
    :name String

def Cat is Animal

def (this Cat).isHappy
    pass

`);
// Error because Cat did not implement the .shout method