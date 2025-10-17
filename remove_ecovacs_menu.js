// 去除科沃斯APP"我的"页面指定菜单项
const blockItems = ["我的E享卡", "我的收藏", "我的评论"];
const apiPath = "/user/getUserMenuInfo";

if ($request.url.includes(apiPath)) {
    try {
        let body = JSON.parse($response.body);
        
        // 过滤所有菜单组中的指定项
        if (body?.data?.menuList) {
            body.data.menuList.forEach(menuGroup => {
                if (menuGroup.menuItems) {
                    menuGroup.menuItems = menuGroup.menuItems.filter(
                        item => !blockItems.includes(item.menuName)
                    );
                }
            });
            
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
