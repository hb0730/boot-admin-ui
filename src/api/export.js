import util from "@/libs/util";

/**
 * 导出
 * @param {*} method 请求类型 
 * @param {*} url  请求url
 * @param {*} params  请求参数
 */
export function bootAdminExport(method, url, params) {
    var xhh = new window._XMLHttpRequest();
    var data;
    xhh.open(
        method,
        process.env.VUE_APP_API + url,
        true);
    xhh.setRequestHeader(
        "Authorization",
        "Bearer " + util.cookies.get("token")
    );
    xhh.setRequestHeader("Content-Type", "application/json");
    data = JSON.stringify(params);
    xhh.responseType = "blob";
    xhh.onreadystatechange = function () {
        if (xhh.readyState === 4 && xhh.status === 200) {
            var filename = window.decodeURIComponent(
                xhh
                    .getResponseHeader("content-disposition")
                    .split(";")[1]
                    .trim()
                    .split("filename=")[1]
                    .split('"')[1]
            );
            var blob = new Blob([xhh.response], {
                type: "application/octet-stream;charset=UTF8"
            });
            var csvUrl = URL.createObjectURL(blob);
            var link = document.createElement("a");
            link.href = csvUrl;
            link.download = filename;
            link.click();
        }
    };
    xhh.send(data);
}