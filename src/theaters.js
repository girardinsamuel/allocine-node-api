import getUserAgent from "./agents";
import params from "./parameters";
import getRandomInteger from "./utils";
sha1 = require("sha1");
import axios from "axios";

export class Helper {
  constructor(config) {
    this.baseUrl = params.ALLO_DEFAULT_URL_API;
    this.secretKey = config.secret_key;
    this.axiosInstance = axios.create({
      timeout: 10000
      // crossdomain: true
      // headers: {
      //   Authorization: 'Bearer ' + token
      // }
      // params: {
      //   api_key: '92c237b39580e44b8a3a97e330a70415'
      // }
    });
  }

  buildUrl(resource, payload) {
    let searchParameters = new URLSearchParams();
    Object.keys(searchParametersData).forEach(parameterName => {
      searchParameters.append(
        parameterName,
        searchParametersData[parameterName]
      );
    });
    let searchQuery = `${searchParameters
      .toString()
      .replace("%2B", "+")}&sed=${date("Ymd")}`;

    // https://github.com/pvorb/node-sha1
    // Three options available to encode URI
    // escape() will not encode: @*/+
    // encodeURI() will not encode: ~!@#$&*()=:/,;?+'
    // encodeURIComponent() will not encode: ~!*()'
    const sig = encodeURIComponent(
      btoa(sha1(this.secretKey + searchQuery, { asBytes: true }))
    );
    const queryUrl = `${this.baseUrl}/${resource}?${searchQuery}&sig=${sig}`;

    return queryUrl;
  }

  /**
   * Retourne un user-agent aléatoire.
   */
  getRandomUserAgent() {
    const v = `${getRandomInteger(1, 4)}.${getRandomInteger(0, 9)}`;
    const a = getRandomInteger(0, 9);
    const b = getRandomInteger(0, 99);
    const c = getRandomInteger(0, 999);
    return getUserAgent(v, a, b, c);
  }

  getRandomIp() {
    return (
      getRandomInteger(0, 255) +
      "." +
      getRandomInteger(0, 255) +
      "." +
      getRandomInteger(0, 255) +
      "." +
      getRandomInteger(0, 255)
    );
  }
}

/**
 * Retourne une IP aléatoire.
 */

export class Theaters {
  constructor(helper) {
    this.helper = helper;
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
  showTimesByPostCode = (
    postCode,
    date = null,
    movieCode = null,
    count = 10,
    page = 1
  ) => {
    const payload = {
      zip: postCode,
      count: count,
      page: page
    };
    const url = this.helper.buildUrl("showtimelist", payload);
    console.log("URL: ", url);
    const ip = this.helper.getRandomIp();
    console.log("IP: ", ip);
    this.helper.axiosInstance.defaults.headers.common["CLIENT_IP"] = ip;
    return this.helper.axiosInstance.get(url, {
      headers: {
        USER_AGENT: this.helper.getRandomUserAgent(),
        REMOTE_ADDR: ip
      }
    });
  };
}
