export function labelNewlines(input: string): string {
    return input.replace(/\n/g, "@NEWLINE\n");
}
