import * as vscode from 'vscode';
import * as fs from "fs";

import { Niagara } from './niagara';

export class Manager {
  niagara_version: Niagara.NiagaraVersion;

  constructor() {
    this.niagara_version = Niagara.NiagaraVersion.UNDEFINED;
  }

  async findProjectRoot() : Promise<string | string[] | undefined > {
    return new Promise<string | string[] | undefined>( async (resolve, reject) => {
      let workspaceFolders: vscode.WorkspaceFolder[] = vscode.workspace.workspaceFolders as vscode.WorkspaceFolder[];

      if(workspaceFolders) {

        if (workspaceFolders.length > 1) {
          workspaceFolders.forEach((item: vscode.WorkspaceFolder) => console.log(`ws folder: ${item.name}`) );
          resolve( workspaceFolders.map(item => item["uri"]["fsPath"]) );
        }
        else {
          let rootFolder = workspaceFolders[0];
          resolve(rootFolder["uri"]["fsPath"]);
        }
      }
      else {
        reject(undefined);
      }
    });
  }

  async checkProjectVersion() : Promise<Niagara.NiagaraVersion | undefined> {
    return new Promise<Niagara.NiagaraVersion | undefined>( async (reslove, reject) => {

      const root = await this.findProjectRoot();
      if(Array.isArray(root)) {
        let combinedVersion = Niagara.NiagaraVersion.UNDEFINED;
        for (const folder of root) {
          const version = await this.checkForVersionSpecificFiles(folder)
          if (combinedVersion !== Niagara.NiagaraVersion.UNDEFINED &&
            combinedVersion != version) {
              console.warn(`one in this workspace uses ${combinedVersion} and the other ${version}`);
            }
          combinedVersion = version
        }
        reslove(combinedVersion);
      }
      else if (typeof root == "string") {
        reslove(await this.checkForVersionSpecificFiles(root));
      }
      else {
        console.log("root folder is undefined");
        this.niagara_version = Niagara.NiagaraVersion.UNDEFINED;
        reject(Niagara.NiagaraVersion.UNDEFINED);
      }

    });
  }

  async checkForVersionSpecificFiles(folder: string) : Promise<Niagara.NiagaraVersion> {

    return new Promise<Niagara.NiagaraVersion> (async (resolve, reject) => {
      let foundVersion = Niagara.NiagaraVersion.UNDEFINED;
      for (let file of fs.readdirSync(folder)) {
        if(file === 'build.gradle') {
          console.log("N4 project detected");

          this.niagara_version = Niagara.NiagaraVersion.N4;
          foundVersion = Niagara.NiagaraVersion.N4;

        }
        else if(file === 'build.xml') {
          console.log("N3 project detected");
          this.niagara_version = Niagara.NiagaraVersion.AX;
          foundVersion = Niagara.NiagaraVersion.AX;
        }

      }
      return resolve(foundVersion);
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
