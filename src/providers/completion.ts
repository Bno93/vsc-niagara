import * as vscode from 'vscode';
import {ModuleInclude} from './completer/moduleInclude';

export class Completer implements vscode.CompletionItemProvider {
    moduleInclude: ModuleInclude;


    constructor() {
        this.moduleInclude = new ModuleInclude();
    }

    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
        return new Promise((resolve, _reject) => {

        });
    }

}
