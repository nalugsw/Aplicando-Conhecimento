import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransacaoDocument = HydratedDocument<Transacao>;

export enum TipoTransacao {
  RECEITA = 'receita',
  DESPESA = 'despesa',
}

@Schema({ collection: 'transacoes', timestamps: true })
export class Transacao {
  // Ex.: "Conta de Luz", "Compra de Roupas"
  @Prop({ required: true, trim: true })
  descricao: string;

  // Valor monetário da transação (sempre positivo; o "tipo" define se entra ou sai)
  @Prop({ required: true, min: 0 })
  valor: number;

  // Aceita apenas "receita" ou "despesa"
  @Prop({ required: true, enum: Object.values(TipoTransacao) })
  tipo: TipoTransacao;

  // Ex.: "Moradia", "Alimentação", "Lazer", "Educação"
  @Prop({ required: true, trim: true })
  categoria: string;

  // ODS 12: true = gasto essencial/planejado; false = gasto por impulso
  @Prop({ required: true, default: true })
  consumoConsciente: boolean;
}

export const TransacaoSchema = SchemaFactory.createForClass(Transacao);
