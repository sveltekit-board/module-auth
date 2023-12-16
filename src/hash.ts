import crypto from 'node:crypto';
import setting from '@sveltekit-board/setting';

export function hash(id:string, password:string){
    let salt = setting.get('auth', 'salt') || id.substring(0, 4);
    const hashed = crypto.createHash('SHA512').update(password + salt).digest('base64url');
    return hashed;
}