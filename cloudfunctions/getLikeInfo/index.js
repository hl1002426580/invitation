// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const countResult = await db.collection('likeInfo').count()
  const total = countResult.total
  const batchTimes = Math.ceil(total / 100)
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('likeInfo').skip(i * 100).limit(100).get()
    tasks.push(promise)
  }

  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
  
}