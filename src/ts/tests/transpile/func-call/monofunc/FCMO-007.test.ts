import { testTranspile } from "../../../testUtil";

testTranspile("subtyped parameter",
`
def group Animal

def (this T).shout
    if T is Animal

def Cat
    :name   String

def Cat is Animal

def (this Cat).shout
    pass

def (this Animal).play
    this.shout

def ().main
    let x = Cat
        :name = "Hello"
    
    x.play
`,
`
$$GROUP$$["Animal"] = {};
$$GROUP$$["Animal"]["Cat"]=(_shout_Cat)

function _shout_Animal($this){
return $$GROUP$$["Animal"][$$typeof$$($this)]($this)
}

function _shout_Cat($this){
$$pass$$();
}

function _play_Animal($this){
_shout_Animal(
$this);
}

function _main_(){
const $x = {
$kind: "Cat",
name : "Hello",
};
_play_Animal(
$x);
}
`);
