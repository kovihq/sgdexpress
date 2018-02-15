import test from 'ava';
import Service from '../index';

const find = Service('code', 'user', 'pass');

test('conductor', async (t) => {
  const r = await find.conductor('05927540940', '38968936889');
  t.log(r);
});

test('placa', async (t) => {
  const r = await find.vehicle('GKC3998');
  t.is(r.VEICULO.MARCADESC, 'FIAT/MOBI EASY ON');
});

test('not found', async (t) => {
  try {
    await await find.vehicle('AAA0000');
  } catch (err) {
    t.is(err.message, 'Renavam inválido, placa inexistente');
    t.is(err.status, 404);
  }
});

