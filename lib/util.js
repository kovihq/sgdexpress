/* eslint-disable max-len */

export const xmlConductor = (...args) => {
  const [code, user, pass, cpf, cnh] = args;
  return `<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
            <Consulta_CNH_todos_estados_JSON xmlns="http://tempuri.org/">
                 <Codigo>${code}</Codigo>
                <Usuario>${user}</Usuario>
                <Senha>${pass}</Senha>
                <Cpf>${cpf}</Cpf>
                <Nregistro>${cnh}</Nregistro>
                <NRG></NRG>
                <N_RENACH></N_RENACH>
                <DataPrimeiraHabilita></DataPrimeiraHabilita>
                <Numero_Espelho></Numero_Espelho>
                <Nome></Nome>
                <Uf></Uf>
                <ConsultaOrigem>17</ConsultaOrigem>
            </Consulta_CNH_todos_estados_JSON>
        </soap:Body>
    </soap:Envelope> 
`;
};

export const xmlVehicle = (...args) => {
  const [code, user, pass, plate] = args;
  return `<?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <ConsultaVeiculoJson xmlns="http://tempuri.org/">
            <codigo>${code}</codigo>
            <usuario>${user}</usuario>
            <senha>${pass}</senha>
            <placa>${plate}</placa>
            <origem>17</origem>
          </ConsultaVeiculoJson>
        </soap:Body>
      </soap:Envelope>`;
};

export const clean = (access) => {
  const obj = {};
  if (access && access.ConsultaVeiculoJsonResponse.ConsultaVeiculoJsonResult) {
    obj.result = JSON.parse(access.ConsultaVeiculoJsonResponse.ConsultaVeiculoJsonResult);
  } else {
    return false;
  }
  if (obj.result) {
    obj.query = obj.result.CONSULTA2300.CONSULTAS.CONSULTA;
  }
  return obj;
};

export const cleanCnh = (access) => {
  const obj = {};
  if (access && access.Consulta_CNH_todos_estados_JSONResponse.Consulta_CNH_todos_estados_JSONResult) {
    obj.result = JSON.parse(access.Consulta_CNH_todos_estados_JSONResponse.Consulta_CNH_todos_estados_JSONResult);
  } else {
    return false;
  }
  if (obj.result) {
    obj.query = obj.result.CONSULTA1650.CONSULTAS.CONSULTA;
  }
  return obj;
};

export const valid = (query) => {
  const code = Number(query.RETORNOEXECUCAO);
  const message = query.DESCRICAO;

  if (code === 0) {
    return { code: 0, status: true };
  } else if ('Placa inválida, verifique os dados enviado e tente novamente.' === message && code === 999) {
    return { code: 1, status: false };
  } else if ('Consulta temporariamente indisponível. Tente novamente dentro de alguns instantes.' === message && code === 999) {
    return { code: 2, status: false };
  } else if ('RENAVAM INVÁLIDO' === message && code === 3) {
    return { code: 8, status: false };
  } else {
    return { code: 3, status: false };
  }
};

export const validCnh = (query) => {
  const code = Number(query.RETORNOEXECUCAO);
  const message = query.DESCRICAO;
  if (code === 0) {
    return { code: 0, status: true };
  } else if ('Placa inválida, verifique os dados enviado e tente novamente.' === message && code === 999) {
    return { code: 1, status: false };
  } else if ('Consulta temporariamente indisponível. Tente novamente dentro de alguns instantes.' === message && code === 999) {
    return { code: 2, status: false };
  } else if ('RENAVAM INVÁLIDO' === message) {
    return { code: 8, status: false };
  } else {
    return { code: 3, status: false };
  }
};

export const url = {
  vehicle: 'http://oxn.sgdexpress.com.br/ConsultasString.asmx?WSDL',
  conductor: 'http://oxn.sgdexpress.com.br/Consultas.asmx?op=Consulta_CNH_todos_estados_JSON&WSDL',
};
