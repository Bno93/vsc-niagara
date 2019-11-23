
import { Logger } from "./logger";

import { ExtensionContext, workspace } from "vscode";


export class Project {

    logger : Logger;
    version : string;
    environment : Environment;
    root : string;

    constructor(context: ExtensionContext) {
        this.logger = new Logger(context);

        this.version = "";
        this.root = "";

        this.environment = new Environment();
    }


}


export class Environment {


    label : String;
    path : String;

    constructor() {
        this.label = "";
        this.path = "";
    }

    checkEnvironment() {
        const path = process.env.niagara_home as string;
        const label = path.substring(path.lastIndexOf("\\") + 1);
        const configuration = workspace.getConfiguration('vsc-niagara');



        return [label, path];
    }

}
