// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const thisdb = db.collection('commentList');
  const result = await thisdb.doc(event.id).remove();
  return {
    ...result
  };
}