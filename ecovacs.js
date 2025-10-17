// 简化版脚本 - 去除科沃斯APP底部导航栏
const urlRegex = /^https:\/\/gl-cn-api\.ecovacs\.cn\/.*getBottomNavigateInfoList/;
const blockItems = ["商城", "发现"];

if (urlRegex.test($request.url)) {
    try {
        let body = JSON.parse($response.body);
        
        if (body?.data?.navigateInfoResponseList) {
            // 记录原始数量
            const originalCount = body.data.navigateInfoResponseList.length;
            
            // 过滤导航项
            body.data.navigateInfoResponseList = body.data.navigateInfoResponseList.filter(
                item => !blockItems.includes(item.iconName)
            );
            
            console.log(`导航项数量: ${originalCount} → ${body.data.navigateInfoResponseList.length}`);
            console.log(`已移除: ${blockItems.join(', ')}`);
            
            $done({ body: JSON.stringify(body) });
        } else {
            $done({});
        }
    } catch (e) {
        console.log(`处理失败: ${e.message}`);
        $done({});
    }
} else {
    $done({});
}
