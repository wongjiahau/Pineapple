import { testTranspile } from "../../../testUtil";

testTranspile("subtyping",
`
def group Animal

def Dog
    :name String

def Dog is Animal

def Human
    :pet Animal

def ().main
    let x = Human 
        :pet = Dog 
            :name = "Bobby"
`,
`
$$GROUP$$["Animal"] = [];

function _main_(){
const $x = {
$kind: "Human",
pet : {
$kind: "Dog",
name : "Bobby",
},
};
}
`);
