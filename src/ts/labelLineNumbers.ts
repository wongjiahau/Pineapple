export function labelLineNumbers(input: string, pointingWhichLine: number): string {
    let result = "";
    let lines = input.split("\n");
    const numberOfSpaces = (lines.length + 1).toString().length;
    const startLine = (pointingWhichLine - 5) > 0 ? (pointingWhichLine - 5) : 0;
    const endLine = pointingWhichLine + 5 >= lines.length ? lines.length : pointingWhichLine + 5;
    lines = lines.slice(startLine, endLine);
    for (let i = 0; i < lines.length; i++) {
        // tslint:disable-next-line:max-line-length
        let line = `| ${justifyLeft((i + 1 + startLine).toString(), numberOfSpaces)} | ${lines[i]}`;
        line = line.trimRight() + "\n";
        if (pointingWhichLine - startLine - 1 === i) {
            line = "    ERROR >>" + line;
        } else {
            line = "            " + line;
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
