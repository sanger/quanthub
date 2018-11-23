// server.js
const jsonServer = require('json-server')
const bodyParser = require('body-parser')
const server = jsonServer.create()
const router = jsonServer.router()
const middlewares = jsonServer.defaults()

server.use(middlewares)

// body parser allows us to accept json API requests.
server.use(bodyParser.json({type: 'application/vnd.api+json'}))

server.post('/api/v2/qc_assays', (req, res) => {
  if (req.body.data.attributes.qc_results[0].barcode === undefined) {
    res.sendStatus(422)
  }
  else {
    res.sendStatus(201)
  }
})

server.post('/v1/print_jobs', (req, res) => {
  res.status(201).jsonp({
    data: {
      type: 'print_jobs',
      id: 1
    }
  })
})

server.use(router)

server.listen(3000, () => {
  console.log('JSON Server is running')
})
