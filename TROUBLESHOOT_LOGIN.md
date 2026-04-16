# 🔑 Problema de Login com Novas Credenciais

## 🤔 Por Que Não Funciona?

Você pode estar vendo dados antigos no navegador por causa do **cache/localStorage antigo**.

## ✅ Solução: Limpar o Navegador

### Opção 1: Limpar via DevTools (Recomendado)

1. **Abra o navegador** (Chrome, Firefox, Edge, etc)
2. **Pressione: `F12`** (ou Ctrl+Shift+I, ou Cmd+Opt+I no Mac)
3. **Vá para: Aplicação** (ou Application)
4. **Clique em: Local Storage**
5. **Selecione TODOS os domínios** que contêm dados de `sistemaPonto`
6. **Clique com botão direito → Deletar**
7. **Feche as abas abertas do Sistema de Ponto**
8. **Abra novamente: `index.html`**

### Opção 2: Limpar Histórico Completo do Navegador

1. **Pressione: `Ctrl+Shift+Del`** (Windows/Linux) ou **`Cmd+Shift+Del`** (Mac)
2. **Intervalo: Desde o começo**
3. **Marque:**
   - ☑️ Cookies e dados de sites
   - ☑️ Dados armazenados em cache
4. **Limpar dados**
5. **Recarregue o navegador**

### Opção 3: Usar a Página de Configurações

Se conseguir fazer login com uma conta antiga:
1. Vá para **Configurações → Usuários**
2. Clique em **🗑️ Limpar Todos os Dados**
3. O sistema vai reiniciar com dados padrão

## 🆕 Testando as Novas Contas

Depois de limpar:

### Teste 1: TI (Admin Sistema)
```
Email: ti@empresa.com
Senha: ti123
```
✅ Deve ter acesso a:
- Auditoria (log completo)
- Backup/Sync
- Infraestrutura

### Teste 2: RH (Admin Negócio)
```
Email: rh@empresa.com
Senha: rh123
```
✅ Deve ter acesso a:
- Funcionários (CRUD)
- Configurações
- Departamentos
- Backup/Sync

### Teste 3: Gestor
```
Email: gestor@empresa.com
Senha: gestor123
```
✅ Deve ter acesso a:
- Dashboard
- Relatórios
- Visualizar funcionários (apenas)

### Teste 4: Funcionário
```
Email: joao@empresa.com
Senha: joao123
```
✅ Deve ter acesso a:
- Registrar ponto
- Visualizar próprios dados
- Relatórios pessoais

## 🔄 Se Ainda Não Funcionar

1. **Verifique o console** (F12 → Console)
   - Procure por erros em vermelho
   - Screenshot dos erros

2. **Tente em outro navegador:**
   - Se funciona → problema de cache do primeiro
   - Se não funciona → problema do código

3. **Teste com dados antigos:**
   - Importe via **Sincronização → Importar** um arquivo de backup antigo
   - Se funciona → confirme que o novo código funciona

## 📝 Checklist Final

- [ ] Limpi localStorage
- [ ] Fechei todas as abas do Sistema de Ponto
- [ ] Abri `index.html` em uma aba limpa
- [ ] Testei login com `ti@empresa.com / ti123`
- [ ] Verifiquei acesso às páginas de admin
- [ ] Testei login com `rh@empresa.com / rh123`  
- [ ] Testei login com `gestor@empresa.com / gestor123`
- [ ] Testei login com `joao@empresa.com / joao123`

✅ Se todos funcionarem = Sucesso!

---

**Dúvida?** Verifique se há erros no console (F12) ao tentar fazer login.
