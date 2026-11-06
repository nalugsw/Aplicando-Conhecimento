import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTransacaoDto } from './dto/create-transacao.dto';
import {
  TipoTransacao,
  Transacao,
  TransacaoDocument,
} from './schemas/transacao.schema';

export interface Metricas {
  saldoTotal: number;
  totalDespesas: number;
  totalGastoImpulso: number;
}

export interface ResumoFinanceiro {
  historico: Transacao[];
  metricas: Metricas;
}

@Injectable()
export class TransacoesService {
  constructor(
    @InjectModel(Transacao.name)
    private readonly transacaoModel: Model<TransacaoDocument>,
  ) {}

  async create(dto: CreateTransacaoDto): Promise<Transacao> {
    const nova = new this.transacaoModel(dto);
    return nova.save();
  }

  async findAll(): Promise<ResumoFinanceiro> {
    const historico = await this.transacaoModel
      .find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return {
      historico,
      metricas: this.calcularMetricas(historico),
    };
  }

  // Regras de negócio: o processamento das métricas fica no Service
  calcularMetricas(transacoes: Transacao[]): Metricas {
    let totalReceitas = 0;
    let totalDespesas = 0;
    let totalGastoImpulso = 0;

    for (const t of transacoes) {
      if (t.tipo === TipoTransacao.RECEITA) {
        totalReceitas += t.valor;
      } else if (t.tipo === TipoTransacao.DESPESA) {
        totalDespesas += t.valor;
        if (t.consumoConsciente === false) {
          totalGastoImpulso += t.valor;
        }
      }
    }

    return {
      saldoTotal: this.arredondar(totalReceitas - totalDespesas),
      totalDespesas: this.arredondar(totalDespesas),
      totalGastoImpulso: this.arredondar(totalGastoImpulso),
    };
  }

  // Evita resultados como 0.30000000000000004
  private arredondar(valor: number): number {
    return Math.round(valor * 100) / 100;
  }
}
