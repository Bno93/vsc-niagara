import * as vscode from 'vscode';
import { Manager } from "../manager";
import { Logger } from "../logger";
import * as path from 'path';
import { CommandHandler } from '../command_handler';
export class SlotomaticWrapper {

  manager: Manager;
  logger: Logger;

  constructor(logger: Logger, manager: Manager) {
    this.logger = logger;
    this.manager = manager;
  }


  async n4() {
    let rootFolder = await this.manager.findProjectRoot() + "\\";
    this.logger.addBuildLogMessage("run slot-o-matic ...");

    const configuration = vscode.workspace.getConfiguration("vsc-niagara");
    const useGradleW = configuration.get("build.nx.gradlew") as boolean;

    if(rootFolder) {
      this.logger.showSpiningStatusItem("slotomatic N4 ...");

      let cmd = "";
      if (useGradleW) {
        cmd = "gradlew slotomatic";
      }
      else {
        cmd = "gradle slotomatic";
      }
      console.log("execute: " + cmd + " in " + rootFolder);
      CommandHandler.runCommand(cmd, rootFolder, this.logger);
    }
    else{
      this.logger.addBuildLogMessage("root folder not found");
      this.logger.showErrorStatusItem();
      vscode.window.showErrorMessage("root folder not found");
    }

  }


  async ax() {
    let rootFolder = await this.manager.findProjectRoot() + "\\";
    const configuration = vscode.workspace.getConfiguration("vsc-niagara");
    const axHome = configuration.get("niagara.ax.home") as string;

    if(rootFolder) {
      this.logger.showSpiningStatusItem("slotomatic AX ...");
      let exe = path.join(axHome, "bin\\slot.exe");
      let cmd =  exe + " -mi " + rootFolder;
      this.logger.addBuildLogMessage("build: " + cmd);
      CommandHandler.runCommand(cmd, rootFolder, this.logger);

    } else {
      this.logger.addBuildLogMessage("root folder not found");
      this.logger.showErrorStatusItem();
      vscode.window.showErrorMessage("root folder not found");
    }
  }

}
