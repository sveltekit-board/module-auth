import { SvelteKitAuth } from '@auth/sveltekit';
import {config} from 'dotenv';
import type { Provider } from '@auth/core/providers';
config();

export default function auth(providers: Provider[]) {
    return SvelteKitAuth(async (event) => {
        return {
            providers,
            secret: process.env.SECRET,
            trustHost: true,
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
                        event.locals.provider = newToken.provider;
                    }
                    if (typeof newToken.providerAccountId === "string") {
                        event.locals.providerAccountId = newToken.providerAccountId;
                    }

                    return newToken;
                }
            }
        }
    }).handle
}