# 📐 Especificações Técnicas - Sistema de Ponto

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────┐
│           Frontend (HTML + CSS + JS)    │
│  (Roda no navegador do usuário)         │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│      Local Storage (JSON)                │
│  (Armazenamento persistente no navegador)│
└─────────────────────────────────────────┘
```

## 💾 Modelo de Dados

### Tabela: USERS (Usuários do Sistema)
```json
{
  "id": 1,
  "email": "joao@empresa.com",
  "password": "joao123",
  "name": "João Silva",
  "role": "employee|manager|admin",
  "department": "TI",
  "employeeId": 1,
  "createdAt": "2026-04-16T10:30:00Z"
}
```

### Tabela: EMPLOYEES (Funcionários)
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@empresa.com",
  "cpf": "123.456.789-00",
  "position": "Desenvolvedor",
  "department": "TI",
  "monthlyHours": 176,
  "hourlyRate": 50.00,
  "contract": "CLT|PJ|Estágio",
  "status": "ativo|inativo|afastado",
  "bankAccount": "12345-6",
  "registrationNumber": "E001",
  "createdAt": "2026-01-15T08:00:00Z"
}
```

### Tabela: TIMELOGS (Registros de Ponto)
```json
{
  "id": 1,
  "employeeId": 1,
  "date": "2026-04-16",
  "entryTime": "08:30",
  "lunchStartTime": "12:00",
  "lunchEndTime": "13:00",
  "exitTime": "17:45",
  "status": "open|closed",
  "ipAddress": "192.168.1.100",
  "geolocation": "São Paulo, SP",
  "createdAt": "2026-04-16T08:31:00Z",
  "updatedAt": "2026-04-16T17:46:00Z"
}
```

### Tabela: CLOSURES (Fechamentos de Período)
```json
{
  "id": 1,
  "employeeId": 1,
  "period": "2026-04-P1",
  "startDate": "2026-04-01",
  "endDate": "2026-04-15",
  "totalWorkedMinutes": 10560,
  "totalWorkedHours": 176,
  "expectedHours": 176,
  "balanceMinutes": 0,
  "balanceHours": 0,
  "overtimeMinutes": 0,
  "overtimeHours": 0,
  "nightHours": 2.5,
  "nightAdditional": 50.00,
  "delayMinutes": 15,
  "daysPresent": 15,
  "daysAbsent": 0,
  "status": "open|closed",
  "totalValue": 8800.00,
  "overtimeValue": 0.00,
  "calculatedAt": "2026-04-15T18:00:00Z",
  "closedAt": "2026-04-15T18:15:00Z"
}
```

### Tabela: AUDITLOG (Trilha de Auditoria)
```json
{
  "id": 1,
  "action": "CREATE|UPDATE|DELETE|LOGIN|LOGOUT",
  "table": "employees|timelogs|closures|users|settings",
  "recordId": 1,
  "details": "Funcionário João Silva criado",
  "userId": 1,
  "userEmail": "admin@empresa.com",
  "timestamp": "2026-04-16T10:30:00Z",
  "ipAddress": "192.168.1.100"
}
```

### Tabela: SETTINGS (Configurações)
```json
{
  "companyName": "Minha Empresa LTDA",
  "cnpj": "12.345.678/0001-99",
  "address": "Rua Principal, 123",
  "phone": "(11) 98765-4321",
  "tolerance": 10,
  "startDate": "01",
  "endDate": "15",
  "overtimeMultiplier": 1.5,
  "sundayMultiplier": 2.0,
  "holidayMultiplier": 2.0,
  "useHourBank": true,
  "timezone": "America/Sao_Paulo"
}
```

## 🔄 Fluxos de Dados

### Fluxo 1: Registro de Ponto
```
1. Funcionário clica "Registrar Entrada"
2. Sistema captura hora atual
3. Registra em TIMELOGS
4. Auditoria registra a ação
5. Dashboard atualiza em tempo real
```

### Fluxo 2: Cálculo de Fechamento
```
1. Sistema identifica fim do período
2. Busca todos os registros do período
3. Calcula horas para cada funcionário
4. Aplica regras (tolerância, extras, noturno)
5. Gera CLOSURES
6. Registra em auditoria
```

### Fluxo 3: Geração de Relatório
```
1. Admin seleciona filtros
2. Sistema busca dados do período
3. Calcula totais e subtotais
4. Formata para PDF/CSV
5. Permite download
6. Registra em auditoria
```

## 🧮 Algoritmos de Cálculo

### Cálculo de Horas Trabalhadas Diárias
```javascript
horasTrabalhadas = (horaEntrada - horaSaida) - tempoAlmoco
```

**Exemplo:**
```
Entrada: 08:00
Saída Almoço: 12:00
Volta Almoço: 13:00
Saída: 17:30

Cálculo:
(12:00 - 08:00) = 4 horas
(17:30 - 13:00) = 4h 30m
Total = 8h 30m
```

### Cálculo de Saldo de Horas
```javascript
saldo = totalTrabalhado - jornadadEsperada
```

**Exemplo:**
```
Total Trabalhado: 180 horas
Jornada Esperada: 176 horas
Saldo: +4 horas (crédito)
```

### Cálculo de Horas Extras
```javascript
se (diasTrabalhado > jornadadAPerada) {
  extras = totalTrabalhado - jornadadAPerada
  valorExtra = extras * valorHora * multiplicador
}
```

**Exemplo Dia Útil:**
```
Horas Extras: 2 horas
Valor/Hora: R$ 50,00
Multiplicador: 1.5 (50% extra)
Cálculo: 2 × 50 × 0.5 = R$ 50,00
```

**Exemplo Domingo:**
```
Horas Extras: 2 horas
Valor/Hora: R$ 50,00
Multiplicador: 2.0 (100% extra)
Cálculo: 2 × 50 × 1.0 = R$ 100,00
```

### Cálculo de Atraso
```javascript
atraso = horaSaida - horaEsperada - tolerancia
```

**Exemplo:**
```
Hora Esperada: 08:00
Hora Saída: 08:15
Tolerância: 10 minutos
Atraso: 5 minutos (registrado mas não penalizado)
```

### Cálculo de Adicional Noturno
```javascript
se (horaTrabalho >= 22:00 OU horaTrabalho <= 05:00) {
  adicional = horasNoturnas × valorHora × 0.20
}
```

## 🔐 Segurança

### Autenticação
- Email + Senha
- Armazenamento em localStorage
- Session token (sessionStorage)

### Autorização (Role-Based Access Control)
```
Admin (nível 3)
  ├─ Visualizar tudo
  ├─ Editar tudo
  ├─ Deletar dados
  └─ Configurar sistema

Manager (nível 2)
  ├─ Visualizar relatórios
  ├─ Editar pontos
  └─ Gerar relatórios

Employee (nível 1)
  ├─ Registrar próprio ponto
  ├─ Ver histórico pessoal
  └─ Visualizar relatório pessoal
```

### Auditoria
- Toda ação registra:
  - Timestamp
  - Usuário responsável
  - IP de origem
  - Tabela afetada
  - ID do registro
  - Descrição da ação

## 📱 APIs Internas (JavaScript)

### Database API
```javascript
// Employees
DB.getEmployees()
DB.getEmployeeById(id)
DB.getEmployeesByDepartment(dept)
DB.addEmployee(employee)
DB.updateEmployee(id, data)

// TimeLogs
DB.getTimeLogs()
DB.getTimeLogsByEmployee(empId, start, end)
DB.getTimeLogByEmployeeAndDate(empId, date)
DB.addTimeLog(log)
DB.updateTimeLog(id, data)

// Closures
DB.getClosures()
DB.getClosuresByEmployee(empId)
DB.getClosureByEmployeeAndPeriod(empId, period)
DB.addClosure(closure)

// Audit
DB.getAuditLog()
DB.addAuditLog(action, table, recordId, details)
```

### Auth API
```javascript
Auth.login(email, password)
Auth.logout()
Auth.getCurrentUser()
Auth.isAuthenticated()
Auth.hasRole(role)
Auth.isAdmin()
Auth.isManager()
Auth.isEmployee()
Auth.can(action)
Auth.getPermissions()
```

### Calculations API
```javascript
HourCalculations.calculateDailyWorkedHours(timeLog)
HourCalculations.calculateOvertimeHours(empId, start, end)
HourCalculations.calculateDelayOrAdvance(timeLog, expectedHours)
HourCalculations.calculatePeriodClosure(empId, start, end)
HourCalculations.getEmployeeTodayStatus(empId)
HourCalculations.isWeekend(date)
HourCalculations.isHoliday(date)
HourCalculations.getCurrentPeriod()
HourCalculations.getPeriodEndDate(date)
```

### App Utils API
```javascript
AppUtils.initializeNavigation()
AppUtils.showAlert(message, type)
AppUtils.showSuccess/Error/Warning(message)
AppUtils.openModal/closeModal(id)
AppUtils.exportToCSV(data, filename)
AppUtils.exportToPDF(html, filename)
AppUtils.generatePDFContent(title, data)
```

## 📊 Performance

### Otimizações
- localStorage cacheado em memória
- Índices por employeeId e date
- Lazy loading de dados
- Filtros no cliente (rápido para < 10k registros)

### Limites Recomendados
- Máximo 1000 funcionários
- Máximo 5 anos de histórico
- localStorage: 5-10 MB

### Se exceder:
- Migre para banco de dados real
- Implemente paginação
- Archive dados antigos

## 🌐 Compatibilidade

### Navegadores
```
Chrome 90+   ✓
Firefox 88+  ✓
Safari 14+   ✓
Edge 90+     ✓
Mobile       ✓ (responsivo)
```

### APIs Utilizadas
- `localStorage`: Persistência de dados
- `sessionStorage`: Tokens temporários
- `fetch`: (futuro para servidor)
- `Intl API`: Formatação de data/moeda
- `Date API`: Manipulação de datas

## 🚀 Escalabilidade Futura

### Migração para Backend
```
Cliente (HTML/CSS/JS) ←→ API REST ←→ Backend (Node/Python/Java)
                           ↓
                      Database (SQL/NoSQL)
```

### Passos para Escalabilidade
1. Implementar API REST
2. Migrar para banco de dados real
3. Adicionar autenticação OAuth
4. Implementar cache (Redis)
5. Adicionar filas de trabalho
6. Integrar com sistemas de RH/Folha

## 📈 Métricas Implementadas

### Dashboard Metrics
- Total de funcionários
- Presentes/ausentes hoje
- Em intervalo
- Horas totais de trabalho
- Extras acumuladas
- Custos com folha

### Audit Metrics
- Eventos por dia
- Eventos por usuário
- Ações por tipo
- Tentativas de acesso

---

**Documentação Técnica Versão 1.0**
Última atualização: Abril 2026
