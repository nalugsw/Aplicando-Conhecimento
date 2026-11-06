import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { TipoTransacao, Transacao } from './schemas/transacao.schema';
import { TransacoesService } from './transacoes.service';

const transacoesExemplo: Transacao[] = [
  { descricao: 'Salário', valor: 3000, tipo: TipoTransacao.RECEITA, categoria: 'Trabalho', consumoConsciente: true },
  { descricao: 'Aluguel', valor: 1200, tipo: TipoTransacao.DESPESA, categoria: 'Moradia', consumoConsciente: true },
  { descricao: 'Conta de Luz', valor: 150.5, tipo: TipoTransacao.DESPESA, categoria: 'Moradia', consumoConsciente: true },
  { descricao: 'Delivery', valor: 89.9, tipo: TipoTransacao.DESPESA, categoria: 'Alimentação', consumoConsciente: false },
  { descricao: 'Compra de Roupas', valor: 250, tipo: TipoTransacao.DESPESA, categoria: 'Lazer', consumoConsciente: false },
];

describe('TransacoesService', () => {
  let service: TransacoesService;

  const modelMock = {
    find: jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(transacoesExemplo),
        }),
      }),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransacoesService,
        { provide: getModelToken(Transacao.name), useValue: modelMock },
      ],
    }).compile();

    service = module.get<TransacoesService>(TransacoesService);
  });

  it('calcula saldo, total de despesas e gasto por impulso', () => {
    const m = service.calcularMetricas(transacoesExemplo);
    expect(m.totalDespesas).toBe(1690.4);
    expect(m.saldoTotal).toBe(1309.6);
    expect(m.totalGastoImpulso).toBe(339.9);
  });

  it('retorna zeros quando não há transações', () => {
    expect(service.calcularMetricas([])).toEqual({
      saldoTotal: 0,
      totalDespesas: 0,
      totalGastoImpulso: 0,
    });
  });

  it('receita com consumoConsciente=false não entra no gasto por impulso', () => {
    const m = service.calcularMetricas([
      { descricao: 'Freela', valor: 500, tipo: TipoTransacao.RECEITA, categoria: 'Trabalho', consumoConsciente: false },
    ]);
    expect(m.totalGastoImpulso).toBe(0);
    expect(m.saldoTotal).toBe(500);
  });

  it('findAll devolve historico e metricas', async () => {
    const r = await service.findAll();
    expect(r.historico).toHaveLength(5);
    expect(r.metricas.saldoTotal).toBe(1309.6);
  });
});
