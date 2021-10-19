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

  async n4() {
    let rootFolder = await this.manager.findProjectRoot() + "\\";
    this.logger.addBuildLogMessage("build Project ...");

    const configuration = vscode.workspace.getConfiguration("vsc-niagara");
    const useGradleW = configuration.get("build.nx.gradlew") as boolean;

    if(rootFolder) {
      this.logger.showSpiningStatusItem("build N4 ...");
      let cmd = "";
      if (useGradleW) {
        cmd = "gradlew build";
      } else {
        cmd = "gradle build";
      }

      this.logger.addBuildLogMessage("execute: " + cmd + " in " + rootFolder);
      CommandHandler.runCommand(cmd, rootFolder, this.logger);
    }
    else{
      this.logger.addBuildLogMessage("root folder not found");
      this.logger.showErrorStatusItem();
      vscode.window.showErrorMessage("root folder not found");
    }
  }

  async ax() {
    this.logger.addBuildLogMessage("build AX Project");
    let rootFolder = await this.manager.findProjectRoot() + "\\";
    const configuration = vscode.workspace.getConfiguration("vsc-niagara");
    const axHome = configuration.get("niagara.ax.home") as string;

    this.logger.addBuildLogMessage("build Project ...");

    if(rootFolder) {
      this.logger.showSpiningStatusItem("build AX ...");
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
