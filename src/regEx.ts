import setting from "@sveltekit-board/setting";

function getRegEx(key:string){
    if(setting.get("auth", key)){
        return new RegExp(setting.get('auth', key))
    }
    else{
        return false;
    }
}

const regEx = {
    id: getRegEx('regExp_id') || /(?=^[a-zA-Z0-9]{6,}$)/,
    email: getRegEx('regExp_email') || /^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.+[a-z]+[a-z]*?$/,
    password: getRegEx('regExp_password') || /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/,
    nickname: getRegEx('regExp_nickname') || /^[a-zA-Z0-9가-힣]*$/
}

export default regEx