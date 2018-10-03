import { testTranspile } from "../../../testUtil";

testTranspile("will look for lowest common parent type (Execpt Any)",
`
def group Animal

def Cat
    :name String

def Dog
    :name String

def Cat is Animal
def Dog is Animal

def ().main
    let x = Dog
        :name = "Bibi"
    
    let y = Cat
        :name = "Cici"
    
    let z = [x, y]
`,
`

`);
