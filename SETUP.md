# 🚀 Guia de Configuração Rápida

## ⚡ Iniciar em 30 segundos

### 1. **Abrir o Sistema**
```
Clique duas vezes em: index.html
```

### 2. **Fazer Login**
Use uma destas credenciais:

| Perfil | Email | Senha |
|--------|-------|-------|
| 👨‍💼 Admin RH | admin@empresa.com | admin123 |
| 👤 Gestor | gestor@empresa.com | gestor123 |
| 👷 Funcionário | joao@empresa.com | joao123 |

### 3. **Explorar o Sistema**
- **Funcionário**: Clique em "Registrar Ponto"
- **Gestor/Admin**: Vá para "Dashboard" para ver resumo
- **Admin**: Acesse "Funcionários" para gerenciar

---

## 📋 Checklist de Configuração

### Para Usar com Seus Dados

#### 1️⃣ Adicionar Empresa
1. Faça login como **Admin**
2. Vá para **⚙️ Configurações**
3. Aba "Dados da Empresa"
4. Preencha:
   - Nome da Empresa
   - CNPJ
   - Endereço
   - Telefone
5. Clique **Salvar Alterações**

#### 2️⃣ Configurar Períodos
1. Na aba **Sistema** das Configurações
2. Defina:
   - **Início de Período**: 01 (ou 16)
   - **Fim de Período**: 15 (ou 30)
3. Salve

#### 3️⃣ Adicionar Funcionários
1. Vá para **👥 Funcionários**
2. Clique **+ Novo Funcionário**
3. Preencha todos os campos:
   - Nome completo
   - Email
   - CPF
   - Cargo
   - Departamento
   - Jornada mensal (padrão: 176h)
   - Valor da hora
4. Salve

#### 4️⃣ Criar Usuários de Acesso
1. Vá para **⚙️ Configurações**
2. Aba **Usuários**
3. Clique **+ Novo Usuário**
4. Configure:
   - Nome
   - Email
   - Senha
   - Função (Admin/Gestor/Funcionário)
5. Salve

#### 5️⃣ Registrar Primeiros Pontos
1. Faça login como **Funcionário**
2. Vá para **🕒 Registrar Ponto**
3. Clique **Registrar Entrada**
4. Clique **Saída para Almoço**
5. Clique **Volta do Almoço**
6. Clique **Registrar Saída**

---

## 🎯 Fluxos Principais

### Fluxo 1: Funcionário Registra Ponto
```
Login → Dashboard → Registrar Ponto → Entrada → ... → Saída
```

### Fluxo 2: Gestor Monitora Equipe
```
Login → Dashboard (vê presença) → Relatórios → Exportar PDF
```

### Fluxo 3: Admin Gerencia Sistema
```
Login → Funcionários (CRUD) → Configurações → Auditoria → Relatórios
```

---

## 🔧 Ajustes Comuns

### Mudar Tolerância de Atraso
1. **Configurações** → **Sistema**
2. Altere **Tolerância (minutos)**
3. Padrão: 10 minutos

### Mudar Multiplicador de Extras
1. **Configurações** → **Sistema**
2. Altere:
   - **Extras em Dias Úteis**: 50% (1.5x) ✓
   - **Extras em Feriado/Domingo**: 100% (2.0x) ✓
3. Salve

### Ativar/Desativar Banco de Horas
1. **Configurações** → **Sistema**
2. Marque/desmarque **Usar Banco de Horas**
3. Salve

---

## 📊 Gerar Primeiro Relatório

### Passo a Passo

1. **Faça login como Admin/Gestor**

2. **Vá para 📋 Relatórios**

3. **Escolha tipo:**
   - **Fechamento de Período** - Todos os funcionários
   - **Funcionário Individual** - Um colaborador
   - **Por Departamento** - Visão departamental
   - **Resumo Geral** - Visão empresa

4. **Defina datas:**
   - Data Inicial: 01/04/2026
   - Data Final: 15/04/2026

5. **Gere:**
   - Clique **Gerar Relatório**

6. **Exporte:**
   - CSV → Para planilhas Excel
   - PDF → Para impressão

---

## 🔐 Segurança Essencial

### Recomendações

✅ **Faça regularmente:**
- Altere senhas padrão dos usuários
- Revise a auditoria mensalmente
- Faça backup dos dados

✅ **Proteja:**
- Acesso ao navegador (login do SO)
- Arquivo com senhas de admin
- Backups em local seguro

⚠️ **Atente-se:**
- Nunca compartilhe senha do Admin
- Cada funcionário tem seu usuário
- Auditoria registra tudo

---

## 💾 Backup de Dados

### Fazer Backup
1. **Configurações** → **Usuários**
2. Clique **📥 Exportar Dados (JSON)**
3. Arquivo será baixado

### Restaurar (Manual)
Guarde o arquivo JSON em local seguro para recuperação futura.

---

## ❓ Dúvidas Frequentes

### P: Como editar um ponto já registrado?
**R**: Apenas Admin pode editar. Vá para **🕒 Registrar Ponto**, selecione o funcionário e clique "Editar".

### P: Posso usar em celular?
**R**: Sim! Sistema é responsivo. Abra em navegador mobile.

### P: Onde estão armazenados os dados?
**R**: No localStorage do navegador. Se limpar cache, dados serão perdidos. **Faça backup!**

### P: Como excluir um funcionário?
**R**: **👥 Funcionários** → Localize → Clique "Deletar" (vai para auditoria).

### P: Posso usar com múltiplos navegadores?
**R**: Não recomendado. Use sempre o mesmo navegador para evitar sincronização.

### P: Como fechar um período?
**R**: Sistema fecha automaticamente na data configurada. Relatórios mostram status "Em Aberto" ou "Fechado".

---

## 🎓 Tutorial Vídeo (Simulado)

### O que aprenderá:
- [x] Fazer login
- [x] Registrar ponto
- [x] Gerar relatório
- [x] Exportar PDF
- [x] Gerenciar funcionários

---

## 📞 Suporte Técnico

### Se algo der errado:

1. **Página não carrega**
   - Tente: Ctrl + Shift + R (recarrega sem cache)

2. **Dados desapareceram**
   - Verifique se limpou cache/cookies
   - Recupere do backup se tiver

3. **Erro ao salvar**
   - Verifique localStorage disponível
   - Tente em outro navegador

4. **Espaço em disco insuficiente**
   - localStorage pode estar cheio
   - Exporte e delete dados antigos

---

## 🚀 Próximas Ações

Após configurar:

1. **Semana 1**: Teste com um funcionário
2. **Semana 2**: Onboard todos os funcionários
3. **Semana 3**: Revise configurações com RH
4. **Semana 4**: Gere primeiro relatório oficial

---

**Pronto para começar! 🎉**

Dúvidas? Consulte o README.md para documentação completa.
