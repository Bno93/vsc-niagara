import * as vscode from 'vscode';
import * as path from 'path';
import { Manager } from './manager';
import { Logger } from './logger';
import { Build } from './commands/build';
import { SlotomaticWrapper } from "./commands/slotomatic";
import { Project } from './project';
import { CommandHandler } from './command_handler';
import { Niagara } from './niagara';


export class Commander {
    logger: Logger;
    manager: Manager;
    builder: Build;
    slotomaticWrapper: SlotomaticWrapper;
    project: Project;



    constructor(logger: Logger, project: Project) {
        this.logger = logger;
        this.manager = new Manager();
        this.builder = new Build(this.logger, this.manager);
        this.slotomaticWrapper = new SlotomaticWrapper(this.logger, this.manager);
        this.project = project;
    }


    async build() {
        await this.manager.checkProjectVersion();
        this.logger.addExtensionMessage("build for " + this.manager.niagara_version);
        let rootFolder =  "";
        let root = await this.manager.findProjectRoot();



        if (Array.isArray(root)) {
            rootFolder = await vscode.window.showQuickPick(root.map(element => {
                const label = path.basename(element);
                console.log(`make option wiht label:${label} and description: ${element}`);
                return {
                    label: '$(folder) ' + label,
                    description: element
                }
            })).then(selection => {
                return selection?.description as string;
            });
        }
        else {
            rootFolder = root as string;
        }

        if (rootFolder === undefined) {
            return;
        }

        switch (this.manager.niagara_version) {
            case Niagara.NiagaraVersion.N4:
                this.builder.n4(rootFolder);
                break;
            case Niagara.NiagaraVersion.AX:
                this.builder.ax(rootFolder);
                break;
            default:
                this.logger.addBuildLogMessage("fail to run build is ether no N3 or N4 project");
                break;
        }
    }


    async slotomatic() {
        await this.manager.checkProjectVersion();
        this.logger.addExtensionMessage("slotomatic for " + this.manager.niagara_version);

        let rootFolder =  "";
        let root = await this.manager.findProjectRoot();

        if (Array.isArray(root)) {
            rootFolder = await vscode.window.showQuickPick(root).then(selection => {return selection as string;});
        }
        else {
            rootFolder = root as string;
        }
        switch (this.manager.niagara_version) {
            case Niagara.NiagaraVersion.N4:
                this.slotomaticWrapper.n4(rootFolder);
                break;
            case Niagara.NiagaraVersion.AX:
                this.slotomaticWrapper.ax(rootFolder);
                break;
            case Niagara.NiagaraVersion.UNDEFINED:
            default:
                this.logger.addBuildLogMessage("fail to run slotomatic is ether no N3 or N4 project");
                break;
        }
    }

    async clean() {
        this.logger.addBuildLogMessage("clean project ...");
        let rootFolder =  "";
        let root = await this.manager.findProjectRoot();

        if (Array.isArray(root)) {
            rootFolder = await vscode.window.showQuickPick(root.map(element => {
                return {
                    label: element.split("\\")[-1],
                    description: element
                }
            })).then(selection => {return selection?.description as string;});
        }
        else {
            rootFolder = root as string;
        }

        if (rootFolder) {

            this.logger.showSpiningStatusItem("clean...");
            const configuration = vscode.workspace.getConfiguration("vsc-niagara");
            const useGradleW = configuration.get("build.nx.gradlew") as boolean;
            let cmd = ""
            if (useGradleW) {
                cmd = "gradlew clean";

            } else {
                cmd = "gradle clean";
            }
            this.logger.addExtensionMessage("execute: " + cmd + " in " + rootFolder);
            CommandHandler.runCommand(cmd, rootFolder, this.logger);
        }
        else {
            this.logger.addBuildLogMessage("root folder not found");
            this.logger.showErrorStatusItem();
            vscode.window.showErrorMessage("root folder not found");
        }

    }


    async moduleTestJar() {

        this.logger.addBuildLogMessage("run moduleTestJar ...");
        let rootFolder =  "";
        let root = await this.manager.findProjectRoot();

        if (Array.isArray(root)) {
            rootFolder = await vscode.window.showQuickPick(root).then(selection => {return selection as string;});
        }
        else {
            rootFolder = root as string;
        }

        if (rootFolder) {
            this.logger.showSpiningStatusItem("build TestJar...");

            const configuration = vscode.workspace.getConfiguration("vsc-niagara");
            const useGradleW = configuration.get("build.nx.gradlew") as boolean;
            let cmd = ""
            if (useGradleW) {
                cmd = "gradlew moduleTestJar";

            } else {
                cmd = "gradle moduleTestJar";
            }

            console.log("execute: " + cmd + " in " + rootFolder);
            CommandHandler.runCommand(cmd, rootFolder, this.logger);

        }
        else {
            this.logger.addBuildLogMessage("root folder not found");
            this.logger.showErrorStatusItem();
            vscode.window.showErrorMessage("root folder not found");
        }
    }
}
