var NodeAPI = require('../src/index')

const AllocineAPI = new NodeAPI.AllocineClient({
  secret_key: '29d185d98c984a359e6e6f26a0474269',
  partner_key: '100043982026'
})

AllocineAPI.showTimesByPostCode(44000)
  .then(results => {
    console.log(results)
  })
  .catch(error => {
    console.log(error)
  })
