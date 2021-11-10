import path = require("path");


export namespace Niagara {
    const version_regex = /(\d+)\.(\d+\.)*(\d+)/;


    export function getVersion(niagara_path: string) {

        const basename = path.basename(niagara_path);
        console.log(`Niagara Folder ${basename}`);

        const version = basename.match(version_regex);
        if (version) {

            console.log(`found version ${version[0]}`);

            return version[0];
        }
        return undefined;
    }


    export enum NiagaraVersion {
        UNDEFINED = "Undefined",
        AX = "Niagara AX",
        N4 = "Niagara 4",
    }
}
