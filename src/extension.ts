'use strict';
import {ExtensionContext, commands, tasks, window, QuickPickItem, Disposable} from 'vscode';

import * as fs from 'fs';
import { Manager } from './components/manager';
import { Commander } from './components/commander';
import { Logger } from './components/logger';
import { EnvStatusItem } from './components/envStatusItem';
import { Project } from './components/project';
import { BuildTaskProvider } from './providers/task/build';


/*
 * TODO:
 * - change environment via property
 * - gradle commands
 *   - parse output and show error in file
 *
 */

 let buildTaskProvider: Disposable | undefined;

export function activate(context: ExtensionContext) {
    const logger = Logger.getInstance(context);
    const project = new Project(context, logger);
    const manager = new Manager();
    const commander = new Commander(logger, project);
    const environemnt = new EnvStatusItem();

    logger.addExtensionMessage("vsc-niagara activated");

    manager.checkProjectVersion().then((version) => {
        if (version) {
            project.version = version;
            environemnt.updateItem(project);
        }
        else {
            logger.addExtensionMessage("couldn't fond version [" + version + "]" );
        }
    });


    commands.registerCommand("vsc-niagara.build", () => {
        logger.addExtensionMessage("execute build action");
        commander.build();
    });
    commands.registerCommand("vsc-niagara.slotomatic", () => {
        commander.slotomatic();
    });
    commands.registerCommand("vsc-niagara.clean", () => {
        commander.clean();
    });
    commands.registerCommand("vsc-niagara.moduleTestJar", () => {
        commander.moduleTestJar();
    });

    commands.registerCommand("vsc-niagara.openBuildPanel", () => {
        logger.buildLogPanel.show();
    });

    commands.registerCommand("vsc-niagara.chooseEnvironment", () => {
        const envQuickPick = window.createQuickPick();
        const basedir = "C:\\Niagara\\";
        fs.readdirSync(basedir).forEach(folder => {
            logger.addExtensionMessage(folder);
            envQuickPick.items = envQuickPick.items.concat(new EnvPickItem(folder, basedir + folder))
        });

        envQuickPick.show();
    });


    buildTaskProvider = tasks.registerTaskProvider(BuildTaskProvider.BuildType, new BuildTaskProvider());

    context.subscriptions.push(window.onDidChangeActiveTextEditor(() => {
        logger.addExtensionMessage("activ editor has changed");
        manager.findProjectRoot().then((root) => {
           logger.addExtensionMessage("found root folder: " + root);
        });
        manager.checkProjectVersion().then(() => {
            logger.addExtensionMessage("check of Niagara Version");

        });
    }));



}

export function deactivate() {
    console.log("vsc-niagara deactivated");

    if (buildTaskProvider) {
        buildTaskProvider.dispose();
    }
}




class EnvPickItem implements QuickPickItem {
    label: string;    description?: string | undefined;
    detail?: string | undefined;
    path : string;
    constructor(label : string, path: string) {
        this.label = label;
        this.path = path;
        this.detail = path;
    }
}
