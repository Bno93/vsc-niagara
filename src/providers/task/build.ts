import {Task, TaskProvider, TaskDefinition, ShellExecution} from 'vscode';

export class BuildTaskProvider implements TaskProvider {
    static BuildType: string = 'build';
    private buildPromise: Thenable<Task[]> | undefined = undefined;

    constructor() {

    }

    public provideTasks(): Thenable<Task[]> | undefined {
        if (!this.buildPromise) {
            this.buildPromise = getBuildTask();
        }

        return this.buildPromise;
    }


    public resolveTask(_task: Task): Task | undefined {
        const definition: BuildTaskDefinition = <any>_task.definition;
        return new Task(
            definition,
            "build",
            "build",
            new ShellExecution("gradlew build")
        )
    }
}


interface BuildTaskDefinition extends TaskDefinition {

    task: string;
}


async function getBuildTask(): Promise<Task[]> {
    let result: Task[] = [];

    let kind: BuildTaskDefinition = {
        type: "build",
        task: "gradlew build"
    }
    result.push(new Task(kind, "gradlew build", 'build', new ShellExecution('gradlew build')))

    return result;
}
