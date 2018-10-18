'use strict';
import * as vscode from 'vscode';

import { Manager } from './components/manager';
import { Commander } from './commander';


/*
 *TODO:
 *- gradle commands
 *  - build, clean, solotmatic
 *  - parse output and show error in file
 * 
 */

export function activate(context: vscode.ExtensionContext) {
    console.log("extention activation");
    const manager = new Manager();
    const commander = new Commander();

    manager.findProjectRoot();
    
    vscode.commands.registerCommand("vsc-niagara.open-console", () =>

        commander.openConsole()
    );

    vscode.commands.registerCommand("vsc-niagara.build", () => {
        commander.buildNX();
    });
    vscode.commands.registerCommand("vsc-niagara.slotomatic", () => {
        commander.slotomatic();
    });

    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(() => {
        console.log("activ editor has changed");
        manager.findProjectRoot().then((root) => {
           console.log("found root folder: " + root);
        });
    }));

}

export function deactivate() {
    console.log("extention deactivation");
    
}