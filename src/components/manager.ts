import * as vscode from 'vscode';

export class Manager {
  axProject: boolean;
  nxProject: boolean;

  constructor() {
    this.axProject = false;
    this.nxProject = false;

  }

  async findProjectRoot() : Promise<Array<Object> | undefined > {

    let workspaceFolders = vscode.workspace.workspaceFolders;
    if(!workspaceFolders){
      return undefined;
    }
    let roots = [];
    for(let obj of workspaceFolders) {
      roots.push( {"project": obj["name"], "path": obj["uri"]["fsPath"] });
    }
   
    return roots;
  }

}