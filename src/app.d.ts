// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import { JWTCreateOption } from "./jwt.server";
import { JWT } from "@auth/core/jwt";
import { JWTToken } from "./jwt.server";

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
