// 清除所有响应内容，返回空数据结构
const cleanResponse = () => {
  const emptyData = {
    code: 0,
    message: null,
    data: {
      pages: 0,
      list: [],
      total: 0,
      pageNum: 1
    },
    timestamp: Date.now()
  };
  
  $done({ body: JSON.stringify(emptyData) });
};

// 执行清理操作
cleanResponse();
