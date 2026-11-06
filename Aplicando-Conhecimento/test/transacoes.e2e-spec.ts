import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { Transacao } from '../src/transacoes/schemas/transacao.schema';
import { TransacoesController } from '../src/transacoes/transacoes.controller';
import { TransacoesService } from '../src/transacoes/transacoes.service';

// Banco simulado em memória para testar as rotas sem depender do MongoDB Atlas
const banco: any[] = [];

class TransacaoModelFake {
  constructor(private dados: any) {}
  async save() {
    const doc = { _id: String(banco.length + 1), ...this.dados };
    banco.push(doc);
    return doc;
  }
  static find() {
    return {
      sort: () => ({ lean: () => ({ exec: async () => [...banco] }) }),
    };
  }
}

describe('Transacoes (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TransacoesController],
      providers: [
        TransacoesService,
        { provide: getModelToken(Transacao.name), useValue: TransacaoModelFake },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /transacoes cadastra uma receita', () =>
    request(app.getHttpServer())
      .post('/transacoes')
      .send({ descricao: 'Salário', valor: 2500, tipo: 'receita', categoria: 'Trabalho', consumoConsciente: true })
      .expect(201));

  it('POST /transacoes cadastra uma despesa por impulso', () =>
    request(app.getHttpServer())
      .post('/transacoes')
      .send({ descricao: 'Compra de Roupas', valor: 300, tipo: 'despesa', categoria: 'Lazer', consumoConsciente: false })
      .expect(201));

  it('POST /transacoes rejeita tipo inválido', () =>
    request(app.getHttpServer())
      .post('/transacoes')
      .send({ descricao: 'Teste', valor: 10, tipo: 'investimento', categoria: 'Outros' })
      .expect(400));

  it('GET /transacoes retorna historico e metricas', async () => {
    const res = await request(app.getHttpServer()).get('/transacoes').expect(200);
    expect(res.body.historico).toHaveLength(2);
    expect(res.body.metricas).toEqual({
      saldoTotal: 2200,
      totalDespesas: 300,
      totalGastoImpulso: 300,
    });
  });
});
