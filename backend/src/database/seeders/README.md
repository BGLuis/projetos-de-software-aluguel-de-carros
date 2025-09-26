# Database Seeders

Este documento descreve como usar os seeders para popular o banco de dados com dados de teste do sistema de aluguel de carros.

## Visão Geral

Os seeders foram criados usando a biblioteca [@faker-js/faker](https://fakerjs.dev/) para gerar dados realistas de teste. O sistema inclui seeders para todas as entidades do domínio:

### 🏦 **Entidades Bancárias**

- **Banks**: Bancos brasileiros (Itaú, Bradesco, BB, etc.)
- **Bank Agents**: Agentes bancários para análise de crédito
- **Credit Agreements**: Contratos de crédito associados aos aluguéis

### 🏢 **Entidades Empresariais**

- **Legal Entities**: Pessoas jurídicas (CNPJ, razão social)
- **Enterprises**: Empresas que podem alugar veículos
- **Agents**: Agentes avaliativos (empresas e bancos)
- **Contracts**: Contratos entre agentes e clientes

### 👥 **Entidades de Clientes**

- **Customers & Individuals**: Usuários e clientes individuais
- **Fountains**: Fontes de renda dos clientes (até 3 por cliente)

### 🚗 **Entidades de Veículos e Aluguéis**

- **Vehicles (Automobiles)**: Veículos disponíveis para aluguel
- **Rentals**: Pedidos de aluguel com status de avaliação## Como Usar

### Comandos Disponíveis

````bash
# 🌱 Popular todos os dados (recomendado - ordem correta de dependências)
npm run seed:all

# 🏦 Seeders Bancários
npm run seed:banks                # 10 bancos brasileiros
npm run seed:bank-agents          # 12 agentes bancários
npm run seed:credit-agreements    # 25 contratos de crédito

# 🏢 Seeders Empresariais
npm run seed:legal-entities       # 15 pessoas jurídicas
npm run seed:enterprises          # 10 empresas
npm run seed:agents               # 8 agentes avaliativos
npm run seed:contracts            # 20 contratos

# 👥 Seeders de Clientes
npm run seed:customers            # 25 clientes individuais

# 🚗 Seeders de Veículos e Aluguéis
npm run seed:vehicles             # 20 veículos
npm run seed:rentals              # 40 aluguéis

# 🎯 Comando manual com quantidade específica
npm run seed banks 15
npm run seed legal-entities 20
npm run seed customers 50
npm run seed vehicles 30
npm run seed rentals 100
```### Ordem de Execução

**IMPORTANTE**: Execute os seeders respeitando as dependências. O comando `npm run seed:all` executa automaticamente na ordem correta:

1. **`banks`** - Bancos (entidades independentes)
2. **`legal-entities`** - Pessoas jurídicas (base para empresas)
3. **`enterprises`** - Empresas (dependem de legal-entities)
4. **`agents`** - Agentes avaliativos (dependem de legal-entities)
5. **`contracts`** - Contratos (dependem de agents)
6. **`credit-agreements`** - Acordos de crédito (dependem de contracts + banks)
7. **`bank-agents`** - Agentes bancários (dependem de credit-agreements)
8. **`customers`** - Clientes individuais (base para aluguéis)
9. **`vehicles`** - Veículos disponíveis (base para aluguéis)
10. **`rentals`** - Aluguéis (dependem de customers + vehicles)

### ⚠️ Dependências Críticas
- Empresas e Agentes precisam de Legal Entities
- Contratos precisam de Agentes
- Acordos de Crédito precisam de Contratos e Bancos
- Agentes Bancários precisam de Acordos de Crédito
- Aluguéis precisam de Clientes e Veículos

## Dados Gerados

### 🏦 Banks (10 padrão)
- Bancos brasileiros reais: Itaú, Bradesco, Banco do Brasil, Santander, CEF
- Códigos bancários oficiais (001, 237, 341, 033, etc.)

### 🏢 Legal Entities (15 padrão)
- CNPJ válido (14 dígitos)
- Razão social gerada

### 🏢 Enterprises (10 padrão)
- Vinculadas a Legal Entities
- Identificação única alfanumérica

### 👔 Agents (8 padrão)
- Agentes avaliativos vinculados a Legal Entities
- Responsáveis por aprovar/rejeitar pedidos

### 📋 Contracts (20 padrão)
- Contratos entre Agents e sistema
- Data de validade: 6 meses a 5 anos no futuro

### 💰 Credit Agreements (25 padrão)
- Valores: R$ 10.000 - R$ 500.000
- Taxa de juros: 0,5% - 15% ao mês
- Prazo: 1-10 anos
- Vinculados a Contracts e Banks

### 🏦 Bank Agents (12 padrão)
- Agentes bancários especializados
- Vinculados a Credit Agreements específicos

### 👥 Customers & Individuals (25 padrão)
- Nome completo realista
- Email único e CPF gerado
- Profissão, endereço e data de nascimento
- Senha: `123456789`
- 1-3 fontes de renda por cliente

### 🚗 Vehicles (20 padrão)
- 10 marcas com modelos específicos
- Ano: 2015-2024, cores variadas
- Placa, chassi e RENAVAM brasileiros
- Taxa diária: R$ 80-500
- 6 categorias diferentes

### 🚙 Rentals (40 padrão)
- Cliente e veículo aleatórios
- Datas e valores calculados
- Status: SWITCH, ON_ANALYSIS, FINISHED, APPROVED

## Configuração do Ambiente

Certifique-se de que:

1. O banco de dados está rodando e configurado
2. As variáveis de ambiente estão corretas
3. As migrações foram executadas
4. O projeto compila sem erros (`npm run build`)

## Estrutura dos Arquivos

````

src/database/seeders/
├── base.seeder.ts # Classe base abstrata
├── customer.seeder.ts # Seeder de clientes
├── vehicle.seeder.ts # Seeder de veículos
├── rent.seeder.ts # Seeder de aluguéis
├── seeder.service.ts # Serviço coordenador
├── seeder.module.ts # Módulo NestJS
└── ../seed.ts # CLI para executar seeders

````

## Exemplo de Uso Completo

```bash
# 1. Compilar o projeto
npm run build

# 2. Popular todos os dados
npm run seed:all

# 3. Verificar no banco ou via API
# GET /customers - deve retornar 25 clientes
# GET /vehicles - deve retornar 20 veículos
# GET /rentals - deve retornar 40 aluguéis
````

## Solução de Problemas

### Erro de Dependências

Se aparecer erro sobre clientes ou veículos não encontrados ao criar aluguéis:

```bash
npm run seed:customers
npm run seed:vehicles
npm run seed:rentals
```

### Erro de Compilação

```bash
npm run build
# Corrija os erros de TypeScript antes de executar seeders
```

### Dados Duplicados

Os seeders podem gerar conflitos de chave única (email, placa, etc.). Limpe o banco se necessário:

```sql
TRUNCATE TABLE rents, automobiles, fountains, customers, users CASCADE;
```
