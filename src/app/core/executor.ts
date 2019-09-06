import path from 'path';
import * as fs from 'fs';
import sha256 from 'sha256';
import { Request, Response } from 'express';
import Spawner from './spawner';
import Debug from '../../framework/utils/debug.util';

export default abstract class Executor {
    public static executeJavaScript(req: Request, res: Response) {
        const fileName: string = path.join(__dirname, "../../../spawner/", this.getFileName("js"));
        fs.writeFileSync(fileName, ExecutorWrapper.javascript(req.body.code));
        const spawner = new Spawner("node", fileName);
        this.handleProcess(spawner, req, res);
        spawner.onExit(() => {
            fs.unlinkSync(fileName);
        })
    }

    private static handleProcess(spawner: Spawner, req: Request, res: Response) {
        spawner.spawn()
        .then(() => {
            res.send(spawner.getStdout());
        }).catch(err => {
            Debug.logError(err, "Executor");
            res.status(500).send(spawner.getStderr());
        });
    }

    private static getFileName(extension: string): string {
        const rand = Math.random().toString() + new Date().getTime();
        const hash = sha256(rand); 
        return `${hash.substr(0, 30)}.${extension}`;
    }
}

class ExecutorWrapper {
    public static javascript(code: string): string {
        let evalCode = code.replace(/\`/g, "\\\`").replace(/\//g, "\\/");
        return `try { eval(\`function main() { ${evalCode} \n}\`);
                const returnData = main();
                if (returnData) console.log(returnData);
            } catch (err) {
                console.trace(err);
            }
        `;
    }
}