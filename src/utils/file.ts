/**
 * 文件大小转换
 * @param a 表示要被转化的容量大小，以字节为单位
 * @param b 表示如果转换时出小数，四舍五入保留多少位 默认为2位小数
 */
export function formatBytes(a:number, b:number) {
    if (0 == a) return "0 B";
    const c = 1024, d = b || 2, e = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        f = Math.floor(Math.log(a) / Math.log(c));
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
}

export function getBase64(file: File) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
