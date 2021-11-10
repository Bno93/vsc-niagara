
import { Logger } from "./logger";
import { Niagara } from "./niagara";

export class Project {

    logger : Logger;
    /**
     * Project Version
     */
    version : Niagara.NiagaraVersion;
    environment : Environment;
    root : string;

    constructor(logger: Logger) {
        this.logger = logger;
        this.version = Niagara.NiagaraVersion.UNDEFINED;
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

        const version = Niagara.getVersion(path);
        let label = `Niagara ${version}`;
        if(version) {
            const env_version = version[1];
            if (project_version == env_version) {
                console.log("Project Version: " + project_version + " and Env Version: " + version[0]);
            }
        }
        return [label, path];
    }
}
