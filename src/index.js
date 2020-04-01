// const { AllocineClient } = require("allocine-node-api")
// let client = new AllocineClient({
//   secret_key: '29d185d98c984a359e6e6f26a0474269',
//   private_key: '100043982026
// })

// let theaters = await client.getTheaters(options)
var helper = require('./helper')

class AllocineClient {
  constructor(config) {
    this.config = this._validateConfig(config)
    this.helper = new helper.Helper(this.config)
  }

  //  * Récupérer une liste de cinémas et la liste des films qui y passent actuellement en fonction d'un code postal.
  //  *
  //  * @param mixed $zip Le code postal de la ville du/des cinéma(s).
  //  * @param $date=null Spécifier une date pour les horaires.
  //  * @param $movieCode=null Spécifier les horaires d'un film (par identifiant).
  //  * @param int $count=10 Le nombre maximum de résultats par page.
  //  * @param int $page=1 La page des résultats.
  //  *
  //  * @return AlloData|array|false
  //  */
  showTimesByPostCode(
    postCode,
    date = null,
    movieCode = null,
    count = 10,
    page = 1
  ) {
    const payload = {
      zip: postCode,
      count: count,
      page: page
    }
    const url = this.helper.buildUrl('showtimelist', payload)
    console.log('URL: ', url)
    const ip = this.helper.getRandomIp()
    console.log('IP: ', ip)
    // this.helper.axiosInstance.defaults.headers.common['CLIENT_IP'] = ip
    // return this.helper.axiosInstance.get(url, {
    //   headers: {
    //     USER_AGENT: this.helper.getRandomUserAgent(),
    //     REMOTE_ADDR: ip
    //   }
    // })
    return this.helper.makeRequest(url)
  }

  // async getTheaters() {
  //   return this.theaters.showTimesByPostCode((postCode = '44000'))
  // }

  // async getTheatersAround(options) {
  //   return this.theaters.getAround(options);
  // }

  _validateConfig(config) {
    if (!config.partner_key || typeof config.partner_key !== 'string') {
      throw Error('partner_key must be a string')
    }
    return config
  }
}

exports.AllocineClient = AllocineClient
