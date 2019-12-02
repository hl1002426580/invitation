// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const countResult = await db.collection('commentList').count();
  const total = countResult.total;  
  const { data } = await db.collection('commentList').orderBy('createTime','desc').skip((event.pageNo - 1) * event.pageSize).limit(event.pageSize).get();
  return {
      data,
      total,
    openid: wxContext.OPENID
  };
}