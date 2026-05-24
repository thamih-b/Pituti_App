# Checklist de Deployment - Pituti API

Use esta checklist para garantir que tudo está pronto para produção.

## Fase 1: Preparação do Projeto ✓

### Ficheiros essenciais
- [x] `.env.example` - Template de variáveis de ambiente
- [x] `schema.sql` - Schema completo da base de dados
- [x] `README.md` - Documentação da API
- [x] `DEPLOYMENT.md` - Guia de deployment passo-a-passo
- [x] `.gitignore` - Ficheiros a ignorar no Git
- [x] `package.json` - Dependências e scripts
- [x] `next.config.ts` - Configuração Next.js
- [x] `vercel.json` - Configuração Vercel (opcional)

### Código da API
- [ ] Todos os endpoints estão implementados
- [ ] Autenticação JWT funciona (register/login)
- [ ] Validação Zod em todos os inputs
- [ ] Mappers convertem DB → API corretamente
- [ ] Health check endpoint responde

## Fase 2: Base de Dados (Neon)

### Setup
- [ ] Conta criada no Neon (https://neon.tech)
- [ ] Projeto PostgreSQL criado
- [ ] Connection string copiada
- [ ] Schema SQL executado sem erros
- [ ] Tabelas verificadas (10 tabelas esperadas)

### Verificação
```sql
-- Execute no Neon SQL Editor para verificar
\dt
-- Deve mostrar: users, pets, medical_profiles, vaccines, medications, 
-- symptoms, cares, notes, vets, appointments
```

## Fase 3: Deploy na Vercel

### Setup
- [ ] Conta criada no Vercel (https://vercel.com)
- [ ] Repositório GitHub ligado
- [ ] Projeto importado na Vercel

### Variáveis de Ambiente
- [ ] `DATABASE_URL` configurada (Neon connection string)
- [ ] `JWT_SECRET` configurada (32+ caracteres aleatórios)
- [ ] Variáveis aplicadas a: Production, Preview, Development
- [ ] `.env.local` criado localmente (NÃO commitar!)

### Deploy
- [ ] Build passou sem erros
- [ ] Deployment concluído com sucesso
- [ ] URL do projeto copiada (ex: `pituti-api.vercel.app`)

## Fase 4: Testes de Produção

### Health Check
```bash
curl https://SUA-URL.vercel.app/api/health
```
- [ ] Retorna status 200
- [ ] JSON com `{"status": "ok", ...}`

### Autenticação
```bash
# Register
curl -X POST https://SUA-URL.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test1234"}'
```
- [ ] Retorna status 201
- [ ] Retorna user + token

```bash
# Login
curl -X POST https://SUA-URL.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test1234"}'
```
- [ ] Retorna status 200
- [ ] Retorna token

### Endpoints Protegidos
```bash
# Criar pet (substitua TOKEN)
curl -X POST https://SUA-URL.vercel.app/api/pets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"name":"Luna","species":"cat"}'
```
- [ ] Retorna status 201
- [ ] Pet criado com sucesso
- [ ] Dados salvos no PostgreSQL

```bash
# Listar pets
curl https://SUA-URL.vercel.app/api/pets \
  -H "Authorization: Bearer SEU_TOKEN"
```
- [ ] Retorna status 200
- [ ] Lista contém o pet criado

## Fase 5: Integração com App Móvel

### Configuração
- [ ] `API_BASE_URL` atualizada para URL Vercel
- [ ] `expo-secure-store` instalado
- [ ] Tokens guardados com SecureStore (não AsyncStorage)

### Testes Mobile
- [ ] Login funciona
- [ ] Token é guardado
- [ ] Criar pet funciona
- [ ] Listar pets mostra dados
- [ ] Todas as features principais testadas

## Fase 6: Otimizações (Opcional)

### Segurança
- [ ] CORS configurado para domínios específicos (não `*`)
- [ ] Rate limiting implementado
- [ ] Headers de segurança configurados

### Performance
- [ ] Região Vercel = Região Neon (para latência baixa)
- [ ] Índices do schema criados
- [ ] Queries otimizadas

### Monitoring
- [ ] Logs Vercel verificados
- [ ] Sentry ou similar configurado
- [ ] Alertas configurados para erros

### Backup
- [ ] Backups automáticos do Neon ativados
- [ ] Recovery plan documentado

## Fase 7: Documentação

### Para Developers
- [ ] README atualizado com endpoints
- [ ] Variáveis de ambiente documentadas
- [ ] Exemplos de uso incluídos
- [ ] Swagger/OpenAPI (opcional)

### Para Portfolio
- [ ] URL da API funcional
- [ ] Screenshots/demo disponíveis
- [ ] Stack tecnológica descrita
- [ ] Link GitHub público (se aplicável)

## Troubleshooting Quick Reference

### Erro comum #1: Database connection failed
**Solução:** Verificar `DATABASE_URL` nas env vars da Vercel

### Erro comum #2: Token inválido
**Solução:** Confirmar que `JWT_SECRET` é a mesma em todos os ambientes

### Erro comum #3: Module not found
**Solução:** `npm install` + commit package-lock.json

### Erro comum #4: CORS error
**Solução:** Adicionar domínio correto no next.config.ts

## Status Final

- [ ] ✅ API deployed e funcionando
- [ ] ✅ Base de dados PostgreSQL operacional
- [ ] ✅ Autenticação JWT funcional
- [ ] ✅ Todos os endpoints testados
- [ ] ✅ App móvel integrado
- [ ] ✅ Pronto para portfolio

---

**Quando todos os checkboxes estiverem marcados, o deployment está completo!** 🎉

**URL da API:** _____________________

**Data de Deploy:** _____________________

**Próximos passos:** _____________________
