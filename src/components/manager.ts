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
          this.nxProject = true;
          this.axProject = false;
        }

        else if(file === 'build.xml') {
          console.log("AX Project");
          this.nxProject = false;
          this.axProject = true;
        }
      });
    } else {
      console.log("rootfolder is undefined");
    }

    return projectVersion;
  }


  checkIfAutoSaveIsActive() {
    const configuration = vscode.workspace.getConfiguration("vsc-niagara");
    const autoSave = configuration.get("build.autoSave") as boolean;
    console.log("is autosave on? " + autoSave);
    if (autoSave) {
      this.saveTextDocuments();
    }
    else {
      vscode.window.showWarningMessage('WARNING: Some files may have to be merged!!');
    }

  }

  saveTextDocuments() {
    let openTextDocs = vscode.workspace.textDocuments;

    openTextDocs.forEach(element => {
      if (element.isDirty) {
        element.save();
      }
    });
  }
}