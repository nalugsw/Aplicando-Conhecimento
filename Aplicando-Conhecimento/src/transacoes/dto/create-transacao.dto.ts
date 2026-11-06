import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { TipoTransacao } from '../schemas/transacao.schema';

export class CreateTransacaoDto {
  @IsString()
  @IsNotEmpty({ message: 'A descrição é obrigatória.' })
  descricao: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'O valor deve ser um número.' })
  @Min(0, { message: 'O valor não pode ser negativo.' })
  valor: number;

  @IsEnum(TipoTransacao, {
    message: 'O tipo deve ser "receita" ou "despesa".',
  })
  tipo: TipoTransacao;

  @IsString()
  @IsNotEmpty({ message: 'A categoria é obrigatória.' })
  categoria: string;

  // Opcional: se não for enviado, assume true (consumo consciente)
  @IsOptional()
  @IsBoolean({ message: 'consumoConsciente deve ser true ou false.' })
  consumoConsciente?: boolean;
}
