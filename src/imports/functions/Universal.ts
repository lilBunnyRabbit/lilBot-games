import request from "request";

export function getData(url: string, {json, headers}: {
    json?: boolean,
    headers?: any
}): any {
    return new Promise(function (resolve, reject) {
        request({
            headers: headers ? headers : {},
            uri: url,
            method: "GET",
            json: json ? json : true
        }, function (error, res, body) {
            if (!error && res.statusCode === 200) resolve(body);
            else reject(error);
        });
    });
}

export function generateRandomValue (length: number): string {
    let chars = "abcdefghijkmnpqrstuvwxyz123456789";
    let password = "";
    for (let i = 0; i < length; i++) password += chars.charAt(Math.floor(Math.random() * chars.length));
    return password;
}