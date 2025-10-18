(function() {
    let body = $response.body;
    try {
        let json = JSON.parse(body);
        if (json && json.data && Array.isArray(json.data.components)) {
            // 过滤components数组，移除指定板块
            json.data.components = json.data.components.filter(component => {
                // 移除bizType为"marketingTool"的板块
                if (component.bizType === "marketingTool") {
                    return false;
                }
                // 移除bizType为"good"且title为"商场优惠"的板块
                if (component.bizType === "good" && component.good && component.good.title === "商场优惠") {
                    return false;
                }
                // 移除bizType为"channel"且包含title为"逛商场"的channel的板块
                if (component.bizType === "channel" && Array.isArray(component.channels)) {
                    let hasMallChannel = component.channels.some(channel => channel.title === "逛商场");
                    if (hasMallChannel) {
                        return false;
                    }
                }
                // 保留其他板块
                return true;
            });
            body = JSON.stringify(json);
        }
    } catch (e) {
        console.log("脚本执行错误: " + e);
    }
    $done({body});
})();
