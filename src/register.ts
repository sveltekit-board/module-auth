import user from '@sveltekit-board/user';
import AuthError from './error';

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

    //여기다가 정규식 검사 만드쇼

    if(useEmailVerification){
        //여기다가 이메일 인증 만드쇼
        return await createUser({...option,verified:false})
    }
    else{
        return await createUser({...option, verified: true});
    }
}