export default class AuthError extends Error{
    code:string;
    sqlError:any;

    constructor(code:string, message?:string, sqlError?:any){
        super(message);
        this.code = code;
        if(sqlError){
            this.sqlError = sqlError;
        }
    }
}