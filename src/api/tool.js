import fa from "element-ui/src/locale/lang/fa";

export var GetCookie = function (name){
    let cookieStr=decodeURIComponent(document.cookie);
    let arr1=cookieStr.split(";");
    for(let i=0;i<arr1.length;i++){
        let arr2=arr1[i].split("=");
        if(arr2[0].trim()===name){
            return arr2[1];
        }
    }
};

export var MsgNotify = function (msg, t) {
    const h = t.$createElement;
    t.$notify({
        title: '通知',
        message: h('i', { style: 'color: teal'}, msg),
        duration: 3000,
    });
};

export var CheckDictNil = function (dict) {
    for(let key in dict){
        if(dict[key] === ''){
            return true
        }
    }
    return false
}