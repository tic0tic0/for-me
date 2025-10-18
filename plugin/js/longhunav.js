// 文件名: longhu_nav_filter.js
// 功能: 过滤龙湖App底栏的"服务"和"优选"选项

if (typeof $response !== "undefined") {
    let body = $response.body;
    
    try {
        let jsonData = JSON.parse(body);
        
        // 检查数据结构是否符合预期
        if (jsonData && jsonData.data && jsonData.data.data && Array.isArray(jsonData.data.data)) {
            // 过滤掉"服务"和"优选"选项
            jsonData.data.data = jsonData.data.data.filter(item => {
                return item.frameName !== "服务" && item.frameName !== "优选";
            });
            
            // 重新序列化为JSON字符串
            body = JSON.stringify(jsonData);
        }
    } catch (e) {
        console.log("JSON解析/处理错误: " + e.message);
    }
    
    $done({body});
} else {
    $done({});
}
