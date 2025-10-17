/*
名称: 科沃斯广告无感去除
功能: 拦截科沃斯APP广告请求并返回空数据，避免APP报错
基于抓包数据调整版本
*/

let obj = JSON.parse($response.body);

// 根据实际抓包的成功响应结构进行调整
obj = {
  "code": "0000",
  "data": {
    "playTime": 0, // 播放时间设为0，表示不播放
    "items": [],   // 关键：广告项目数组设为空数组
    "adType": "ALERT" // 保持原广告类型
  },
  "success": true,
  "msg": "操作成功",
  "time": new Date().getTime()
};

$done({body: JSON.stringify(obj)});
