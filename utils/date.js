const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/**
* 时间戳转化为年 月 日 时 分 秒
* ts: 传入时间戳
* format：返回格式，支持自定义，但参数必须与formateArr里保持一致
*/
function tsFormatTime(timestamp, format) {

  const formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  let returnArr = [];

  let date = new Date(timestamp);
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()
  returnArr.push(year, month, day, hour, minute, second);
  returnArr = returnArr.map(formatNumber);

  var o = {
    "M+": month,
    "d+": day,
    "h+": hour,
    "m+": minute,
    "s+": second
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (year + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return format ;
}

function formatTimeStamp(data) {
  return Date.parse(new Date(`${data}`)) || Date.parse(new Date(`${data.replace(/-/g, '/')}`));
}

module.exports = {
  tsFormatTime: tsFormatTime,
  formatTimeStamp: formatTimeStamp,
}