# Reserva de Salas

Sistema interno para reservar salas de reunião. Desafio técnico Full Stack Pleno (Sensedia). Versão atual: **1.1.0**.

## Como rodar (3 comandos)

```bash
npm install
npm run db:setup   # aplica as migrations e carrega o seed
npm run dev        # http://localhost:3000
```

Requer Node 22. Testes: `npm test`. Qualidade: `npm run lint && npm run typecheck`.

**Usuários do seed** (use o seletor «Entrar como» no topo).

## Stack e justificativas

| Tecnologia | Por quê |
|---|---|
| Next.js 15 (App Router) + TypeScript strict | Exigido. Server Components e Server Actions mantêm a lógica no servidor |
| SQLite (better-sqlite3) | Relacional, zero infraestrutura, transações síncronas que simplificam a proteção contra corrida |
| Drizzle ORM + drizzle-kit | Schema em TypeScript, migrations em SQL versionadas, fácil trocar para PostgreSQL |
| Zod | Validação de entradas com mensagens claras |
| Tailwind CSS | Interface simples e rápida |
| Vitest | Testes rápidos, banco SQLite em memória |
| GitHub Actions | CI: lint, tipos, testes e build em todo PR |
| Husky + commitlint | Impor Conventional Commits |

## Arquitetura

- `src/app`: telas e rotas (finas, só chamam serviços).
- `src/features/*`: regras de negócio por assunto.  `service.ts` orquestra banco e regras.
- `src/db`: schema, migrations, seed.
- Os serviços recebem o banco e o relógio por parâmetro, o que torna os testes simples e determinísticos.

## Regras de negócio

| Regra | Onde está |
|---|---|
| Sem sobreposição na mesma sala (reservas encostadas são permitidas) | `bookings/service.ts`, dentro de transação `IMMEDIATE` |
| Sem reserva no passado | `domain/validate-booking.ts` |
| Duração mínima de 15 min e máxima definida **por sala** (padrão 240 min) | `domain/validate-booking.ts` |
| Somente dias úteis (seg–sex), das 08h às 20h, fuso America/Sao_Paulo | `domain/business-hours.ts` |
| Cancelar apenas as próprias reservas | `auth/permissions.ts` (`assertCanCancel`) |
| Somente admin cadastra/edita salas | `auth/permissions.ts` (`assertAdmin`) + `requireAdminPage` |

## Decisões e premissas

- [Login simulado: cookie com o id do usuário; o papel é sempre lido do banco.]
- [Server Actions no lugar de API REST: rodam no servidor e reduzem código.]
- [Cancelamento é *soft delete* (`status = canceled`). Não se cancela reserva já encerrada ou cancelada.]
- [Nem o admin cancela reservas de terceiros, pois o requisito diz «apenas as próprias».]
- [Editar uma sala vale para novas reservas; reservas existentes não são revalidadas.]
- [Salas são desativadas, não apagadas, para preservar o histórico.]
- [Filtros de salas aplicados em memória (poucas salas). Com muitas salas iriam para o SQL.]

## Testes

`npm test` roda tudo. Cobertura principal:

- `tests/bookings/overlap.test.ts`: regra de sobreposição (5 cenários de conflito, bordas e salas diferentes).
- `tests/bookings/cancel-permission.test.ts`: permissão de cancelamento.
- `tests/rooms/*`: listagem com filtros e permissões de admin.

## Git flow

`main` = produção, 
`develop` = integração. 
Branches `release/1.1.0, develop, feature/sala-6-duracao-maxima-por-sala, feature/SALA-4-admin-salas, feature/sala-2-reservar-sala, feature/sala-1-listar-salas, chore/base-dados, chore/setup`.

Conventional Commits e tudo via PR (merge commit).

1. Setup, 2. Features SALA-1 a SALA-4, 3. Release 1.0.0, 4. SALA-6,  5. Release 1.1.0.
