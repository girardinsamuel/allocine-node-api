// const { AllocineClient } = require("allocine-node-api")
// let client = new AllocineClient({
//   secret_key: '29d185d98c984a359e6e6f26a0474269',
//   private_key: '100043982026
// })

// let theaters = await client.getTheaters(options)

import { Theaters, Helper } from "./src/theaters";

export class AllocineClient {
  constructor(config) {
    this.config = this._validateConfig(config);
    this.helper = new Helper(this.config);
    this.theaters = new Theaters(this.helper);
  }

  async getTheaters() {
    return this.theaters.showTimesByPostCode((postCode = "44000"));
  }

  // async getTheatersAround(options) {
  //   return this.theaters.getAround(options);
  // }

  _validateConfig(config) {
    if (!config.partner_key || typeof config.partner_key !== "string") {
      throw Error("partner_key must be a string");
    }
    return config;
  }
}
