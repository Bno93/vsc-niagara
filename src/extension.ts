'use strict';
import * as vscode from 'vscode';

import { Manager } from './components/manager';
import { Commander } from './commander';
import { Logger } from './components/logger';


/*
 *TODO:
 *- gradle commands
 *  - parse output and show error in file
 * 
 */

export function activate(context: vscode.ExtensionContext) {
    console.log("vsc-niagara activated");
    const logger = new Logger();
    const manager = new Manager();
    const commander = new Commander(logger);

    manager.findProjectRoot();
    
    vscode.commands.registerCommand("vsc-niagara.build", () => {
        commander.buildNX();
    });
    vscode.commands.registerCommand("vsc-niagara.slotomatic", () => {
        commander.slotomatic();
    });
    vscode.commands.registerCommand("vsc-niagara.clean", () => {
        commander.clean();
    });
    vscode.commands.registerCommand("vsc-niagara.moduleTestJar", () => {
        commander.moduleTestJar();
    });

    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(() => {
        console.log("activ editor has changed");
        manager.findProjectRoot().then((root) => {
           console.log("found root folder: " + root);
        });
    }));

}

export function deactivate() {
    console.log("vsc-niagara deactivated");
    
}