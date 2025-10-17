// 科沃斯APP多功能过滤脚本
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
// 3. 处理用户信息（扩展匹配）
else if (url.includes("/user/getUserInfo") || url.includes("/user/info") || url.includes("/member/getMyMemberInfo")) {
    try {
        let body = JSON.parse($response.body);
        console.log(`处理用户信息接口: ${url}`);
        
        // 多种成功状态判断
        const isSuccess = body?.code === "0000" || body?.success === true;
        
        if (isSuccess && body.data) {
            // 创建精简后的数据结构
            const simplifiedData = {
                nickName: body.data.nickName || body.data.username || "",
                memberInfo: {
                    userlevelName: body.data.memberInfo?.userlevelName || 
                                  body.data.levelName || 
                                  body.data.userLevel || ""
                }
            };
            
            // 保留必要的顶层字段
            const result = {
                code: body.code || "0000",
                success: body.success !== undefined ? body.success : true,
                msg: body.msg || "操作成功",
                data: simplifiedData,
                time: body.time || Date.now()
            };
            
            console.log(`✅ 用户信息已精简: ${result.data.nickName} - ${result.data.memberInfo.userlevelName}`);
            
            $done({ body: JSON.stringify(result) });
        } else {
            console.log(`❌ 用户信息结构不匹配`);
            console.log(`响应体: ${JSON.stringify(body).substring(0, 200)}...`);
            $done({});
        }
    } catch (e) {
        console.log(`❌ 用户信息处理失败: ${e.message}`);
        $done({});
    }
} 
// 4. 处理会员信息（完整版）- 去除广告并精简数据
else if (url.includes("/user/getMemberInfo")) {
    try {
        let body = JSON.parse($response.body);
        console.log(`处理会员信息接口: ${url}`);
        
        if (body?.code === "0000" && body?.data) {
            // 移除广告相关字段
            const removeFields = ["slogan", "sloganUrl"];
            removeFields.forEach(field => {
                if (body.data[field]) {
                    console.log(`✅ 移除广告字段: ${field}`);
                    delete body.data[field];
                }
            });
            
            // 精简数据 - 只保留核心信息
            const essentialFields = [
                "nickName", "userName", "userlevelName", "userlevel",
                "integral", "exp", "expUpNeed", "isMember", "memberNo"
            ];
            
            const originalData = {...body.data};
            body.data = {};
            
            essentialFields.forEach(field => {
                if (originalData[field] !== undefined) {
                    body.data[field] = originalData[field];
                }
            });
            
            console.log(`✅ 会员信息已精简并移除广告`);
            $done({ body: JSON.stringify(body) });
        } else {
            $done({});
        }
    } catch (e) {
        console.log(`❌ 会员信息处理失败: ${e.message}`);
        $done({});
    }
}

else {
    $done({});
}
