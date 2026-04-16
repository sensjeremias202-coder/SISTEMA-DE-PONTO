# 🕐 Sistema de Ponto - Controle de Frequência e Jornada

Um sistema web completo para controle de frequência, registro de ponto, cálculo de horas trabalhadas, extras e geração de relatórios e folha de pagamento.

## 📋 Características Principais

### 1. **Estrutura de Ciclos (Quinzenas)**
- ✅ Fechamento automático de períodos (01-15 e 16-30/31)
- ✅ Configurável em settings
- ✅ Suporte a múltiplos períodos simultâneos

### 2. **Sistema Multiusuário**
- ✅ 3 níveis de acesso:
  - **Admin RH**: Acesso total ao sistema
  - **Gestor**: Visualização e geração de relatórios
  - **Funcionário**: Registro de ponto pessoal

### 3. **Dashboard Inteligente**
- ✅ Status em tempo real (Presente, Em Intervalo, Ausente)
- ✅ Jornada esperada vinculada ao contrato
- ✅ Saldo de horas automático
- ✅ Horas extras destacadas

### 4. **Banco de Dados Completo**
Três tabelas principais com relacionamentos:

#### Tabela Funcionários
```
id, nome, email, cpf, cargo, departamento, 
carga_horaria_mensal, valor_hora, contrato, 
banco_conta, matricula, status, data_criacao
```

#### Tabela Registros (Logs)
```
id, id_funcionario, data, hora_entrada, 
saida_almoco, volta_almoco, hora_saida, 
status, ip_address, geolocation, criado_em
```

#### Tabela Fechamentos
```
id, id_funcionario, periodo, saldo_horas_normais, 
saldo_extras, adicional_noturno, dias_presentes, 
dias_ausentes, valor_total, status, fechado_em
```

### 5. **Regras de Cálculo Objetivas**

#### Tolerância (CLT)
- Configurável em settings (padrão: 10 minutos)
- Pequenas variações não contam como atraso ou extra

#### Horas Extras
- **Dias Úteis**: 50% adicional (configurável)
- **Domingos/Feriados**: 100% adicional (configurável)
- Opção de Banco de Horas vs. Pagamento Imediato

#### Cálculo de Saldo
```
Saldo = Horas Trabalhadas - Jornada Esperada
```

### 6. **Relatórios Profissionais em PDF**
- ✅ Filtro por Departamento
- ✅ Filtro por Funcionário Individual
- ✅ Relatório Geral da Quinzena
- ✅ Layout com logotipo, CNPJ, assinaturas
- ✅ Resumo de proventos e descontos

### 7. **Segurança e Auditoria**
- ✅ Registro de IP em cada ponto
- ✅ Histórico completo de alterações
- ✅ Trilha de auditoria com timestamps
- ✅ Registro de quem e quando alterou cada horário
- ✅ Log de login/logout
- ✅ Estatísticas de uso

## 🚀 Como Usar

### Acesso ao Sistema

Abra `index.html` no navegador e utilize as credenciais de demo:

#### Usuários Demo
```
Admin RH:
  Email: admin@empresa.com
  Senha: admin123

Gestor:
  Email: gestor@empresa.com
  Senha: gestor123

Funcionário:
  Email: joao@empresa.com
  Senha: joao123
```

### Fluxo de Uso

#### Para Funcionários
1. **Login**: Acesse com suas credenciais
2. **Dashboard**: Veja seu saldo de horas e últimos registros
3. **Registrar Ponto**:
   - Clique em "Registrar Entrada"
   - Clique em "Saída para Almoço"
   - Clique em "Volta do Almoço"
   - Clique em "Registrar Saída"
4. **Relatórios**: Veja seu histórico de trabalho

#### Para Gestores
1. **Dashboard**: Monitore presença da equipe
2. **Relatórios**: Gere relatórios por departamento
3. **Editar Pontos**: Faça ajustes necessários

#### Para Administrador RH
1. **Dashboard**: Visão geral de toda a empresa
2. **Funcionários**: CRUD completo de colaboradores
3. **Relatórios**: Gere relatórios gerenciais
4. **Configurações**: Ajuste tolerância, multiplicadores, períodos
5. **Auditoria**: Monitore todas as ações do sistema
6. **Backup**: Exporte/importe dados

## 📊 Gerenciamento de Funcionários

### Adicionar Novo Funcionário
1. Vá para "Funcionários" (Admin)
2. Clique em "+ Novo Funcionário"
3. Preencha:
   - Nome, Email, CPF
   - Cargo, Departamento
   - Jornada mensal (horas)
   - Valor da hora
   - Tipo de contrato (CLT/PJ/Estágio)
4. Salve

### Editar Funcionário
1. Localize na lista
2. Clique em "Editar"
3. Modifique os dados
4. Salve

## 📝 Configurações do Sistema

### Tolerância de Atraso
- Padrão: 10 minutos
- Variação que não conta como atraso ou extra

### Períodos de Fechamento
- **Início**: Dia 01 ou 16 (configurável)
- **Fim**: Dia 15 ou 30/31 (configurável)

### Multiplicadores de Extras
- **Dias Úteis**: 1.5x (50% adicional)
- **Feriados/Domingos**: 2.0x (100% adicional)

### Banco de Horas
- Ativar/desativar compensação de horas
- Excesso de horas pode virar banco ou ser pago

## 📈 Relatórios

### Tipo: Fechamento de Período
- Resumo de todos os funcionários em um período
- Saldo de horas, extras, valores

### Tipo: Funcionário Individual
- Detalhamento completo de um colaborador
- Dia a dia com entrada e saída
- Cálculos de atraso e extras

### Tipo: Por Departamento
- Análise do departamento específico
- Comparação entre colaboradores

### Tipo: Resumo Geral
- Totais da empresa
- Custos com folha de pagamento

### Exportação
- **CSV**: Para planilhas Excel
- **PDF**: Pronto para impressão com assinaturas

## 🔐 Segurança

### Auditoria
Todas as ações são registradas:
- **LOGIN/LOGOUT**: Acesso ao sistema
- **CREATE**: Novo registro
- **UPDATE**: Modificação de dados
- **DELETE**: Exclusão de dados

### Informações Capturadas
- IP do usuário
- Geolocalização (extensível)
- Timestamp preciso
- Usuário responsável
- Descrição da ação

### Relatório de Auditoria
- Filtro por ação, tabela, data
- Estatísticas de uso
- Atividade por usuário
- Exportação para análise

## 💾 Armazenamento de Dados

### Tecnologia
- **localStorage**: Armazenamento local do navegador
- **JSON**: Formato de dados
- Sem servidor necessário

### Backup
1. Vá para Configurações → Usuários
2. Clique em "Exportar Dados (JSON)"
3. Arquivo será baixado automaticamente

### Restauração
- Os dados podem ser restaurados manualmente ou via importação

## 🎨 Interface

### Design Responsivo
- ✅ Desktop (1920x1080)
- ✅ Tablet (768x1024)
- ✅ Mobile (320x480)

### Cores e Temas
- Cores corporativas (Azul, Verde, Vermelho)
- Badges para status
- Cards para agrupamento de informações

### Navegação
- Sidebar fixa com menu
- Breadcrumbs dinâmicos
- Ações contextuais rápidas

## 📱 Funcionalidades por Perfil

### FUNCIONÁRIO
- [x] Dashboard pessoal
- [x] Registrar ponto (entrada, intervalo, saída)
- [x] Visualizar histórico pessoal
- [x] Relatório individual
- [x] Ver saldo de horas

### GESTOR
- [x] Dashboard de equipe
- [x] Editar registros de ponto
- [x] Visualizar todos os funcionários
- [x] Gerar relatórios departamentais
- [x] Exportar em PDF

### ADMIN RH
- [x] **Todas as funcionalidades do Gestor**
- [x] Gerenciar funcionários (CRUD)
- [x] Gerenciar usuários do sistema
- [x] Configurar sistema
- [x] Auditoria completa
- [x] Backup e restauração
- [x] Fechar períodos
- [x] Exportar folha de pagamento

## 🔧 Estrutura de Arquivos

```
SISTEMA DE PONTO/
├── index.html           # Login
├── dashboard.html       # Dashboard principal
├── timeclock.html       # Registro de ponto
├── employees.html       # Gestão de funcionários (Admin)
├── reports.html         # Relatórios
├── settings.html        # Configurações (Admin)
├── audit.html          # Auditoria (Admin)
├── css/
│   └── styles.css      # Estilos globais
└── js/
    ├── database.js     # Simulação de banco de dados
    ├── auth.js         # Autenticação e autorização
    ├── calculations.js # Cálculos de horas e lógica
    └── app.js          # Utilitários gerais
```

## 📊 Exemplos de Cálculos

### Horas Trabalhadas em um Dia
```
Entrada: 08:00
Saída Almoço: 12:00
Volta Almoço: 13:00
Saída: 17:30

Cálculo:
(12:00 - 08:00) + (17:30 - 13:00) = 4h + 4h30m = 8h30m
```

### Saldo de Horas (Período)
```
Total Trabalhado: 176 horas
Jornada Esperada: 176 horas
Saldo: 0h (em dia)

Exemplo 2:
Total Trabalhado: 180 horas
Jornada Esperada: 176 horas
Saldo: +4h (crédito)
```

### Valor de Extra
```
Horas Extras: 4h
Valor/Hora: R$ 50,00
Multiplicador: 1.5x (dias úteis)

Valor Extra = 4 × 50 × 0.5 = R$ 100,00
```

## 🌐 Compatibilidade

### Navegadores Suportados
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Requisitos
- JavaScript habilitado
- localStorage disponível
- Conexão com internet (para CDN, se usado)

## 📞 Suporte

### Dados Padrão
O sistema vem com dados de demo para facilitar testes:
- 4 funcionários padrão
- 3 usuários de acesso
- Configurações pré-ajustadas

### Reset do Sistema
Para limpar todos os dados e começar do zero:
1. Vá para Configurações (Admin)
2. Aba "Usuários"
3. Clique em "🗑️ Limpar Todos os Dados"

## 🚀 Próximos Passos

Para integração em produção:
1. Migrar para banco de dados real (SQL/MongoDB)
2. Implementar API backend
3. Adicionar autenticação com OAuth
4. Implementar geolocalização real
5. Adicionar notificações por email
6. Implementar integração com folha de pagamento

## 📝 Licença

Este sistema é fornecido como-é para uso interno.

---

**Desenvolvido com ❤️ para otimizar sua gestão de ponto**

Versão: 1.0
Última atualização: Abril 2026
