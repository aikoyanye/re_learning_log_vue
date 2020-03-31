export var GetCookie = function (name){
    var cookieStr=decodeURIComponent(document.cookie);
    var arr1=cookieStr.split(";");
    for(var i=0;i<arr1.length;i++){
        var arr2=arr1[i].split("=");
        if(arr2[0].trim()===name){
            return arr2[1];
        }
    }
}