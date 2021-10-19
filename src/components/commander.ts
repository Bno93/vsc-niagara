import * as vscode from 'vscode';
import { Manager, NiagaraVersion } from './manager';
import { Logger } from './logger';
import { Build } from './commands/build';
import { SlotomaticWrapper } from "./commands/slotomatic";
import { Project } from './project';
import { CommandHandler } from './command_handler';


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
        switch (this.manager.niagara_version) {
            case NiagaraVersion.N4:
                this.builder.n4();
                break;
            case NiagaraVersion.AX:
                this.builder.ax();
                break;

            default:
                this.logger.addBuildLogMessage("fail to run build is ether no N3 or N4 project");
                break;
        }
    }


    async slotomatic() {
        await this.manager.checkProjectVersion();
        this.logger.addExtensionMessage("slotomatic for " + this.manager.niagara_version);
        switch (this.manager.niagara_version) {
            case NiagaraVersion.N4:
                this.builder.n4();
                break;
            case NiagaraVersion.AX:
                this.builder.ax();
                break;
            case NiagaraVersion.UNDEFINED:
            default:
                this.logger.addBuildLogMessage("fail to run slotomatic is ether no N3 or N4 project");
                break;
        }
    }

    async clean() {
        let rootFolder = await this.manager.findProjectRoot() + "\\";
        this.logger.addBuildLogMessage("clean project ...");

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

        let rootFolder = await this.manager.findProjectRoot() + "\\";
        this.logger.addBuildLogMessage("run moduleTestJar ...");

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
