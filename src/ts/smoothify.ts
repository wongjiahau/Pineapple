/**
 * This function is to smoothify the input so that it will be easier parse
 * @param input
 */
export function smoothify(input: string): string {
    return input
        .replace(/\{\./g, "{ .")
        .replace(/(\r\n\t|\n|\r\t)/gm, " ");

}
