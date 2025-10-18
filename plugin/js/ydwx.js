// 完全移除一点万象App首页所有内容模块
const removeAllContent = (response) => {
    try {
        // 解析响应体
        let body = JSON.parse(response.body);
        
        // 检查是否存在数据部分
        if (body && body.data && body.data.list) {
            // 清空所有内容模块
            body.data.list = [];
            
            // 更新分页信息
            body.data.total = 0;
            body.data.pages = 0;
            body.data.pageNum = 1;
            
            // 返回修改后的响应体
            response.body = JSON.stringify(body);
        }
        
        return response;
    } catch (e) {
        // 错误处理：返回原始响应
        console.log(`处理响应时出错: ${e}`);
        return response;
    }
};

// Loon脚本入口
$done(removeAllContent($response));
