import * as vscode from 'vscode';

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

}