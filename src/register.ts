import user from '@sveltekit-board/user';
import AuthError from './error';
import regEx from './regEx';

const createUser = user.createUser;

interface userOption {
    id: string
    password: string
    email?: string
    nickname: string
    grade: number
    registerIp: string
}

interface VerifyCallback{
    callback:() => boolean
    params:any[]
}

export async function register(option: userOption, useEmailVerification: boolean) {
    if (useEmailVerification && !option.email) {
        throw new AuthError("NOT_EXIST_EMAIL");
    }

    //정규식 검사
    if(!regEx.id.test(option.id) || !option.id){
        throw new AuthError('REGEX_NOT_MATCH_ID')
    }
    if(!regEx.password.test(option.password) || !option.password){
        throw new AuthError('REGEX_NOT_MATCH_PASSWORD')
    }
    if(!regEx.nickname.test(option.nickname) || !option.nickname){
        throw new AuthError('REGEX_NOT_MATCH_NICKNAME')
    }
    if(option.email){
        if(!regEx.email.test(option.email)){
            throw new AuthError('REGEX_NOT_MATCH_EMAIL')
        }
    }


    if(useEmailVerification){
        //여기다가 이메일 인증 만드쇼
        return await createUser({...option,verified:false})
    }
    else{
        return await createUser({...option, verified: true});
    }
}