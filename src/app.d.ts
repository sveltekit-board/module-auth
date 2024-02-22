// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import { JWTCreateOption, JWTToken  } from "./lib/jwt.server.js";
import { JWT } from "@auth/core/jwt";

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			provider?:string;
			providerAccountId?:string;
			setJwt:(cookieName:string, option:JWTCreateOption) => Promise<void>;
			getJwt:(cookieName:string) => Promise<(JWTToken & JWT) | null>
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
