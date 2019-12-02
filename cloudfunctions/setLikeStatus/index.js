// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const set = db.collection('likeInfo')
  if(event.type == 'add'){
    await set.add({
      data:{
        openId:event.openId
      }
    });
    return {
      status:'success'
    }
  }else{
    await set.where({openId:event.openId}).remove();
    return{
      status:'success'
    }
  }
}