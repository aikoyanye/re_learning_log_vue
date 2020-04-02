export var GetCookie = function (name){
    let cookieStr=decodeURIComponent(document.cookie);
    let arr1=cookieStr.split(";");
    for(let i=0;i<arr1.length;i++){
        let arr2=arr1[i].split("=");
        if(arr2[0].trim()===name){
            return arr2[1];
        }
    }
}
