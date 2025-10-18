// Loon script to purify Longfor App content
const url = $request.url;
let body = $response.body;

try {
    let json = JSON.parse(body);
    
    // 1. 处理底栏过滤（服务/优选）- 使用已确认正常工作的版本
    if (url.includes("/nav/query/app")) {
        if (json && json.data && json.data.data && Array.isArray(json.data.data)) {
            // 过滤掉"服务"和"优选"选项
            json.data.data = json.data.data.filter(item => {
                return item.frameName !== "服务" && item.frameName !== "优选";
            });
            body = JSON.stringify(json);
        }
    }
    
    // 2. 处理首页内容
    else if (url.includes("getPageData/C2home")) {
        if (json.data && json.data.components) {
            // 找到MiniCard组件（第二个组件）
            if (json.data.components.length > 1 && json.data.components[1].componentType === "MiniCard") {
                const miniCardComponent = json.data.components[1];
                
                // 找到"全部服务"的索引位置
                let allServiceIndex = -1;
                if (miniCardComponent.children && Array.isArray(miniCardComponent.children)) {
                    for (let i = 0; i < miniCardComponent.children.length; i++) {
                        if (miniCardComponent.children[i].title === "全部服务" || 
                            miniCardComponent.children[i].content === "全部服务") {
                            allServiceIndex = i;
                            break;
                        }
                    }
                    
                    // 如果找到了"全部服务"，则保留它之前的所有项目
                    if (allServiceIndex !== -1) {
                        miniCardComponent.children = miniCardComponent.children.slice(0, allServiceIndex + 1);
                    }
                }
            }
            
            // 只保留前两个组件（headBanner和MiniCard），移除后面的所有组件
            json.data.components = json.data.components.slice(0, 2);
            
            body = JSON.stringify(json);
        }
    }
    
    // 3. 处理会员页面
    else if (url.includes("/supera/member/api/bff/pages/") && url.includes("/publicApi/v1/pageConfig")) {
        if (json.data && json.data.components) {
            // 处理第一个组件：移除"优选权益"（taskId为33828）
            if (json.data.components.length > 0 && json.data.components[0].componentType === "Banner") {
                const bannerComponent = json.data.components[0];
                if (bannerComponent.children && Array.isArray(bannerComponent.children)) {
                    bannerComponent.children = bannerComponent.children.filter(child => 
                        child.taskId !== "33828" && child.taskName !== "优选权益"
                    );
                }
            }
            
            // 处理第二个组件：找到"廉洁举报"的位置，并保留它及之前的所有项目
            if (json.data.components.length > 1 && json.data.components[1].componentType === "toolsEntry") {
                const toolsComponent = json.data.components[1];
                
                if (toolsComponent.children && Array.isArray(toolsComponent.children)) {
                    let integrityReportIndex = -1;
                    
                    // 找到"廉洁举报"的索引位置
                    for (let i = 0; i < toolsComponent.children.length; i++) {
                        if (toolsComponent.children[i].taskId === "53746" || 
                            toolsComponent.children[i].title === "廉洁举报") {
                            integrityReportIndex = i;
                            break;
                        }
                    }
                    
                    // 如果找到了"廉洁举报"，则保留它及之前的所有项目
                    if (integrityReportIndex !== -1) {
                        toolsComponent.children = toolsComponent.children.slice(0, integrityReportIndex + 1);
                    }
                }
            }
            
            // 只保留前两个组件，移除后面的所有组件
            json.data.components = json.data.components.slice(0, 2);
            
            // 如果第一个组件（Banner）的children为空，则移除整个组件
            if (json.data.components[0].children && json.data.components[0].children.length === 0) {
                json.data.components = json.data.components.slice(1);
            }
            
            body = JSON.stringify(json);
        }
    }
    
} catch (e) {
    console.log("JSON处理错误: " + e);
}

$done({body});
