import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateTransacaoDto } from './dto/create-transacao.dto';
import { TransacoesService } from './transacoes.service';

@Controller('transacoes')
export class TransacoesController {
  constructor(private readonly transacoesService: TransacoesService) {}

  // POST /transacoes -> cadastra uma nova receita ou despesa
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateTransacaoDto) {
    return this.transacoesService.create(dto);
  }

  // GET /transacoes -> histórico + métricas consolidadas
  @Get()
  findAll() {
    return this.transacoesService.findAll();
  }
}
