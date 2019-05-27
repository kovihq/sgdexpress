import { parseString } from "xml2js";
import got from "got";
import {
  xmlConductor,
  xmlVehicle,
  url,
  clean,
  valid,
  cleanCnh,
  validCnh
} from "./lib/util";
import DetranError from "./lib/error";
import mapError from "./lib/mapErrors";

class Service {
  constructor(code, user, pass) {
    this.code = code;
    this.user = user;
    this.pass = pass;
    this.headers = {
      "Content-Type": "text/xml"
    };
  }

  async vehicle(plate) {
    let isValid;
    try {
      const body = xmlVehicle(this.code, this.user, this.pass, plate);
      const res = await got.post(url.vehicle, { headers: this.headers, body });
      const resParse = await this._parseString(res.body, {
        explicitArray: false,
        trim: true
      });
      const access = clean(resParse["soap:Envelope"]["soap:Body"]);
      if (!access) return false;
      isValid = valid(access.query);
      if (isValid.status) return access.query;
      throw new Error(access.query.DESCRICAO);
    } catch (err) {
      let _err = {};
      if (await mapError.has(isValid.code)) {
        _err = mapError.get(isValid.code);
      }
      const data = await { ...{ status: 500, message: err.message }, ..._err };
      return new DetranError(data.message, data.status, data.name);
    }
  }
  //
  async conductor(cnh, cpf) {
    let isValid;
    try {
      const body = xmlConductor(this.code, this.user, this.pass, cpf, cnh);
      const res = await got.post(url.conductor, {
        headers: this.headers,
        body
      });
      const resParse = await this._parseString(res.body, {
        explicitArray: false,
        trim: true
      });
      const access = cleanCnh(resParse["soap:Envelope"]["soap:Body"]);
      if (!access) return false;
      isValid = validCnh(access.query);
      if (isValid.status) return access.query;
      throw new Error(access.query.DESCRICAO);
    } catch (err) {
      let _err = {};
      if (mapError.has(isValid.code)) {
        _err = mapError.get(isValid.code);
      }
      const data = { ...{ status: 500, message: err.message }, ..._err };
      return new DetranError(data.message, data.status);
    }
  }
}

export { Service };
