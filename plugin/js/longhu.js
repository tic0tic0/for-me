// Loon script to purify Longfor App content
const url = $request.url;
let body = $response.body;

try {
    let json = JSON.parse(body);
    
    // 1. 处理底栏过滤（服务/优选）
    if (url.includes("getTabList")) {
        if (json.data?.data?.length) {
            json.data.data = json.data.data.filter(item => 
                item.frameName !== "服务" && item.frameName !== "优选"
            );
        }
    }
    
    // 2. 处理首页内容
    else if (url.includes("getPageData/C2home")) {
        if (json.data?.components) {
            // 处理MiniCard组件中的"全部服务"
            const miniCard = json.data.components[1];
            if (miniCard?.componentType === "MiniCard" && miniCard.children) {
                const allServiceIndex = miniCard.children.findIndex(child => 
                    child.title === "全部服务" || child.content === "全部服务"
                );
                if (allServiceIndex !== -1) {
                    miniCard.children = miniCard.children.slice(0, allServiceIndex + 1);
                }
            }
            // 只保留前两个组件
            json.data.components = json.data.components.slice(0, 2);
        }
    }
    
    // 3. 处理会员页面
    else if (url.includes("/member/api/bff/pages/") && url.includes("/publicApi/v1/pageConfig")) {
        if (json.data?.components) {
            // 移除优选权益
            if (json.data.components[0]?.children) {
                json.data.components[0].children = json.data.components[0].children.filter(
                    child => child.taskId !== "33828"
                );
            }
            
            // 保留廉洁举报及之前内容
            if (json.data.components[1]?.children) {
                const idx = json.data.components[1].children.findIndex(
                    child => child.taskId === "53746"
                );
                if (idx !== -1) {
                    json.data.components[1].children = json.data.components[1].children.slice(0, idx + 1);
                }
            }
            
            // 只保留前两个组件，并清理空组件
            json.data.components = json.data.components.slice(0, 2);
            if (json.data.components[0]?.children?.length === 0) {
                json.data.components = json.data.components.slice(1);
            }
        }
    }
    
    body = JSON.stringify(json);
    
} catch (e) {
    console.log("JSON处理错误: " + e);
}

$done({body});
