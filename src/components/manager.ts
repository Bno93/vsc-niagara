import * as vscode from 'vscode';
import * as fs from "fs";

export class Manager {
  axProject: boolean;
  nxProject: boolean;

  constructor() {
    this.axProject = false;
    this.nxProject = false;

  }

  async findProjectRoot() : Promise<string | undefined > {

    let workspaceFolders = vscode.workspace.workspaceFolders;
    if(!workspaceFolders){
      return undefined;
    }
    let rootFolder = workspaceFolders[0];

    return rootFolder["uri"]["fsPath"];
  }



  async checkProjectVersion() : Promise<string | undefined> {
    let rootFolder = await this.findProjectRoot();
    let projectVersion = "";
    if(rootFolder) {

      fs.readdirSync(rootFolder).forEach(file => {
        if(file === 'build.gradle') {
          console.log("NX Project");
          projectVersion = "4.x";
        }

        if(file === 'build.xml') {
          console.log("AX Project");
          projectVersion = "3.x";
        }
      });
    } else {
      console.log("rootfolder is undefined");
    }

    return projectVersion;
  }

}