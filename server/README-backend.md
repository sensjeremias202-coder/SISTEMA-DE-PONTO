Backend Node/Express minimal

1. Copie `.env.example` para `.env` e ajuste `MONGODB_URI` e `JWT_SECRET`.
2. Instale dependências:

```
cd server
npm install
```

3. Rodar em desenvolvimento:

```
npm run dev
```

4. Para migrar dados do frontend (backup JSON):

```
node migrate-localstorage.js caminho/backup.json
```
