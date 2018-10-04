'use strict';
import * as vscode from 'vscode';

import { Manager } from './components/manager';
import { Commander } from './commander';

export function activate(context: vscode.ExtensionContext) {
    console.log("extention activation");
    const commander = new Commander();
    const manager = new Manager();
    
    vscode.commands.registerCommand("vsc-niagara.open-console", () =>
      commander.openConsole()
    );

    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(() => {
        console.log("activ editor has changed");
        let roots = manager.findProjectRoot();

        console.log(roots);
        
    }));

}

export function deactivate() {
    console.log("extention deactivation");
    
}