import * as vscode from 'vscode';
import { Manager } from './manager';
import { Logger } from './logger';
import { Project } from './project';
import * as path from 'path';


export class Commander {
  logger : Logger;
  manager : Manager;
  project : Project;
  terminal?: vscode.Terminal



  constructor(logger : Logger, project : Project) {
    this.logger = logger;
    this.manager = new Manager();
    this.project = project;
  }

  getTerminal(): vscode.Terminal {

    if (!this.terminal) {
      this.terminal = vscode.window.createTerminal("niagara");
    }

    return this.terminal;
  }

  async build() {
    const projVersion: string | undefined = await this.manager.checkProjectVersion();
    this.logger.addExtensionMessage("build as a N "+ projVersion);
    let cmd: string;

    if(this.manager.nxProject) {
      const configuration = vscode.workspace.getConfiguration("vsc-niagara");
      const useGradleW = configuration.get("build.nx.gradlew") as boolean;

      if (useGradleW) {
        cmd = "./gradlew build";

      } else {
        cmd = "gradle build";
      }

    }
    else if(this.manager.axProject) {

      let buildXML = path.join(await this.manager.findProjectRoot() as string, "build.xml");
      const configuration = vscode.workspace.getConfiguration("vsc-niagara");
      const axHome = configuration.get("niagara.ax.home") as string;
      let exe = path.join(axHome, "bin", "build.exe");
      cmd = exe + " " + buildXML + " full";
    }
    else {
      this.logger.addExtensionMessage("fail to build is ether no N3 or N4 project");
      return;
    }


    const terminal = this.getTerminal();
    terminal.show(true);
    terminal.sendText(cmd);
  }


  async slotomatic() {
    const projVersion: string | undefined = await this.manager.checkProjectVersion();
    let cmd: string;

    this.logger.addExtensionMessage("build as a N "+ projVersion);
    if(this.manager.nxProject) {

      const configuration = vscode.workspace.getConfiguration("vsc-niagara");
      const useGradleW = configuration.get("build.nx.gradlew") as boolean;

      if (useGradleW) {
        cmd = "./gradlew slotomatic";
      }
      else {
        cmd = "gradle slotomatic";
      }
    }
    else if(this.manager.axProject) {
      let rootFolder = await this.manager.findProjectRoot() + "\\";
      const configuration = vscode.workspace.getConfiguration("vsc-niagara");
      const axHome = configuration.get("niagara.ax.home") as string;

      let exe = path.join(axHome, "bin", "slot.exe");
      cmd = exe + " -mi " + rootFolder;
    }
    else {
      this.logger.addBuildLogMessage("fail to build is ether no N3 or N4 project");
      return;
    }

    const terminal = this.getTerminal();
    terminal.show(true);
    terminal.sendText(cmd);
  }

  async clean() {
      let rootFolder = await this.manager.findProjectRoot() + "\\";

      this.logger.addBuildLogMessage("clean project ...");

      if(rootFolder) {

        this.logger.showSpiningStatusItem("clean...");
        const configuration = vscode.workspace.getConfiguration("vsc-niagara");
        const useGradleW = configuration.get("build.nx.gradlew") as boolean;
        let cmd = ""
        if (useGradleW) {
          cmd = "./gradlew clean";

        } else {
          cmd = "gradle clean";
        }
        this.logger.addExtensionMessage("execute: " + cmd + " in " + rootFolder);

        const terminal = this.getTerminal();
        terminal.show(true);
        terminal.sendText(cmd);
      }
      else{
        this.logger.addBuildLogMessage("root folder not found");
        this.logger.showErrorStatusItem();
        vscode.window.showErrorMessage("root folder not found");
      }

  }


  async moduleTestJar() {

    let rootFolder = await this.manager.findProjectRoot() + "\\";
    this.logger.addBuildLogMessage("run moduleTestJar ...");

    if(rootFolder) {
      this.logger.showSpiningStatusItem("build TestJar...");

      const configuration = vscode.workspace.getConfiguration("vsc-niagara");
      const useGradleW = configuration.get("build.nx.gradlew") as boolean;
      let cmd = ""
      if (useGradleW) {
        cmd = "./gradlew moduleTestJar";

      } else {
        cmd = "gradle moduleTestJar";
      }

      const terminal = this.getTerminal();
      terminal.show(true);
      terminal.sendText(cmd);


    }
    else{
      this.logger.addBuildLogMessage("root folder not found");
      this.logger.showErrorStatusItem();
      vscode.window.showErrorMessage("root folder not found");
    }
  }
}
