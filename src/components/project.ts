
import { Logger } from "./logger";

import { workspace } from "vscode";

export class Project {

    logger : Logger;
    version : string;
    environment : Environment;
    root : string;

    constructor(logger: Logger) {
        this.logger = logger;
        this.version = "";
        this.root = "";

        this.environment = new Environment();
    }
}


export class Environment {

    label : string;
    path : string;

    constructor() {
        this.label = "";
        this.path = "";
    }

    checkEnvironment(project_version : string) {
        let path = process.env.niagara_home as string;

        const configuration = workspace.getConfiguration('vsc-niagara');
        const config_env = configuration.has('environment') ? configuration.get("environment") as string : undefined;
        if (config_env) {
            path = config_env;
        }
        const regexVersion = /(\d+)\.(\d+\.)*(\d+)/

        const label = path.substring(path.lastIndexOf("\\") + 1);
        const result = label.match(regexVersion)
        if(result) {
            const env_version = result[1];
            if (project_version == env_version) {
                console.log("Project Version: " + project_version + " and Env Version: " +result[0]);
            }
        }
        return [label, path];
    }

}
