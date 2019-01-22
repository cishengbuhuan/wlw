export function timestampToTime(timestamp) {
	let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000]
	let Y, M, D, h, m, s;
	Y = date.getFullYear() + '-';
	M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
	h = date.getHours() + ':';
	m = date.getMinutes() + ':';
	s = date.getSeconds();
	return Y + M + D;
}

// 转化卡种类
export function translateCardKind(i) {
	if (i === 1) {
		return '大卡'
	} else if (i === 2) {
		return '双切'
	} else if (i === 3) {
		return '三切'
	} else if (i === 4) {
		return '2*2'
	} else if (i === 5) {
		return '5*6'
	} else if (i === 6) {
		return 'eSim'
	} else {
		return '其他'
	}
}

// 转化制式
export function translateSystem(i) {
	if (i === 1) {
		return '5G'
	} else if (i === 2) {
		return '4G'
	} else if (i === 3) {
		return '3G'
	} else if (i === 4) {
		return '2G'
	} else if (i === 5) {
		return 'NB'
	} else if (i === 6) {
		return 'EMTC'
	} else {
		return ''
	}
}

// 转化套餐
export function translatePackages(i) {
	if (i === 1) {
		return '月'
	} else if (i === 2) {
		return '半年'
	} else if (i === 3) {
		return '季'
	} else if (i === 4) {
		return '年'
	} else {
		return ''
	}
}

// 获取到运营商
export function getNetWork(i) {
	if (i === 1) {
		return '移动'
	} else if (i === 2) {
		return '联通'
	} else if (i === 3) {
		return '电信'
	}
}

// 获取到套餐流量
export function getPackageFlow(i) {
	if (i < 1000) {
		return i + 'M'
	} else {
		return (i / 1024) + 'G'
	}
}

// 转化充值方式
export function translateRechargeType(i) {
	if (i === 1) {
		return '平台充值'
	} else if (i === 2) {
		return '支付宝'
	} else if (i === 3) {
		return '线下转账'
	} else {
		return ''
	}
}
// 获取到在线状态
export function getOnlineStatus(i) {
	if (i == 1) {
		return '在线'
	} else if(i==0){
		return '离线'
	}
}
// 获取到激活状态
export function getActiveStatus(i) {
	if (i == 1) {
		return '未激活'
	} else if(i==0){
		return '已激活'
	}
}
// 获取到停卡状态
export function getStopStatus(i) {
	if (i == 0) {
		return '已停卡'
	} else {
		return '未停卡'
	}
}

// 返回本月的1号到当前天数日期
export const startDate = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-01`
export const endDate = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate() - 1}`


export function format(timestamp, formats) {
	// formats格式包括
	// 1. Y-m-d
	// 2. Y-m-d H:i:s
	// 3. Y年m月d日
	// 4. Y年m月d日 H时i分
	formats = formats || 'Y-m-d';

	let zero = function (value) {
		if (value < 10) {
			return '0' + value;
		}
		return value;
	};

	let myDate = timestamp ? new Date(timestamp) : new Date();

	let year = myDate.getFullYear();
	let month = zero(myDate.getMonth() + 1);
	let day = zero(myDate.getDate());

	let hour = zero(myDate.getHours());
	let minite = zero(myDate.getMinutes());
	let second = zero(myDate.getSeconds());

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


// export const baseUrl = 'http://192.168.1.28:8091'
export const baseUrl = 'http://www.91dream.net:8091'
// export const baseUrl = 'http://www.91dream.net:8090'