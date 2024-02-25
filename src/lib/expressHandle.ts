import { getSession } from '@auth/express';
import { type Handler, type Request } from 'express';
import { type Provider } from '@auth/core/providers';
import type { Provider as ExpressProvider } from '@auth/express/providers';
import cookieParser from 'cookie-parser';
import { encode, decode, type JWT } from "@auth/core/jwt";
import { type JWTToken, type JWTCreateOption, createJwt } from './jwt.server.js';
import { config } from 'dotenv';

config();

export async function expressHandle(providers: Provider[]): Promise<Handler> {
    return ((req: Request, res: any, next: any) => {
        (cookieParser())(req, res, async () => {
            res.locals.session = await getSession(req, {
                providers: providers as ExpressProvider[],
                trustHost: true,
                secret: process.env.SECRET,
                callbacks: {
                    jwt: async ({ token, account }) => {
                        let newToken = { ...token };
                        if (account?.provider) {
                            newToken.provider = account.provider;
                        }
                        if (account?.providerAccountId) {
                            newToken.providerAccountId = account.providerAccountId;
                        }
                        if (typeof newToken.provider === "string") {
                            res.locals.provider = newToken.provider;
                        }
                        if (typeof newToken.providerAccountId === "string") {
                            res.locals.providerAccountId = newToken.providerAccountId;
                        }
                        return newToken;
                    }
                }
            });

            res.locals.getJwt = async (cookieName: string) => {
                let jwt = req.cookies[cookieName];
                if (!jwt) return null;

                let token: (JWTToken & JWT) | null;
                try {
                    token = await decode({
                        token: jwt,
                        secret: process.env.SECRET,
                        salt: process.env.SALT
                    })
                }
                catch (err) {
                    return null;
                }

                if (token?.exp && token.exp * 1000 < (new Date()).getTime()) {
                    return null;
                }

                if (token?.updateMaxage === true) {
                    await res.locals.setJwt(cookieName, {
                        data: token.data,
                        updateMaxage: true,
                        maxAge: token.maxAge
                    })
                }

                return token;
            };

            res.locals.setJwt = async(cookieName:string, option:JWTCreateOption) => {
                const jwt = await createJwt(option);
                res.cookie(cookieName, jwt, {
                    path:'/',
                    httpOnly: true,
                    maxAge: option.maxAge || 3600
                });
            };

            next();
        });
    })
}