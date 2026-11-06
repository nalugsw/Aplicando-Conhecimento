# API de Controle Financeiro Pessoal

API RESTful em **NestJS + MongoDB (Atlas)** para registrar receitas e despesas e acompanhar a saúde financeira do dia a dia.

Projeto extensionista da disciplina **Web Mobile** (TADS – Mackenzie), alinhado aos ODS:
- **ODS 1 – Erradicação da pobreza:** apoio ao letramento financeiro e à prevenção do superendividamento familiar.
- **ODS 12 – Consumo e produção responsáveis:** o campo `consumoConsciente` ajuda a separar gastos essenciais de compras por impulso.

Autora: Ana Luiza Gomes dos Santos — RA 10779016

Repositório: https://github.com/nalugsw/Aplicando-Conhecimento

## Como rodar

```bash
git clone https://github.com/nalugsw/Aplicando-Conhecimento.git
cd Aplicando-Conhecimento
npm install
cp .env.example .env   # preencha MONGODB_URI com a string do MongoDB Atlas
npm run start:dev
```

A API sobe em `http://localhost:3000`.

## Endpoints

### POST /transacoes
Cadastra uma receita ou despesa.

```json
{
  "descricao": "Conta de Luz",
  "valor": 150.5,
  "tipo": "despesa",
  "categoria": "Moradia",
  "consumoConsciente": true
}
```

Regras: `tipo` aceita apenas `receita` ou `despesa`; `valor` não pode ser negativo; `consumoConsciente` é opcional (padrão `true`).

### GET /transacoes
Retorna o histórico e as métricas calculadas no Service.

```json
{
  "historico": [ ... ],
  "metricas": {
    "saldoTotal": 1309.6,
    "totalDespesas": 1690.4,
    "totalGastoImpulso": 339.9
  }
}
```

- `saldoTotal`: receitas − despesas
- `totalDespesas`: soma das despesas
- `totalGastoImpulso`: soma das despesas com `consumoConsciente = false`

## Testes

```bash
npm test          # testes unitários do cálculo das métricas
npm run test:e2e  # testes das rotas (sem precisar do Atlas)
```

## Estrutura

```
src/
├── main.ts
├── app.module.ts
└── transacoes/
    ├── dto/create-transacao.dto.ts
    ├── schemas/transacao.schema.ts
    ├── transacoes.controller.ts
    ├── transacoes.service.ts
    ├── transacoes.service.spec.ts
    └── transacoes.module.ts
test/
├── jest-e2e.json
└── transacoes.e2e-spec.ts
```
