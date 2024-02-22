# @sveltekit-board/auth

개발중입니다.

## 설명
auth.js를 이용한 인증입니다.

## 설치
`npm install @sveltekit-board/auth`

## api

### hooks.server.ts 설정 예시
```ts
import { sequence } from "@sveltejs/kit/hooks";
import {auth, handleJwt} from "@sveltekit-board/auth"
import Github from "@auth/core/providers/github";
import { config } from 'dotenv';
config();

export const handle = sequence(
    auth([
        Github({
            clientId: 'client',
            clientSecret: 'secret'
        })
    ]),
    handleJwt,
    async({event, resolve}) => {
        await event.locals.auth();
        return await resolve(event);
    }
)
```

### auth

`auth`함수에는 provider로 이루어진 배열이 들어갑니다.

이후에 `event.locals.auth()`를 실행하지 않으면 `event.locals.provider`와 `event.locals.providerAccountId`가 정의되지 않습니다.

### handleJwt

handleJwt는 `event.locals`에 `setJwt`와 `getJwt` 메소드를 추가시켜줍니다.

### getJwt

```ts
let jwt = getJwt('cookieName');
```

