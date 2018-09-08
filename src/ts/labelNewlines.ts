export function labelNewlines(input: string): string {
    return input.replace(/\r?\n/g, "@NEWLINE\n");   
}

// Refer: https://stackoverflow.com/questions/21895233/how-in-node-to-split-string-by-newline-n