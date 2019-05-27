import Parser from "xml2json";
import Axios from "axios";
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
  }

  async vehicle(plate) {
    let isValid;
    try {
      const body = xmlVehicle(this.code, this.user, this.pass, plate);
      const res = await Axios({
        method: "post",
        url: url.vehicle,
        data: body,
        headers: {
          "Content-Type": "text/xml"
        }
      });

      const resParse = Parser.toJson(res.data, {
        object: true,
        trim: true
      });
      // return resParse;
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

  async conductor(cnh, cpf) {
    let isValid;
    try {
      const body = xmlConductor(this.code, this.user, this.pass, cpf, cnh);
      const res = await Axios({
        method: "post",
        url: url.conductor,
        data: body,
        headers: {
          "Content-Type": "text/xml"
        }
      });
      const resParse = Parser.toJson(res.data, {
        object: true,
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

export default Service;
