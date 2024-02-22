import { encode, decode, type JWT } from "@auth/core/jwt";
import type { RequestEvent, ResolveOptions } from "@sveltejs/kit";
import type { MaybePromise } from "@sveltejs/kit";
import {config} from 'dotenv';

config();

export default async function handleJwt(input:HandleInput){
    const {event, resolve} = input;
    event.locals.setJwt = async(cookieName:string, option:JWTCreateOption) => {
        const jwt = await createJwt(option);
        event.cookies.set(cookieName, jwt, {path:'/'});
    }
    event.locals.getJwt = async(cookieName:string) => {
        let jwt = event.cookies.get(cookieName);
        if(jwt){
            let token:(JWTToken & JWT)|null;
            try{
                token = await decode({
                    token:jwt,
                    secret: process.env.SECRET,
                    salt: process.env.SALT
                })
            }
            catch(err){
                return null;
            }

            if(token?.exp && token.exp * 1000 < (new Date()).getTime()){
                return null;
            }

            if(token?.updateMaxage === true){
                await event.locals.setJwt(cookieName, {
                    data:token.data,
                    updateMaxage: true,
                    maxAge: token.maxAge
                })
            }

            return token;
        }
        else{
            return null;
        }
    }
    return await resolve(event);
}

export async function createJwt(option:JWTCreateOption){
    const {data} = option;
    const maxAge = option.maxAge || 3600;
    const updateMaxage = option.updateMaxage || false;

    const jwt = await encode({
        token: {
            data,
            updateMaxage,
            maxAge
        },
        maxAge,
        secret: process.env.SECRET,
        salt: process.env.SALT
    });

    return jwt;
}

interface HandleInput{
	event: RequestEvent;
	resolve(event: RequestEvent, opts?: ResolveOptions): MaybePromise<Response>;
}

export interface JWTCreateOption{
    data:Object;
    updateMaxage?:boolean;
    maxAge?:number;
}

export interface JWTToken{
    data: Object;
    updateMaxage: boolean;
    maxAge:number;
}