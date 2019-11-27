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
    return new Promise<string | undefined>((resolve, reject) => {
      let workspaceFolders = vscode.workspace.workspaceFolders;
      if(workspaceFolders){
        let rootFolder = workspaceFolders[0];
        resolve(rootFolder["uri"]["fsPath"]);
      }
      else {
        reject(undefined);
      }
    });
  }



  async checkProjectVersion() : Promise<string | undefined> {
    return new Promise<string | undefined>((reslove, reject) => {
      this.findProjectRoot().then((rootFolder) => {
        if(rootFolder) {

          fs.readdirSync(rootFolder).forEach(file => {
            if(file === 'build.gradle') {
              console.log("N4 project detected");
              this.nxProject = true;
              this.axProject = false;

              reslove("4");

            }

            else if(file === 'build.xml') {
              console.log("N3 project detected");
              this.nxProject = false;
              this.axProject = true;
              reslove("3");

            }
          });
        } else {
          console.log("rootfolder is undefined");
          reject(undefined);
        }
      });
    });
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
