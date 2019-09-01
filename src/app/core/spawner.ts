import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import CustomConfig from '../config/custom.config';
import Debug from '../../framework/utils/debug.util';

export default class Spawner {
    private readonly processPath: string;
    private readonly arguments: Array<string>;
    private code: number | null = 0;
    private process?: ChildProcessWithoutNullStreams;
    private stdout: string = "";
    private stderr: string = "";
    private onExitCB: Function = () => {};

    constructor(...args: Array<string>) {
        this.processPath = args[0];
        this.arguments = args.slice(1);
    }

    public spawn() {
        return new Promise((resolve, reject) => {
            if (this.processPath) {
                Debug.logInfo(`Spawning process "${this.processPath}" with: ['${this.arguments.join("', '")}']`, "Spawner");
                this.process = spawn(this.processPath, this.arguments, {
                    detached: true
                });

                setTimeout(() => {
                    if (this.process) {
                        this.process.kill("SIGKILL");
                        this.addStderr("Timeout error");
                    }
                }, CustomConfig.processTimeout)

                this.process.stdout.on('data', (data) => {
                    this.addStdout(data);
                });

                this.process.stderr.on('data', (data) => {
                    this.addStderr(data);
                });

                this.process.on("exit", (code) => {
                    this.code = code;
                    this.onExitCB(code);
                    if (this.process && this.process.killed) {
                        reject("Timeout error");
                    } else if (this.stderr !== "") {
                        reject(this.stderr);
                    } else {
                        resolve(code);
                    }
                })
            } else {
                this.addStderr("Process not defined");
                reject();
            }
        })
    }

    public getExitCode() {
        return this.code;
    }

    public getStdout() {
        return this.stdout;
    }

    public getStderr() {
        return this.stderr;
    }

    public onExit(callback: Function) {
        this.onExitCB = callback;
    }

    private addStderr(message: any) {
        this.stderr = this.addOutput(this.stderr, message);
    }

    private addStdout(message: any) {
        this.stdout = this.addOutput(this.stdout, message);
    }

    private addOutput(variable: string, message: any): string {
        return variable + (message.toString().replace(/([a-zA-Z]+:\\)+(.+\\)+/g, 'fakepath/') + "\n").trim();
    }
}