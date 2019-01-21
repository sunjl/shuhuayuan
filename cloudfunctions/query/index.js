const cloud = require('wx-server-sdk')
cloud.init()

exports.main = async(event, context) => {

  const db = cloud.database()
  const SIZE_LIMIT = 50

  var {
    collection,
    page,
    size,
    filter
  } = event

  if (!page || page < 0) {
    page = 0
  }
  if (!size || size > SIZE_LIMIT) {
    size = SIZE_LIMIT
  }
  const offset = page * size

  const countResult = await db.collection(collection).where(filter).count()
  const count = countResult.total
  const hasMore = page > Math.ceil(count / size)

  return db.collection(collection).where(filter).skip(offset).limit(size).get().then(res => {
    res.count = count
    res.hasMore = hasMore
    return res
  })

}