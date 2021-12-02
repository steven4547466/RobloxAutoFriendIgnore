const noblox = require("noblox.js")
const { dateFormat } = require("./dateformat/dateformat")
const config = require("./config")

async function stuff() {
  let cursor = null
  do {
    let requests = await noblox.getFriendRequests({ limit: 100 })
    // console.log(requests)
    for (let request of requests.data) {
      let created = new Date(request.created)
      if (created.getTime() > Date.now() - config.ageLimit * 60000) {
        noblox.declineFriendRequest(request.id)
        console.log(`Ignoring request from ${request.name} (${request.id}). Account created on ${dateFormat(created, "fullDate")}`)
      }
    }
    cursor = requests.nextPageCursor
  } while (cursor != null)
}

async function ignoreThemRequests() {
  const currentUser = await noblox.setCookie(config.cookie)
  console.log(`Logged in as ${currentUser.UserName} [${currentUser.UserID}]`)
  stuff()
  setInterval(stuff, 300000)
}

ignoreThemRequests()