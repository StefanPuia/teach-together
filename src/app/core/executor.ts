import path from 'path';
import * as fs from 'fs';
import sha256 from 'sha256';
import { Request, Response } from 'express';
import { Spawner } from './spawner';
import { DebugUtil } from '../../framework/utils/debug.util';
import { EntityEngine } from '../../framework/core/engine/entity/entity.engine';

export default abstract class Executor {
    public static execute(engine: String, req: Request, res: Response) {
        switch (engine) {
            case "nodejs":
                this.executeJavaScript(req, res);
                break;
            
            case "python3":
                this.executePython(req, res);
                break;

            case "mysql":
                this.executeMysql(req, res);
                break;
        
            default:
                throw new Error(`Engine '${engine}' is not defined.`);
                break;
        }
    }

    public static executeJavaScript(req: Request, res: Response) {
        const fileName: string = path.join(__dirname, "../../../spawner/", this.getFileName("js"));
        fs.writeFileSync(fileName, ExecutorWrapper.javascript(req.body.code));
        const spawner = new Spawner("node", fileName);
        this.handleProcess(spawner, req, res);
        spawner.onExit(() => {
            fs.unlinkSync(fileName);
        })
    }

    public static executePython(req: Request, res: Response) {
        const fileName: string = path.join(__dirname, "../../../spawner/", this.getFileName("py"));
        fs.writeFileSync(fileName, req.body.code);
        const spawner = new Spawner("python", fileName);
        this.handleProcess(spawner, req, res);
        spawner.onExit(() => {
            fs.unlinkSync(fileName);
        })
    }

    public static executeMysql(req: Request, res: Response) {
        const statement = ExecutorWrapper.mysql(req.body.code);
        EntityEngine.execute(statement, [], false, false)
        .then(result => {
            res.send(ResultBuilder.mysql(result.slice().splice(1, result.length - 2)));
        }).catch(err => {
            res.send(err.sqlMessage || err);
        })
    }

    private static handleProcess(spawner: Spawner, req: Request, res: Response) {
        spawner.spawn()
        .then(() => {
            res.send(spawner.getStdout());
        }).catch(err => {
            DebugUtil.logError(err, "Executor");
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
                console.log(err.message);
            }
        `;
    }

    public static mysql(code: string): string {
        if (code.substr(-1) === ";") code = code.substr(0, code.length - 1);
        return `start transaction; ${code};
        rollback;`
    }
}

class ResultBuilder {
    public static mysql(results: any): string {
        const tables: Array<string> = [];
        for (const result of results) {
            tables.push(this.buildMysqlTable(result));
        }
        return tables.join("<br>");
    }

    private static buildMysqlTable(resultBlock: any): string {
        const headers = Object.keys(resultBlock[0]);
        const rows: Array<any> = [];
        for (const result of resultBlock) {
            const row: Array<any> = [];
            for (const h of headers) {
                row.push(result[h] || "");
            }
            rows.push(`<td>${row.join("</td><td>")}</td>`);
        }
        return `<table>
            <thead><tr><th>${headers.join("</th><th>")}</th></tr></thead>
            <tbody><tr>${rows.join("</tr><tr>")}</tr></tbody>
        </table>`;
    }
}