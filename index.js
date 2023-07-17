const express = require('express')
const find = require('./find.js')
var xlsx = require('node-xlsx').default;

function formatter(data) {
  const keys = ['listing', 'title', 'price', 'stock', 'start', 'commentCount', 'url']
  const res = data.map(item => {
    const listItem = keys.map(key => {
      return item[key]
    })
    return listItem
  })
  return [{data: [keys, ...res]}]
}
// const data = [
//   {
//       name:'sheet-1',
//       data:[
//           ['姓名', '年龄'],
//           ['张三', 18],
//           ['李四', 19]
//       ]
//   }
// ];
// var buffer = xlsx.build(data);


const app = express();
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.post('/download', async(req, res) => {
  const result = await find()
  var buffer = xlsx.build(formatter(result));
  // console.log(result)
  res.end(buffer)
})
app.get('/info', async(req, res) => {
  const result = await find()
  // console.log(result)
  res.end(JSON.stringify(result))
})
app.listen(3000)

