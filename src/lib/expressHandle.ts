import { getSession } from '@auth/express';
import { type Handler, type Request } from 'express';
import { type Provider } from '@auth/core/providers';
import type { Provider as ExpressProvider } from '@auth/express/providers';
import { config } from 'dotenv';

config();

export async function expressHandle(providers: Provider[]):Promise<Handler>{
    return (async (req: Request, res: any, next: any) => {
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

        res.locals.getJwt = async(cookieName:string) => {
            
        }

        res.locals.setJwt = async() => {}
    })
}