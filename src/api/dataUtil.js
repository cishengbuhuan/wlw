export function timestampToTime(timestamp) {
  let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000]
  let Y,M,D,h,m,s;
  Y = date.getFullYear() + '-';
  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  D = date.getDate() + ' ';
  h = date.getHours() + ':';
  m = date.getMinutes() + ':';
  s = date.getSeconds();
  return Y+M+D;
}

export function format(timestamp, formats) {
  // formats格式包括
  // 1. Y-m-d
  // 2. Y-m-d H:i:s
  // 3. Y年m月d日
  // 4. Y年m月d日 H时i分
  formats = formats || 'Y-m-d';

  var zero = function (value) {
    if (value < 10) {
      return '0' + value;
    }
    return value;
  };

  var myDate = timestamp ? new Date(timestamp) : new Date();

  var year = myDate.getFullYear();
  var month = zero(myDate.getMonth() + 1);
  var day = zero(myDate.getDate());

  var hour = zero(myDate.getHours());
  var minite = zero(myDate.getMinutes());
  var second = zero(myDate.getSeconds());

  return formats.replace(/Y|m|d|H|i|s/ig, function (matches) {
    return ({
      Y: year,
      m: month,
      d: day,
      H: hour,
      i: minite,
      s: second
    })[matches];
  });
}
