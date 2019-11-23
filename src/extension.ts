'use strict';
import * as vscode from 'vscode';

import { Manager } from './components/manager';
import { Commander } from './components/commander';
import { Logger } from './components/logger';
import { EnvStatusItem } from './components/envStatusItem';
import { Project } from './components/project';


/*
 * TODO:
 * - change environment via property
 * - gradle commands
 *   - parse output and show error in file
 *
 */

export function activate(context: vscode.ExtensionContext) {
    console.log("vsc-niagara activated");
    const logger = new Logger(context);
    const manager = new Manager();
    const commander = new Commander(logger);
    const environemnt = new EnvStatusItem();

    const project = new Project(context);

    manager.checkProjectVersion().then((version) => {
        if (version) {
            project.version = version;
            environemnt.updateItem(project);
        }
        else {
            console.log("couldn't fond version [" + version + "]" );
        }
    });


    vscode.commands.registerCommand("vsc-niagara.build", () => {
        logger.addExtensionMessage("execute build action");
        commander.build();
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

    vscode.commands.registerCommand("vsc-niagara.openBuildPanel", () => {
        logger.buildLogPanel.show();
    });

    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(() => {
        console.log("activ editor has changed");
        manager.findProjectRoot().then((root) => {
           console.log("found root folder: " + root);
        });
        manager.checkProjectVersion().then(() => {
            console.log("check of Niagara Version");

        });
    }));



}

export function deactivate() {
    console.log("vsc-niagara deactivated");
}
