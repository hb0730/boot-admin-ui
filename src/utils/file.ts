export function downloadFileBlob(
  data: any,
  contentType: string,
  contentDisposition: string
) {
  const blob = new Blob([data], {
    type: contentType
  });
  const downloadElement = document.createElement("a");
  const href = window.URL.createObjectURL(blob);
  const patt = new RegExp("filename=([^;]+\\.[^\\.;]+);*");
  const result = patt.exec(contentDisposition);
  const filename = decodeURI(escape(result[1])); // 处理文件名,解决中文乱码问题
  downloadElement.style.display = "none";
  downloadElement.href = href;
  downloadElement.download = filename; // 下载后文件名
  document.body.appendChild(downloadElement);
  downloadElement.click(); // 点击下载
  document.body.removeChild(downloadElement); // 下载完成移除元素
  window.URL.revokeObjectURL(href); // 释放掉blob对象
}
