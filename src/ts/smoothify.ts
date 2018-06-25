/**
 * This function is to smoothify the input so that it will be easier parse
 * @param input
 */
export function smoothify(input: string): string {
    return input
        .replace(/(@NEWLINE)\s*(@NEWLINE)+/g, "@NEWLINE")
        .replace(/@NEWLINE\s*@EOF/g, "@EOF")
        ;

}
