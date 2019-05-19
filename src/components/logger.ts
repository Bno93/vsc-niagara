import * as vscode from "vscode";

export class Logger {
  buildLogPanel: vscode.OutputChannel;
  extLogPanel: vscode.OutputChannel;
  statusItem: vscode.StatusBarItem;


  constructor() {
   this.buildLogPanel = vscode.window.createOutputChannel("Niagara Build");
   this.extLogPanel = vscode.window.createOutputChannel("Niagara Ext");
   this.statusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
  }

  addExtensionMessage(message: string) {
    this.extLogPanel.append(`[${new Date().toLocaleTimeString('de-DE', {hour12: false})}] ${message}\n`);
  }

  addBuildLogMessage(message: string) {
    this.buildLogPanel.append(`[${new Date().toLocaleTimeString('de-DE', {hour12: false})}] ${message}\n`);
  }

  showSpiningStatusItem(text: string) {
    this.statusItem.text = "$(sync~spin) " + text;
    this.statusItem.show();
  }

  showSuccessStatusItem(text: string, time?: string) {
    this.statusItem.hide();
    if(time) {
      this.statusItem.text = "$(check) " + text + " successful at " + time;
    } else {
      this.statusItem.text = "$(check) " + text + " successful";
    }
    this.statusItem.show();
  }

  showFailedStatusItem(text: string) {
    this.statusItem.hide();
    this.statusItem.text = "$(x) " + text + " failed";
    this.statusItem.show();
  }

  showErrorStatusItem() {
    this.statusItem.text = "error...";
    this.statusItem.show();
  }
}