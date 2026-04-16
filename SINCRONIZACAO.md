# 🔄 Guia de Sincronização de Dados

## ✨ O Que É Sincronização?

O sistema agora permite compartilhar dados entre:
- ✅ **Diferentes abas** do mesmo navegador (automático via BroadcastChannel)
- ✅ **Diferentes navegadores** no mesmo dispositivo (manual via arquivo)
- ✅ **Diferentes dispositivos** (manual via arquivo)

## 🚀 Como Usar

### 1️⃣ Sincronização Entre Abas (Automática)

Quando você abre o sistema em duas abas:
- As abas comunicam-se automaticamente
- Mudanças feitas em uma aba aparecem na outra imediatamente
- **Nenhuma ação necessária!**

### 2️⃣ Sincronização Entre Navegadores/Dispositivos (Manual)

#### No Navegador/Dispositivo 1 (Origem):
1. Faça login
2. Vá para ⚙️ **Configurações**
3. Vá para aba **Usuários** (no final)
4. Clique em **📤 Exportar Sincronização**
5. Um arquivo JSON será baixado: `sistema-ponto-sync-{DATA}.json`

#### No Navegador/Dispositivo 2 (Destino):
1. Faça login
2. Vá para ⚙️ **Configurações**
3. Vá para aba **Usuários** (no final)
4. Clique em **📥 Importar Sincronização**
5. Selecione o arquivo JSON baixado anteriormente
6. Os dados serão sincronizados automaticamente

## 📋 O Que É Sincronizado?

✅ Funcionários  
✅ Registros de ponto  
✅ Períodos fechados  
✅ Departamentos  
✅ Configurações do sistema  
✅ Log de auditoria  

❌ Não sincroniza: Tokens de autenticação (você ainda precisa fazer login)

## 🔐 Segurança

- ✅ Arquivo de sincronização é um JSON simples
- ✅ Pode ser armazenado em nuvem (Google Drive, Dropbox, etc)
- ✅ Pode ser enviado por email
- ✅ Sem dados de senha inclusos

## 🆘 Solução de Problemas

### "Não consigo importar o arquivo"
- ❌ Verifique se é um arquivo `.json` válido
- ❌ Tente exportar novamente e importar
- ❌ Limpe cache do navegador (Ctrl+Shift+Del)

### "Dados não aparecem após importar"
- Recarregue a página (F5)
- Faça logout e login novamente
- Dados devem aparecer após sincronização

### "As contas antigas (admin@empresa.com) não funcionam mais"
- As contas antigas foram substituídas por:
  - `ti@empresa.com / ti123` (TI - Admin Sistema)
  - `rh@empresa.com / rh123` (RH - Admin Negócio)
  - `gestor@empresa.com / gestor123` (Gestor)
  - `joao@empresa.com / joao123` (Funcionário)
- Se quer usar contas antigas, importe um backup anterior

## 💾 Fluxo Recomendado

1. **Primeira vez?** Crie funcionários e configure no navegador principal
2. **Pronto para compartilhar?** Exporte sincronização (`sistema-ponto-sync.json`)
3. **Outro navegador/dispositivo?** Importe o arquivo
4. **Continuar trabalhando?** Exporte novamente para manter sincronizado

## 📱 Exemplo de Uso Multi-Dispositivo

```
Semana 1:
├── Laptop: Cria 5 funcionários
├── Exporta: sistema-ponto-sync.json
├── Mobile: Importa arquivo
├── Mobile: Verifica funcionários aparecem ✓
└── Continua trabalhando no Mobile

Semana 2:
├── Mobile: Adiciona 2 novos registros de ponto
├── Exporta: sistema-ponto-sync.json
├── Laptop: Importa arquivo
├── Laptop: Verifica registros aparecem ✓
└── Imprime relatório no Laptop
```

---

**Nota:** Para sincronização em tempo real com servidor externo (cloud backup automático), considere usar Firebase, Google Cloud Storage ou similar.
