
import { StatusBarItem, StatusBarAlignment, window } from "vscode";
import { Environment, Project } from "./project";

export class EnvStatusItem {

    environItem : StatusBarItem;
    niagaraEnv : Environment;

    constructor() {
        this.environItem = window.createStatusBarItem(StatusBarAlignment.Left);
        this.environItem.command = "vsc-niagara.chooseEnvironment";
        this.niagaraEnv = new Environment();
    }

    updateItem(project : Project) {

        const [label, path ] = project.environment.checkEnvironment(project.version);
        console.log("env for version " + project.version)
        project.environment.label = label;
        project.environment.path = path;

        this.environItem.text = label;
        this.environItem.show();
    }
}

