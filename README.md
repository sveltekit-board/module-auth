# @sveltekit-board/auth

개발중입니다.

## 설명
auth.js를 이용한 인증입니다.

## 설치
`npm install @sveltekit-board/auth`

## api

### auth

`auth`함수에는 provider로 이루어진 배열이 들어갑니다.

이후에 `event.locals.auth()`를 실행하지 않으면 `event.locals.provider`와 `event.locals.providerAccountId`가 정의되지 않습니다.

### handleJwt

handleJwt는 `event.locals`에 `setJwt`와 `getJwt` 메소드를 추가시켜줍니다.

### setJwt
```ts
async function setJwt(cookieName:string, option:JWTCreateOption) => Promise<void>;
interface JWTCreateOption{
    data:Object;
    updateMaxage?:boolean;
    maxAge?:number;
}

//예시
await event.locals.setJwt('cookieName', {
    data:{
        value1: 'foo',
        value2: 'bar'
    },
    updateMaxage:true,//기본값 false
    maxAge:7200//기본값 3600
})
```

`data`를 담은 jwt를 생성하여 `name`이 `cookieName`인 쿠키를 생성합니다.

### getJwt

```ts
let jwt:(JWTToken & JWT)|null = await event.locals.getJwt('cookieName');
/*
{
    data: {
        value1: 'foo',
        value2: 'bar'
    },
    ...
    exp: 123182371,
    maxAge: 3600,
    updateMaxage: true
}
*/
```

반환값의 `exp` 프로퍼티가 존재하며, 메소드 호출 시간보다 이전이면 null을 반환합니다.

만약 `jwt.updateMaxage`가 `true`이면 자동으로 `exp`를 갱신합니다.

`jwt.data`에 데이터가 담겨있습니다.

## 사용법

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
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET
        })
    ]),
    handleJwt,
    async({event, resolve}) => {
        await event.locals.auth();
        return await resolve(event);
    }
)
```

`event.locals.auth` 함수를 호출하지 않으면 `event.locals.provider`와 `event.locals.providerAccountId`가 undefined가 됩니다!

미리 hooks에서 호출하는 것을 추천드립니다.

### provider 설정
각 provider의 callback url을 `[origin]/auth/callback/[provider]`로 설정해주십시오.

예) `http://localhost:5173/auth/callback/github`

### 로그인, 로그아웃
```svelte
<script lang="ts">
    import {signIn, signOut} from '@auth/sveltekit/client';
</script>

<button on:click={() => {signIn('github')}}>로그인</button>
<button on:click={() => {signOut()}}>로그아웃</button>
```

### express 서버 설정
```ts
import express from 'express';
import {expressHandle} from '@sveltekit-board/auth';
import {handle} from './build/handle.js';//build된 sveltekit의 handle.js

const app = express();
app.use(expressHandle)

/*
*...다른 미들웨어들...
*/

app.use(handle);
app.listen(port, () => {});
```
`expressHandle` 미들웨어를 사용하면, res.locals에 `provider`, `providerAccountId`, `token` 프로퍼티와 `setJwt`, `getJwt` 메소드가 추가됩니다.

사용법은 sveltekit에서와 같습니다.
## 기타

- `@sveltekit-board/user` 모듈을 추가하여, 데이터베이스에 `provider`와 `providerAccountId`가 일치하는 열이 없으면 회원가입 페이지로 이동되도록 할 예정입니다.