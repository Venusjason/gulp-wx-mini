function ObjToQueryString(obj) {
  let arr = []
  for (let key in obj) {
    if (obj[key] !== '' && obj[key]!== undefined) {
      arr.push(`${key}=${obj[key]}`)
    }
  }
  return arr.join('&')
}

function getPageInstance() {
  var pages = getCurrentPages();
  return pages[pages.length - 1];
}

const getTimestamp = date => {
  date = date || ''
  date = date.replace(/-/g, '/') // ios 不能用 -
  return new Date(date).getTime()
}

module.exports = {
  ObjToQueryString,
  getTimestamp,
  getPageInstance,
}