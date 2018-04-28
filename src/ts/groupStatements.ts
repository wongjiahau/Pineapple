export interface IStatement {
    indentLevel: number; // How many tabs
    content: string;
    children: IStatement[];
}

export function newStatement(
    indentLevel: number,
    content: string,
    children: IStatement[] = []): IStatement {
    return { indentLevel, content, children};
}

export function groupStatements(statements: IStatement[]): IStatement[] {
    const result: IStatement[] = [];
    for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i];
        const children: IStatement[] = [];
        for (let j = i + 1; j < statements.length; j++) {
            if (statements[j].indentLevel <= stmt.indentLevel) {
                break;
            }
            children.push(statements[j]);
            i++;
        }
        stmt.children = groupStatements(children);
        result.push(stmt);
    }
    return result;
}
