# Forms — Pituti

## Conceitos base

Um **formulário controlado** no React significa que o estado do input vive no `useState`,
não no DOM. Cada mudança dispara `onChange` → `setField` → re-render com o valor novo.

```
usuário digita → onChange → setField → useState → re-render do input
```

---

## Padrão implementado

### 1. Estado do formulário

Todos os campos num único objeto para evitar múltiplos `useState`:

```tsx
const [form, setForm] = useState<FormFields>({
  name: '',
  species: 'cat',
  breed: '',
  birthDate: '',
  weight: '',
})
```

### 2. Estado de erros e `touched`

`errors` guarda as mensagens. `touched` controla se o campo já foi tocado —
o erro só aparece depois que o usuário saiu do campo (onBlur), evitando
mensagens prematuras:

```tsx
const [errors,  setErrors]  = useState<FormErrors>({})
const [touched, setTouched] = useState<Partial<Record<keyof FormFields, boolean>>>({})
```

### 3. Função `validate` pura

Separada do componente — recebe os campos e devolve os erros.
Pura = sem side effects, fácil de testar:

```tsx
function validate(fields: FormFields): FormErrors {
  const errors: FormErrors = {}
  if (!fields.name.trim())
    errors.name = 'O nome é obrigatório.'
  if (fields.birthDate && new Date(fields.birthDate) > new Date())
    errors.birthDate = 'A data não pode ser futura.'
  if (fields.weight && parseFloat(fields.weight) <= 0)
    errors.weight = 'Peso deve ser maior que 0.'
  return errors
}
```

### 4. Atualizar e revalidar

`setField` atualiza um campo e revalida **somente** se ele já foi tocado:

```tsx
const setField = (key: keyof FormFields, value: string) => {
  const next = { ...form, [key]: value }
  setForm(next)
  if (touched[key]) setErrors(validate(next))
}
```

### 5. Marcar campo como tocado

Ao sair do input (onBlur), marca o campo e valida:

```tsx
const handleBlur = (key: keyof FormFields) => {
  setTouched(t => ({ ...t, [key]: true }))
  setErrors(validate(form))
}
```

### 6. Submit

Ao submeter, marca **todos** os campos como tocados para mostrar todos os erros:

```tsx
const handleSubmit = () => {
  setTouched({ name: true, birthDate: true, weight: true })
  const errs = validate(form)
  setErrors(errs)
  if (Object.keys(errs).length > 0) return  // bloqueia submit
  // ... salvar
}
```

---

## Mostrar erros e confirmação

### Erro por campo

```tsx
<input
  className={errors.name && touched.name ? 'form-input input-error' : 'form-input'}
  onBlur={() => handleBlur('name')}
  onChange={e => setField('name', e.target.value)}
/>
{errors.name && touched.name && (
  <span className="form-error">{errors.name}</span>
)}
```

### Mensagem de sucesso

```tsx
{success && (
  <div style={{ color: 'var(--success)', background: 'var(--success-hl)' }}>
    ✓ {form.name} adicionada com sucesso!
  </div>
)}
```

---

## Formulários no projeto

| Formulário | Arquivo | Campos | Validações |
|---|---|---|---|
| Nova mascota | `AddPetModal.tsx` | nome, espécie, raça, data nasc., peso | nome obrigatório, data não futura, peso > 0 |
| Perfil | `SettingsPage.tsx` | nome, email | campos básicos |
| Busca | `PetListPage.tsx` | search | nenhuma (filtro em tempo real) |

---

## Quando usar `touched`

Sem `touched`, os erros aparecem assim que o usuário abre o modal — péssima UX.
Com `touched`, o erro só aparece **após o usuário interagir** com o campo:

| Situação | Com `touched` | Sem `touched` |
|---|---|---|
| Modal abre | Nenhum erro | Todos os campos em erro |
| Usuário digita e apaga o nome | Erro aparece após sair do campo | Erro aparece ao digitar |
| Usuário clica Salvar sem preencher | Todos os erros aparecem | Todos já estavam visíveis |
