'use strict';
import { ExtensionContext, commands, tasks, window, Disposable, languages } from 'vscode';

import { Manager } from './components/manager';
import { Commander } from './components/commander';
import { Logger } from './components/logger';
import { EnvStatusItem } from './components/envStatusItem';
import { Project } from './components/project';
import { BuildTaskProvider } from './providers/task/build';
import { checkDocument } from './handler/diagnostic_handler';

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
    const project = new Project(logger);
    const manager = new Manager();
    const commander = new Commander(logger, project);
    const environemnt = new EnvStatusItem();
    const collection = languages.createDiagnosticCollection('vsc-niagara');

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


    buildTaskProvider = tasks.registerTaskProvider(BuildTaskProvider.BuildType, new BuildTaskProvider());


    context.subscriptions.push(window.onDidChangeActiveTextEditor(editor => {

        if (editor) {
            checkDocument(editor.document, collection);
        }

        logger.addExtensionMessage("active editor has changed");
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
