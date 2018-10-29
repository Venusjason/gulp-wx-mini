// html vue转化小程序的wxml
function replaceHtml(str) {
  let newStr = str
    .replace(/<(div|p)/g, '<view')
    .replace(/<\/[^>]*(div|p)>/g, '</view>')
    .replace(/<(span|em)/g, '<text')
    .replace(/<\/[^>]*(span|em)>/g, '</text>')
    .replace(/<img/g, '<image')
  // :name="name" => name="{{name}}"
  const reg1 = /\s:.*?\=".*?\"/g
  let result = []
  let arr = newStr.match(reg1)
  if (!arr) return newStr
  arr.forEach((ele, i) => {
    let index = newStr.indexOf(ele)
    let strArr = [newStr.slice(0, index), newStr.slice(index + ele.length)]
    let newEle = ele.replace(':', '')
    let newEleArr = newEle.split('')
    let a = newEleArr.indexOf('"')
    let b = newEleArr.lastIndexOf('"')
    newEleArr[a] = '"{{'
    newEleArr[b] = '}}"'
    newEle = newEleArr.join('')

    result.push(strArr[0], newEle)
    newStr = strArr[1]
    if (i === arr.length - 1 && newStr !== '') {
      result.push(newStr)
    }
  })
  newStr = result.join('')
  newStr = newStr.replace('@click', 'bindtap')
  return newStr
}

module.exports = replaceHtml