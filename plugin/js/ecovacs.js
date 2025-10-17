// 科沃斯APP多功能过滤脚本（合并版）
const url = $request.url;

// 1. 处理底部导航栏
if (/^https:\/\/gl-cn-api\.ecovacs\.cn\/.*getBottomNavigateInfoList/.test(url)) {
    try {
        let body = JSON.parse($response.body);
        const blockNavItems = ["商城", "发现"];
        
        if (body?.data?.navigateInfoResponseList) {
            const originalCount = body.data.navigateInfoResponseList.length;
            
            body.data.navigateInfoResponseList = body.data.navigateInfoResponseList.filter(
                item => !blockNavItems.includes(item.iconName)
            );
            
            console.log(`导航项数量: ${originalCount} → ${body.data.navigateInfoResponseList.length}`);
            console.log(`已移除导航项: ${blockNavItems.join(', ')}`);
            
            $done({ body: JSON.stringify(body) });
        } else {
            $done({});
        }
    } catch (e) {
        console.log(`导航栏处理失败: ${e.message}`);
        $done({});
    }
} 
// 2. 处理"我的"页面菜单
else if (url.includes("/user/getUserMenuInfo")) {
    try {
        let body = JSON.parse($response.body);
        const blockMenuItems = ["我的E享卡", "我的收藏", "我的评论"];
        
        if (body?.data?.menuList) {
            let totalRemoved = 0;
            let totalOriginal = 0;
            
            body.data.menuList.forEach(menuGroup => {
                if (menuGroup.menuItems) {
                    const originalCount = menuGroup.menuItems.length;
                    totalOriginal += originalCount;
                    
                    menuGroup.menuItems = menuGroup.menuItems.filter(
                        item => !blockMenuItems.includes(item.menuName)
                    );
                    
                    const removedCount = originalCount - menuGroup.menuItems.length;
                    totalRemoved += removedCount;
                    
                    if (removedCount > 0) {
                        console.log(`菜单组 ${menuGroup.menuPositionKey}: 移除了 ${removedCount} 项`);
                    }
                }
            });
            
            console.log(`总计: ${totalOriginal} → ${totalOriginal - totalRemoved} (移除了 ${totalRemoved} 项)`);
            console.log(`已移除菜单项: ${blockMenuItems.join(', ')}`);
            
            $done({ body: JSON.stringify(body) });
        } else {
            $done({});
        }
    } catch (e) {
        console.log(`菜单处理失败: ${e.message}`);
        $done({});
    }
}
// 3. 处理"我的"页面广告内容
else if (/\/user\/(profile|getUserInfo|info)/.test(url)) {
    try {
        let body = JSON.parse($response.body);
        
        // 检查响应是否成功
        if (body.code === "0000" && body.success) {
            // 创建新的响应对象，只保留需要的字段
            const cleanData = {
                code: "0000",
                data: {
                    integral: body.data?.integral,
                    exp: body.data?.exp,
                    availableTicketCount: body.data?.availableTicketCount,
                    nickName: body.data?.nickName,
                    headImg: body.data?.headImg
                },
                success: true,
                msg: "操作成功",
                time: Date.now()
            };
            
            console.log("已移除我的页面广告内容，保留用户基本信息");
            $done({ body: JSON.stringify(cleanData) });
        } else {
            // 如果响应不成功，返回原始响应
            $done({});
        }
    } catch (e) {
        console.log(`我的页面广告处理失败: ${e.message}`);
        $done({});
    }
}
// 其他请求不做处理
else {
    $done({});
}
