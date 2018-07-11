export function labelLineNumbers(input: string, pointingWhichLine: number): string {
    let result = "";
    const lines = input.split("\n");
    for (let i = 0; i < lines.length; i++) {
        let line = `| ${justifyLeft((i + 1).toString(), (lines.length + 1).toString().length)} | ${lines[i]}`;
        line = line.trimRight() + "\n";
        if (pointingWhichLine - 1 === i) {
            line = "ERROR >>> " + line;
        } else {
            line = "          " + line;
        }
        result += line;
    }
    return result;
}

function justifyLeft(input: string, numberOfSpaces: number): string {
    let result = input;
    for (let i = input.length; i < numberOfSpaces; i++) {
       result = " " + result;
    }
    return result;
}
