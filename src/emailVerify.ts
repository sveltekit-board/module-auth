import { runQuery } from "@sveltekit-board/db";
import AuthError from "./error";

export async function createVerify(id: string) {
    let code = Math.floor(Math.random() * 1000000);

    if (code < 100000) {
        return await createVerify(id);
    }

    try {
        let result: any[] = await runQuery(async (run) => {
            return await run("SELECT * FROM `email_verification` WHERE `verification_code` = ? AND `expiration` < ?", [code, new Date().getTime()])
        })
        if (result.length === 0) {
            await runQuery(async (run) => {
                return await run("INSERT INTO `email_verification` (id, verification_code, expiration) VALUES (?, ?, ?)", [id, code, new Date().getTime() + 3600000])
            })
            return code;
        }
        else {
            return await createVerify(id);
        }
    }
    catch (err) {
        throw err;
    }
}

export async function verifyEmail(id: string, code: string) {
    let result;
    try {
        result = await runQuery(async (run) => { return await run("SELECT * FROM `email_verification` WHERE `id` = ? AND `verification_code` = ? AND `expiration` < ?", [id, Number(code), new Date().getTime()]) });
    }
    catch (err) {
        throw err;
    }

    if (result.length !== 0) {
        try {
            await runQuery(async (run) => {
                return await run("UPDATE `user` SET `verified` = 1 WHERE `id` = ?", [id])
            });
        }
        catch (err) {
            throw err;
        }

        try {
            runQuery(async (run) => {
                return await run("DELETE FROM `email_verification` WHERE `verification_code` = ?", [Number(code)])
            })
        }
        catch { }

        return true;
    }
    else {
        throw new AuthError('INVALID_ID_OR_CODE')
    }
}

class EmailVerificationCodeCleaner {
    #cleaner:any = setInterval(async () => {
        try{
            runQuery(async(run) => {
                return await run("DELETE FROM `email_verification` WHERE `expiration` < ?", [new Date().getTime()])
            })
        }
        catch{}
    },5400000)

    stop(){
        if(this.#cleaner){
            clearInterval(this.#cleaner)
        }
    }

    start(){
        if(this.#cleaner._destroyed){
            this.#cleaner = setInterval(async () => {
                try {
                    runQuery(async(run) => {
                        return await run("DELETE FROM `email_verification` WHERE `expiration` < ?", [new Date().getTime()]);
                    })
                }
                catch {}
            },5400000)
        }
    }
}