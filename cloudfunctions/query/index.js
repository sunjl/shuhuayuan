const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const MAX_LIMIT = 10

exports.main = async(event, context) => {
  const countResult = await db.collection('works').count()
  const total = countResult.total
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('works').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  return (await Promise.all(tasks)).reduce((acc, cur) => ({
    data: acc.data.concat(cur.data),
    errMsg: acc.errMsg,
  }))
}