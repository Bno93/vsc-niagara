import * as vscode from 'vscode';
import { Manager } from "../manager";
import { Logger } from "../logger";

import * as path from 'path';
import { CommandHandler } from '../command_handler';

export class Build {

  manager: Manager;
  logger: Logger;


  constructor(logger: Logger, manager: Manager) {
    this.logger = logger;
    this.manager = manager;
  }

  async n4(rootFolder: string) {

    const configuration = vscode.workspace.getConfiguration("vsc-niagara");
    const useGradleW = configuration.get("build.nx.gradlew") as boolean;

    const projectName =  path.basename(rootFolder)
    this.logger.addBuildLogMessage(`build Project: ${projectName} ...`);

    if(rootFolder) {
      this.logger.showSpiningStatusItem(`build ${projectName} ...`);
      let cmd = "";
      if (useGradleW) {
        cmd = "gradlew build";
      } else {
        cmd = "gradle build";
      }

      const extra_args: Array<string> = configuration.get("build.nx.gradle.arguments") as Array<string>;

      cmd = `${cmd} ${extra_args.join(" ")}`;

      this.logger.addBuildLogMessage("execute: " + cmd + " in " + rootFolder);
      CommandHandler.runCommand(cmd, rootFolder, this.logger);
    }
    else{
      this.logger.addBuildLogMessage("root folder not found");
      this.logger.showErrorStatusItem();
      vscode.window.showErrorMessage("root folder not found");
    }
  }

  async ax(rootFolder: string) {
    this.logger.addBuildLogMessage("build AX Project");

    const projectName =  path.basename(rootFolder)

    const configuration = vscode.workspace.getConfiguration("vsc-niagara");
    const axHome = configuration.get("niagara.ax.home") as string;

    this.logger.addBuildLogMessage("build Project ...");

    if(rootFolder) {
      this.logger.showSpiningStatusItem(`build ${projectName} ...`);
      let exe = path.join(axHome, "bin\\build.exe");
      let cmd =  exe + " " + rootFolder + "build.xml full";
      this.logger.addBuildLogMessage("build: " + cmd);
      CommandHandler.runCommand(cmd, rootFolder, this.logger);

    } else {
      this.logger.addBuildLogMessage("root folder not found");
      this.logger.showErrorStatusItem();
      vscode.window.showErrorMessage("root folder not found");
    }
  }
}
