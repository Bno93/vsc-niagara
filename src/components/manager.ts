import * as vscode from 'vscode';
import * as fs from "fs";

export enum NiagaraVersion {
  UNDEFINED = "Undefined",
  AX = "Niagara AX",
  N4 = "Niagara 4",
}

export class Manager {
  niagara_version: NiagaraVersion;

  constructor() {
    this.niagara_version = NiagaraVersion.UNDEFINED;
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

              this.niagara_version = NiagaraVersion.N4;
              reslove("4");

            }

            else if(file === 'build.xml') {
              console.log("N3 project detected");
              this.niagara_version = NiagaraVersion.AX;
              reslove("3");
            }
          });
        } else {
          console.log("rootfolder is undefined");
          this.niagara_version = NiagaraVersion.UNDEFINED;
          reject(undefined);
        }
      });
    });
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
