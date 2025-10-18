(function() {
    let body = $response.body;
    try {
        let obj = JSON.parse(body);
        if (obj.pageParams && Array.isArray(obj.pageParams)) {
            obj.pageParams.forEach(item => {
                if (item.hasOwnProperty('rcPromotion')) {
                    delete item.rcPromotion;
                }
            });
        }
        $done({body: JSON.stringify(obj)});
    } catch (error) {
        console.log('JSON处理错误: ' + error);
        $done({body: body});
    }
})();
