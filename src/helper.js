var sha1 = require('sha1')
var fetch = require('node-fetch')
var agents = require('./agents')
var params = require('./parameters')
var utils = require('./utils')
var btoa = require('btoa')

class Helper {
  constructor(config) {
    this.baseUrl = params.ALLO_DEFAULT_URL_API
    this.secretKey = config.secret_key
    // this.axiosInstance = axios.create({
    //   timeout: 10000
    //   // crossdomain: true
    //   // headers: {
    //   //   Authorization: 'Bearer ' + token
    //   // }
    //   // params: {
    //   //   api_key: '92c237b39580e44b8a3a97e330a70415'
    //   // }
    // })
    this.defaultPayload = {
      format: 'json',
      partner: config.partner_key
    }
  }

  buildUrl(resource, payload) {
    let searchParametersData = {
      ...payload,
      ...this.defaultPayload
    }
    let searchParameters = new URLSearchParams()
    Object.keys(searchParametersData).forEach(parameterName => {
      searchParameters.append(
        parameterName,
        searchParametersData[parameterName]
      )
    })
    let nowDate = '20200401' // PHP date('Ymd')
    let searchQuery = `${searchParameters
      .toString()
      .replace('%2B', '+')}&sed=${nowDate}`
    // https://github.com/pvorb/node-sha1
    // Three options available to encode URI
    // escape() will not encode: @*/+
    // encodeURI() will not encode: ~!@#$&*()=:/,;?+'
    // encodeURIComponent() will not encode: ~!*()'
    console.log(this.secretKey + searchQuery)

    const sig = encodeURIComponent(
      btoa(sha1(this.secretKey + searchQuery, { asString: true }))
    )
    const queryUrl = `${this.baseUrl}/${resource}?${searchQuery}&sig=${sig}`

    return queryUrl
  }

  /**
   * Retourne un user-agent aléatoire.
   */
  getRandomUserAgent() {
    const v = `${utils.getRandomInteger(1, 4)}.${utils.getRandomInteger(0, 9)}`
    const a = utils.getRandomInteger(0, 9)
    const b = utils.getRandomInteger(0, 99)
    const c = utils.getRandomInteger(0, 999)
    return agents.getUserAgent(v, a, b, c)
  }

  /**
   * Retourne une IP aléatoire.
   */
  getRandomIp() {
    return (
      utils.getRandomInteger(0, 255) +
      '.' +
      utils.getRandomInteger(0, 255) +
      '.' +
      utils.getRandomInteger(0, 255) +
      '.' +
      utils.getRandomInteger(0, 255)
    )
  }

  makeRequest(url) {
    return fetch(url, {
      method: 'get',
      mode: 'cors',
      headers: {
        'User-Agent': this.getRandomUserAgent(),
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
  }
}

exports.Helper = Helper
