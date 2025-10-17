// 科沃斯APP菜单与导航栏过滤脚本
const url = $request.url;

// 处理底部导航栏
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
// 处理"我的"页面菜单
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
// 不匹配任何处理条件
else {
    $done({});
}
