const dict = new Map();

dict.set(0, { status: 200, message: 'OK', name: 'VEHICLE_SUCCESS' });
dict.set(1, { status: 404, message: 'Veículo não encontrado', name: 'VEHICLE_INVALID' });
dict.set(2, { status: 503, message: 'Veículo indisponível no momento', name: 'VEHICLE_LOADING' });
dict.set(3, { status: 500, message: 'Erro no processamento da consulta', name: 'VEHICLE_ERROR' });
dict.set(4, { status: 400, message: 'Placa inválida', name: 'VEHICLE_INVALID' });
dict.set(5, { status: 404, message: 'Renavam inválido, placa inexistente', name: 'VEHICLE_INVALID' });
dict.set(8, { status: 503, message: 'Renavam inválido, placa inexistente', name: 'VEHICLE_INVALID' });

export default dict;
