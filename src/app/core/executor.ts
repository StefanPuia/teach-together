import path from 'path';
import * as fs from 'fs';
import { Request, Response } from 'express';
import Spawner from './spawner';
import Debug from '../../framework/utils/debug.util';

export default abstract class Executor {
    public static executeJavaScript(req: Request, res: Response) {
        const fileName: string = path.join("spawner/", Math.random().toString() + ".js");
        fs.writeFileSync(fileName, wrap("javascript", req.body.code));
        const spawner = new Spawner("node", fileName);
        Executor.handleProcess(spawner, req, res);
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
}

const wrap = (language: string, code: string) => {
    switch (language) {
        case "javascript": 
            return `
                try {
                    eval(\`function main() { ${code.replace(/\`/g, "\\\`")} }\`);
                    const returnData = main();
                    if (returnData) console.log(returnData);
                } catch (err) {
                    console.trace(err);
                }
            `;
        
        default: return code;
    }
}