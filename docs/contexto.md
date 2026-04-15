This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
.gitignore
docs/agile.md
docs/components.md
docs/design.md
docs/hooks.md
docs/idea.md
docs/project-management.md
eslint.config.js
index.html
package.json
public/favicon.svg
public/icons.svg
README.md
server/src/config/.gitkeep
server/src/controllers/.gitkeep
server/src/routes/.gitkeep
server/src/services/.gitkeep
src/api/.gitkeep
src/App.css
src/App.tsx
src/assets/hero.png
src/assets/react.svg
src/assets/vite.svg
src/components/Avatar.tsx
src/components/Badge.tsx
src/components/Button.tsx
src/components/Card.tsx
src/components/EmptyState.tsx
src/components/Input.tsx
src/components/Modal.tsx
src/components/OverviewCard.tsx
src/components/PetCard.tsx
src/components/SkeletonLoader.tsx
src/context/.gitkeep
src/hooks/usePets.ts
src/index.css
src/main.tsx
src/pages/PetListPage.tsx
src/types/index.ts
src/utils/.gitkeep
tailwind.config
tsconfig.app.json
tsconfig.json
tsconfig.node.json
vite.config.ts
```

# Files

## File: .gitignore
````
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
````

## File: docs/agile.md
````markdown
1.	Investigación: metodologías de desarrollo
•	Investiga qué es Agile y cuál es su objetivo en el desarrollo de software
•	Investiga qué es Scrum y sus conceptos principales (roles, sprints, backlog, reviews)
•	Investiga qué es Kanban y cómo se usa para organizar tareas
•	Explica las diferencias entre Scrum y Kanban
•	Describe en qué situaciones se podría usar cada metodología
•	Escribe toda esta información con tus propias palabras

Até 2001, o método utilizado por desenvolvedores era o Waterfall (metodologia em cascata), onde cada fase do projeto precisa ser 100% concluída antes da próxima começar. Como se para iniciar um tratamento, tivesse que esperar que cada exame terminasse para iniciar o seguinte, enviar para aprovação cada um entre eles, esperar a resposta... com tanta demora, um tratamento poderia demorar um ano para começar, até aí seu paciente já não está entre nós ou os medicamentos escolhidos no início das suspeitas já entrou em desuso. O mesmo acontecia com os projetos, eles morriam ou ficavam defasados antes de lançar.
O manifesto ágil (Manifest for Agile Software Development) foi um documento curto, mas que mudou tudo em 2001. Estabeleceu quatro valores, propondo que os valores da esquerda importam mais, mas que não descarta os valores da direita.
Valor 1	Indivíduos e interações > Processos e ferramentas
Valor 2 	Software funcionando > Documentação exaustiva
Valor 3	Colaboração com o Cliente > Negociação de contratos
Valor 4	Responder a mudanças > Seguir um plano

Além desses valores, que são a filosofia do Agile, há 12 princípios que são bastante orientativos para profissionais: 
#	Princípio	O que significa na prática
1	Satisfaça o cliente com entregas frequentes	Entregue cedo, entregue sempre, pegue feedback
2	Bem-vindo a mudanças, mesmo no final	Não entre em pânico quando o cliente mudar de ideia
3	Entregue software funcionando frequentemente	Semanas, não meses — sprints pequenas
4	Colaboração diária entre negócio e dev	Dev e cliente no mesmo time, não em lados opostos
5	Construa projetos com pessoas motivadas	Equipe confiante > equipe vigiada
6	Comunicação face a face é a mais eficiente	Uma reunião de 10 min vale 40 emails
7	Software funcionando = medida de progresso	Não "% concluído" — e sim "funciona ou não funciona"
8	Ritmo sustentável e constante	Ninguém aguenta sprint de 80h por semana
9	Excelência técnica e bom design	Código bem feito = mais fácil de adaptar depois
10	Simplicidade — maximize o trabalho não feito	Não construa o que não foi pedido
11	Times auto-organizados entregam mais	Equipe que decide como trabalhar > equipe microgerenciada
12	Reflexão contínua e adaptação	Retrospectivas — a equipe sempre melhora

Ainda que chamemos de metodologia, o Agile na verdade é mais uma filosofia, uma mentalidade ou valores a serem seguidos. Dentro dele, há implementações específicas, como Scrum, Kanban, XP, Safe, LeSS e outros.
Em Agile se entrega valores continuamente, em ciclos curtos, colaborando com o cliente e adaptando-se às mudanças. Um dos seus pontos muito importantes para destacar no mercado atual é o de que uma equipe bem motivada e de confiança é muito mais produtiva e requer menos recursos que uma equipe que precise ser vigiada.

Tratando da implementações específicas citadas, temos o Scrum e Kanban.
No Scrum, há papéis definidos, ciclos de início e fim, e reuniões obrigatórias. Esses papéis são já definidos da seguinte maneira:
Papel	O que faz
Product Owner (PO)	Define o que será construído e em que ordem
Scrum Master (SM)	Remove obstáculos, facilita o processo
Dev Team	Constrói o produto

Além disso, o Scrum tem ciclos determinados dentro dele para orientar todo o projeto:
Sprint (iteração)	Um ciclo de trabalho de 1 a 4 semanas com objetivo definido
Product backlog (lista de requisitos)	É a lista completa de tudo que o produto precisa ter, ordenada por prioridade
Sprint Backlog	O subconjunto do Product Backlog escolhido para aquela sprint específica
Sprint Review	Ao fim de cada sprint, a equipe apresenta o que construiu ao PO
Sprint Retrospectiva	A equipe discute: "O que funcionou? O que melhorar?" 
Daily Scrum	Reunião rápida de 15 minutos. Cada um responde: o que fiz ontem, o que farei hoje, tem algum obstáculo?

Tratando de Kanban, que significa um cartão visual em sua origem dos anos 50, cada tarefa (cartão) se move por colunas de um quadro de progresso. Exemplo:
 [Animais esperando] → [Em consulta] → [Em exame] → [Alta]
Dentro dele, o conceito de WIP Limit (Work in Progress Limit) se apresenta como o limite máximo de tarefas simultâneas em uma coluna. Ou seja, se você tem um mesa cirurgia, só pode ter um animal em cirurgia por vez. Assim, se evita a sobrecarga.
No Kanban, não há sprints fixas nem papéis obrigatórios, é um fluxo contínuo.
Característica	Scrum	Kanban
Ciclos	Sprints fixas (1-4 semanas)	Fluxo contínuo, sem ciclos
Papéis	PO, SM, Dev Team (obrigatórios)	Sem papéis definidos unir
Quadro	Criado e apagado a cada sprint	Permanente, evolutivo yagogonzalez
Mudanças	Só entre sprints	A qualquer momento
Reuniões	Daily, Review, Retro (obrigatórias)	Daily opcional kbase.com
Foco	Velocidade por iteração	Fluxo e eliminação de gargalos

Para facilitar a decisão entre qual do dois métodos usar, considere:
Scrum:
•	O projeto tem escopo evolutivo — você não sabe tudo que vai precisar desde o início;
•	A equipe é dedicada exclusivamente ao projeto;
•	Você quer entregas frequentes e feedback do cliente a cada ciclo;
•	Ex: Desenvolver um app novo do zero

Kanban:
•	O trabalho chega de forma imprevisível e contínua;
•	Você precisa priorizar rapidamente;
•	A equipe cuida de múltiplos projetos ao mesmo tempo;
•	Ex: Equipe de suporte/manutenção que recebe bugs e pedidos variados.
````

## File: docs/components.md
````markdown
## Visión general

Los componentes están organizados en dos capas: **UI base** (independientes del dominio, reutilizables en cualquier parte de la app) y **dominio** (consumen tipos de PITUTI y encapsulan lógica visual específica).

```
src/components/
├── Button.tsx           ← UI base
├── Input.tsx            ← UI base
├── Badge.tsx            ← UI base
├── Card.tsx             ← UI base (composición)
├── Avatar.tsx           ← UI base
├── EmptyState.tsx       ← UI base (usa Button internamente)
├── Modal.tsx            ← UI base (usa Button + Portal)
├── SkeletonLoader.tsx   ← UI base (estado de carga)
├── PetCard.tsx          ← Dominio (usa Card + Avatar + Badge)
└── OverviewCard.tsx     ← Dominio (usa Badge)
```

***

## Componentes UI Base

### Button

Botón polimórfico con variantes visuales, tamaños y estado de carga.

**Props:**

| Prop | Tipo | Valor por defecto | Descripción |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'primary'` | Estilo visual |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamaño |
| `children` | `React.ReactNode` | — | Contenido obligatorio |
| `onClick` | `() => void` | — | Handler de clic |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Tipo HTML |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `isLoading` | `boolean` | `false` | Muestra spinner y deshabilita |
| `fullWidth` | `boolean` | `false` | Anchura 100% |
| `ariaLabel` | `string` | — | Accesibilidad para botones sin texto visible |
| `className` | `string` | `''` | Clases adicionales |

**Ejemplo de uso:**
```tsx
<Button variant="primary" onClick={handleSave} isLoading={saving}>
  Guardar vacuna
</Button>

<Button variant="danger" size="sm" onClick={handleDelete}>
  Eliminar
</Button>

<Button variant="secondary" type="submit" fullWidth>
  Entrar
</Button>
```

**Decisión de diseño:** las variantes están mapeadas en un objeto `Record<ButtonVariant, string>` para que TypeScript valide los valores y el código quede sin condicionales anidadas.

***

### Input

Campo de texto controlado con label, hint, estado de error y accesibilidad integrada.

**Props:**

| Prop | Tipo | Valor por defecto | Descripción |
|---|---|---|---|
| `label` | `string` | — | Texto del label (obligatorio) |
| `name` | `string` | — | Atributo `name` del input |
| `value` | `string` | — | Valor controlado |
| `onChange` | `(e) => void` | — | Handler de cambio |
| `type` | `'text' \| 'email' \| 'password' \| 'date' \| 'number' \| 'tel'` | `'text'` | Tipo del input |
| `placeholder` | `string` | — | Placeholder |
| `error` | `string` | — | Mensaje de error (se muestra en rojo) |
| `hint` | `string` | — | Texto de ayuda (oculto cuando hay error) |
| `disabled` | `boolean` | `false` | Deshabilitado |
| `required` | `boolean` | `false` | Muestra asterisco en el label |

**Ejemplo de uso:**
```tsx
<Input
  label="Nombre de la mascota"
  name="petName"
  value={name}
  onChange={(e) => setName(e.target.value)}
  error={errors.petName}
  required
/>

<Input
  label="Fecha de la vacuna"
  name="vaccineDate"
  type="date"
  value={date}
  onChange={(e) => setDate(e.target.value)}
  hint="Usa el formato DD/MM/AAAA"
/>
```

**Decisión de diseño:** `useId()` genera un `id` único para el input, garantizando que `label[for]` e `input[id]` estén siempre sincronizados incluso con múltiples inputs en la misma página.

***

### Badge

Etiqueta de estado con variantes de color semánticas.

**Props:**

| Prop | Tipo | Valor por defecto | Descripción |
|---|---|---|---|
| `label` | `string` | — | Texto obligatorio |
| `status` | `'success' \| 'warning' \| 'danger' \| 'info' \| 'neutral'` | `'neutral'` | Variante de color |
| `className` | `string` | `''` | Clases adicionales |

**Ejemplo de uso:**
```tsx
<Badge label="Al día" status="success" />
<Badge label="Vence pronto" status="warning" />
<Badge label="Vencido" status="danger" />
<Badge label="Pendiente" status="neutral" />
```

***

### Card

Contenedor con borde, sombra y padding configurable. Soporta modo clicable.

**Props:**

| Prop | Tipo | Valor por defecto | Descripción |
|---|---|---|---|
| `children` | `React.ReactNode` | — | Contenido |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Espaciado interno |
| `onClick` | `() => void` | — | Hace el card clicable (añade hover y cursor) |
| `className` | `string` | `''` | Clases adicionales |

**Ejemplo de uso:**
```tsx
<Card>
  <h3>Título</h3>
  <p>Cualquier contenido</p>
</Card>

<Card onClick={() => navigate(`/pets/${pet.id}`)} padding="sm">
  <PetCard pet={pet} />
</Card>
```

**Decisión de diseño:** Card es un componente de composición puro — no sabe qué hay dentro. Otros componentes de dominio (como `PetCard`) usan `Card` internamente sin necesidad de reimplementar las clases de borde y sombra.

***

### Avatar

Imagen circular con fallback de iniciales y manejo de error de carga.

**Props:**

| Prop | Tipo | Valor por defecto | Descripción |
|---|---|---|---|
| `name` | `string` | — | Nombre completo (usado para iniciales y aria-label) |
| `photoUrl` | `string` | — | URL de la foto (opcional) |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Tamaño del círculo |
| `className` | `string` | `''` | Clases adicionales |

**Ejemplo de uso:**
```tsx
<Avatar name="Luna García" photoUrl={pet.photoUrl} size="lg" />
<Avatar name="Carlos Souza" size="sm" />
```

**Decisión de diseño:** cuando la imagen falla al cargar (`onError`), el estado `imgError` se activa y el componente muestra las iniciales del nombre en lugar de una imagen rota.

***

### EmptyState

Estado vacío con título, descripción opcional, icono y acción primaria.

**Props:**

| Prop | Tipo | Valor por defecto | Descripción |
|---|---|---|---|
| `title` | `string` | — | Texto principal (obligatorio) |
| `description` | `string` | — | Texto secundario |
| `actionLabel` | `string` | — | Texto del botón de acción |
| `onAction` | `() => void` | — | Handler del botón |
| `icon` | `React.ReactNode` | Icono por defecto | Icono personalizado |

**Ejemplo de uso:**
```tsx
<EmptyState
  title="Ninguna vacuna registrada"
  description="Registra la primera vacuna de Luna para seguir el calendario."
  actionLabel="Añadir vacuna"
  onAction={() => setModalOpen(true)}
/>
```

**Decisión de diseño:** nunca mostrar "Sin datos" o "No items". El estado vacío es una primera impresión — necesita tener un título claro, contexto y una acción.

***

### Modal

Overlay con portal React, cierre por ESC/overlay y bloqueo de scroll.

**Props:**

| Prop | Tipo | Valor por defecto | Descripción |
|---|---|---|---|
| `isOpen` | `boolean` | — | Controla la visibilidad |
| `onClose` | `() => void` | — | Handler de cierre |
| `title` | `string` | — | Título del header |
| `children` | `React.ReactNode` | — | Contenido del body |
| `footer` | `React.ReactNode` | — | Contenido del footer (botones) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Anchura máxima |

**Ejemplo de uso:**
```tsx
<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Añadir vacuna"
  footer={
    <>
      <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
      <Button onClick={handleSubmit} isLoading={saving}>Guardar</Button>
    </>
  }
>
  <VaccineForm values={form} onChange={setForm} errors={errors} />
</Modal>
```

**Decisión de diseño:** `createPortal` renderiza el modal directamente en el `document.body`, evitando problemas de `z-index` y `overflow: hidden` de elementos padre. El `useEffect` limpia el listener de teclado y el overflow al desmontarse.

***

### SkeletonLoader

Esqueletos de carga que reflejan el layout real de cada componente.

**Exports:**

| Export | Descripción |
|---|---|
| `default Skeleton` | Bloque genérico con `animate-pulse` |
| `SkeletonPetCard` | Refleja el layout de `PetCard` |
| `SkeletonListItem` | Refleja un ítem de lista con avatar |
| `SkeletonOverviewCard` | Refleja el layout de `OverviewCard` |

**Ejemplo de uso:**
```tsx
import { SkeletonPetCard } from './SkeletonLoader'

const PetList = () => {
  if (loading) return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3].map(i => <SkeletonPetCard key={i} />)}
    </div>
  )
  return <div>...</div>
}
```

**Decisión de diseño:** el skeleton refleja la estructura exacta del componente real para evitar layout shift (CLS) cuando los datos cargan.

***

## Componentes de Dominio

### PetCard

Tarjeta de mascota con foto/iniciales, nombre, especie, raza y edad calculada.

**Props:**

| Prop | Tipo | Valor por defecto | Descripción |
|---|---|---|---|
| `pet` | `Pet` | — | Datos de la mascota (tipo del dominio) |
| `onClick` | `(pet: Pet) => void` | — | Handler de selección |
| `isActive` | `boolean` | `false` | Destaca el card con anillo teal |

**Ejemplo de uso:**
```tsx
<PetCard
  pet={pet}
  onClick={(p) => navigate(`/pets/${p.id}`)}
  isActive={selectedPetId === pet.id}
/>
```

**Composición:** `PetCard` usa `Card` + `Avatar` + `Badge` internamente. No reimplementa ningún estilo de esos componentes.

**Decisión de diseño:** la función `calcAge` convierte `birthDate` en texto legible ("2 años", "5 meses") sin exponer lógica de fechas en la página.

***

### OverviewCard

Card de resumen numérico con título, valor, estado y acción opcional.

**Props:**

| Prop | Tipo | Valor por defecto | Descripción |
|---|---|---|---|
| `title` | `string` | — | Título de la métrica |
| `value` | `string \| number` | — | Valor principal |
| `description` | `string` | — | Texto secundario |
| `status` | `BadgeStatus` | — | Estado visual |
| `statusLabel` | `string` | — | Texto del badge de estado |
| `icon` | `React.ReactNode` | — | Icono decorativo |
| `onClick` | `() => void` | — | Hace el card clicable |

**Ejemplo de uso:**
```tsx
<OverviewCard
  title="Vacunas"
  value={3}
  description="1 vence en 30 días"
  status="warning"
  statusLabel="Atención"
  onClick={() => navigate(`/pets/${petId}/health`)}
/>

<OverviewCard
  title="Medicamentos activos"
  value={2}
  status="success"
  statusLabel="Al día"
/>
```

**Decisión de diseño:** `tabular-nums` en el valor principal alinea los números verticalmente cuando hay múltiples cards en grid, evitando saltos visuales.

***

## Principios aplicados

### Props tipadas con TypeScript
Todas las interfaces de props usan tipos del archivo `src/types/index.ts`. Cuando una prop acepta valores específicos (como `variant` o `status`), el tipo es un union literal (`'primary' | 'secondary'`), no `string`. Esto garantiza que TypeScript avise si se pasa un valor inválido.

### Composición de componentes
`EmptyState` usa `Button` internamente. `Modal` usa `Button`. `PetCard` usa `Card`, `Avatar` y `Badge`. Ningún componente reescribe estilos de otro — simplemente lo usa como bloque de construcción.

### Accesibilidad
- Todos los labels de input tienen `htmlFor` vinculado al `id` del input mediante `useId()`
- Botones sin texto visible tienen `aria-label`
- Modal tiene `role="dialog"`, `aria-modal` y `aria-labelledby`
- Las imágenes tienen `alt` descriptivo
- Elementos clicables que no son `<button>` reciben `role`, `tabIndex` y `onKeyDown`

### Estado defensivo
Cada componente que recibe datos opcionales (como `photoUrl` en Avatar, o `birthDate` en PetCard) maneja la ausencia de esos datos con fallbacks claros en lugar de lanzar errores.
````

## File: docs/hooks.md
````markdown
# docs/hooks.md — Estado y Hooks de React

## Visión general

En PITUTI, los hooks de React se usan para separar responsabilidades dentro de los componentes. `useState` gestiona el estado local de la interfaz; `useEffect` controla efectos secundarios como carga de datos; `useMemo` optimiza cálculos derivados; `useCallback` evita recrear funciones innecesarias; y los custom hooks permiten reutilizar lógica entre páginas y módulos.

---

## useState

`useState` se usa para guardar estado local dentro de un componente funcional.

### Cuándo se usa en PITUTI
- Inputs de formularios
- Apertura y cierre de modales
- Filtros de búsqueda
- Selección de elementos activos
- Estados booleanos de UI

### Ejemplo
```tsx
const [search, setSearch] = useState('')
const [selectedPetId, setSelectedPetId] = useState<string | null>(null)
```

### Cómo funciona
- Devuelve un array con dos posiciones: el valor actual y una función para actualizarlo.
- Cuando cambia el estado, React vuelve a renderizar el componente.
- Debe usarse para datos que afectan lo que se muestra en pantalla.

---

## useEffect

`useEffect` se usa para manejar efectos secundarios.

### Cuándo se usa en PITUTI
- Cargar mascotas al entrar en una página
- Hacer peticiones a la API
- Escuchar eventos del navegador
- Sincronizar algo externo al render

### Ejemplo
```tsx
useEffect(() => {
  reload()
}, [reload])
```

### Cómo funciona
- React ejecuta el efecto después del render.
- El segundo argumento es el array de dependencias.
- Si el array está vacío, el efecto se ejecuta una vez al montar el componente.
- Si una dependencia cambia, el efecto vuelve a ejecutarse.

---

## useMemo

`useMemo` se usa para memorizar el resultado de un cálculo costoso.

### Cuándo se usa en PITUTI
- Filtrar mascotas
- Ordenar listas largas
- Calcular métricas del dashboard
- Generar datos derivados complejos

### Ejemplo
```tsx
const filteredPets = useMemo(() => {
  return [...pets]
    .filter((pet) => pet.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name))
}, [pets, search])
```

### Cómo funciona
- React guarda el valor calculado.
- Solo vuelve a calcularlo cuando cambia alguna dependencia.
- No debe usarse por defecto en todo; solo cuando el cálculo cuesta o se reutiliza mucho.

---

## useCallback

`useCallback` se usa para memorizar funciones.

### Cuándo se usa en PITUTI
- Pasar handlers a componentes hijos
- Evitar renders innecesarios en componentes memoizados
- Mantener funciones estables dentro de otros hooks

### Ejemplo
```tsx
const handleSelectPet = useCallback((pet: Pet) => {
  setSelectedPetId(pet.id)
}, [])
```

### Cómo funciona
- Devuelve la misma referencia de función mientras las dependencias no cambien.
- Es útil cuando esa función se pasa como prop a hijos.
- También ayuda cuando la función aparece en arrays de dependencias.

---

## Custom hook: usePets

`usePets` es un hook reutilizable que encapsula la lógica de cargar, refrescar, añadir y eliminar mascotas.

### Responsabilidades
- Guardar la lista de mascotas
- Exponer `loading`
- Exponer `error`
- Cargar los datos al montar
- Reutilizar la lógica en distintas páginas

### Ejemplo
```tsx
const { pets, loading, error, reload, addPet, removePet } = usePets()
```

### Cómo funciona
- Usa `useState` para `pets`, `loading` y `error`
- Usa `useCallback` para estabilizar `reload`, `addPet` y `removePet`
- Usa `useEffect` para cargar datos automáticamente al montar

---

## Dónde aparece cada hook en los archivos generados

### En `src/hooks/usePets.ts`
- `useState`: guarda `pets`, `loading` y `error`
- `useEffect`: ejecuta la carga inicial de mascotas
- `useCallback`: memoriza `reload`, `addPet` y `removePet`

### En `src/pages/PetListPage.tsx`
- `useState`: guarda `search` y `selectedPetId`
- `useMemo`: calcula `filteredPets` y `totalPets`
- `useCallback`: memoriza handlers de búsqueda, selección, alta y borrado

---

## Decisiones de implementación

### Por qué usar `useState`
Es suficiente para el estado local de formularios, filtros y elementos de UI simples.

### Por qué usar `useEffect`
La carga de datos y otros efectos externos no deben ejecutarse directamente durante el render.

### Por qué usar `useMemo`
Evita recalcular listas filtradas y ordenadas en cada render cuando la fuente no ha cambiado.

### Por qué usar `useCallback`
Evita crear funciones nuevas innecesariamente cuando se pasan a componentes hijos.

### Por qué usar un custom hook
Permite mantener las páginas más limpias y reutilizar la misma lógica de datos en varios componentes.
````

## File: docs/idea.md
````markdown
# PITUTI — Idea del proyecto

## Nombre del proyecto
PITUTI

## Descripción general
PITUTI es una aplicación web de cuidado compartido de mascotas para perros y gatos. Su objetivo es centralizar en un solo lugar toda la información importante del pet y permitir que varios tutores o cuidadores compartan responsabilidades de forma organizada.

La idea principal del proyecto es resolver un problema muy común en hogares con cuidado compartido: varias personas participan en la rutina de la mascota, pero no siempre saben qué se hizo, qué falta por hacer o qué ocurrió durante el día. Esto puede generar olvidos, duplicidad de tareas, errores con medicamentos o falta de seguimiento en temas de salud.

PITUTI busca ofrecer una experiencia clara, moderna y colaborativa, donde cada tutor pueda consultar el estado del pet, registrar acciones y mantenerse sincronizado con los demás responsables.

## Problema que intenta resolver
Muchas mascotas viven en hogares donde el cuidado es compartido entre varias personas: parejas, familias, compañeros de piso, cuidadores o pet sitters. En estos casos, es habitual que falte coordinación sobre tareas importantes como alimentación, medicación, vacunas, visitas veterinarias, seguimiento de síntomas o anotaciones diarias.

El problema principal es la falta de una fuente única de verdad. La información suele quedar repartida entre mensajes, notas, memoria, fotos sueltas o conversaciones informales, lo que dificulta el seguimiento correcto del bienestar del animal.

PITUTI resuelve este problema centralizando toda la información del pet en una sola plataforma y permitiendo que varios tutores trabajen sobre el mismo historial compartido.

## Usuario objetivo
El usuario objetivo de PITUTI son personas que cuidan perros y gatos de forma compartida.

Perfiles principales:
- Familias con una o varias mascotas.
- Parejas que comparten responsabilidades diarias.
- Compañeros de piso que cuidan juntos un perro o un gato.
- Tutores separados que alternan el cuidado de la mascota.
- Pet sitters o cuidadores de confianza con acceso limitado.
- Personas con mascotas que necesitan seguimiento de salud frecuente.

También está pensado para tutores que quieren tener mejor organización del historial veterinario, los medicamentos, los documentos y los recordatorios de su mascota, incluso aunque el cuidado no sea compartido todo el tiempo.

## Funcionalidades principales
Estas son las funcionalidades principales del proyecto para la primera versión:

- Registro e inicio de sesión de usuarios.
- Dashboard principal con cards de overview del estado de cada mascota.
- Registro completo de mascotas:
  - Foto
  - Nombre
  - Especie
  - Raza
  - Fecha de nacimiento
  - Peso
  - Color
  - Microchip
  - Altura
  - Pasaporte
- Gestión de múltiples mascotas por usuario.
- Compartición del perfil del pet con otros tutores mediante código o email.
- Asociación de varios tutores a una misma mascota.
- Historial veterinario básico.
- Registro de vacunas y medicamentos con fechas importantes.
- Recordatorios y alertas de salud y cuidados.
- Anotaciones diarias compartidas.
- Registro de alimentación:
  - Tipo de comida
  - Cantidad
  - Apetito
  - Histórico de alimentación
- Registro de síntomas con:
  - Severidad: leve, moderado, grave, emergencia
  - Categoría: digestivo, respiratorio, piel, comportamiento
  - Fecha
  - Descripción
  - Fotos
- Subida de documentos veterinarios.
- Historial de actividad para saber qué tutor hizo cada acción.

## Funcionalidades opcionales
Estas funcionalidades aportan valor, pero pueden quedar para una segunda fase o como bonus:

- Mapa de clínicas veterinarias en Madrid.
- Botones rápidos para llamar, abrir direcciones o localizar urgencias 24h.
- Soporte multilenguaje PT / ES / EN.
- Historial de localización.
- Diferentes roles de usuario (owner, caregiver, viewer).
- Exportación de datos o documentos.
- Filtros avanzados por tipo de evento, severidad o fechas.
- Vista calendario de recordatorios y citas.
- Animaciones avanzadas y microinteracciones adicionales.
- Integración con geolocalización en tiempo real.
- Confirmación visual de tareas completadas por distintos tutores.

## Posibles mejoras futuras
En futuras versiones, PITUTI podría evolucionar con mejoras como:

- Integración con clínicas veterinarias para sincronizar citas o historiales.
- Notificaciones push en tiempo real.
- Chat o comentarios entre tutores dentro de cada mascota.
- Panel de evolución con métricas como peso, apetito o frecuencia de síntomas.
- Modo emergencia con acceso rápido a documentos, contactos y centros veterinarios.
- Sistema de permisos por tipo de tutor.
- Generación automática de resúmenes médicos.
- Integración con dispositivos GPS o wearables para mascotas.
- App móvil nativa.
- IA para resumir síntomas registrados y sugerir cuándo buscar atención veterinaria.

## Valor diferencial
El valor diferencial de PITUTI no es solo guardar datos de mascotas, sino facilitar la coordinación entre varias personas que comparten su cuidado.

Mientras muchas apps del sector se centran en recordatorios o seguimiento individual, PITUTI pone el foco en la colaboración: quién hizo qué, cuándo se hizo, qué falta por hacer y cómo mantener un historial compartido, claro y útil para todos los responsables del animal.

## Enfoque del MVP
Para asegurar que el proyecto sea viable y tenga una buena base técnica, el MVP se centrará en:

- Gestión de usuarios.
- Gestión de mascotas.
- Compartición con múltiples tutores.
- Dashboard con información resumida.
- Vacunas, medicamentos y recordatorios.
- Alimentación y anotaciones diarias.
- Registro de síntomas.
- Subida de documentos.
- Historial de actividad compartida.

Las funcionalidades de mapa, localización y multilenguaje podrán tratarse como extensiones posteriores si el tiempo lo permite.

## Idea de diseño
La aplicación tendrá una interfaz clean y moderna, con:
- Cards con sombras suaves.
- Espacios en blanco amplios.
- Layout claro y ordenado.
- Jerarquía visual simple.
- Animaciones fluidas.
- Diseño responsive para desktop y móvil.

El objetivo visual es transmitir calma, confianza, organización y cuidado.
````

## File: docs/project-management.md
````markdown
# PITUTI — Project Management

## 1. Organización general del trabajo
El desarrollo de PITUTI se organiza con una combinación práctica de ideas de Agile, Scrum y Kanban.

Se utiliza un tablero en Trello para visualizar el flujo de trabajo y gestionar las tareas del proyecto de forma incremental. La intención no es seguir Scrum de forma estricta, sino trabajar con una estructura flexible que permita planificar, ejecutar, revisar y ajustar el proyecto a medida que avanza.

El trabajo se divide en bloques pequeños y concretos para facilitar el seguimiento, evitar bloqueos y tener una visión clara de lo que ya está hecho y de lo que falta por desarrollar.

## 2. Herramienta utilizada
Para la organización del proyecto se utiliza **Trello** como herramienta principal de gestión visual.

El tablero permite:
- Registrar todas las funcionalidades previstas.
- Dividir cada funcionalidad en subtareas técnicas.
- Priorizar el trabajo.
- Mover tareas según su estado.
- Tener una visión general del avance del proyecto.

## 3. Estructura del tablero
El tablero se organiza en las siguientes columnas:

- **Backlog**
- **To Do**
- **In Progress**
- **Review**
- **Done**

### Significado de cada columna
- **Backlog**: lista de tareas, ideas o funcionalidades pendientes de priorizar o desarrollar.
- **To Do**: tareas seleccionadas para trabajar próximamente.
- **In Progress**: tareas en desarrollo activo.
- **Review**: tareas terminadas que necesitan comprobación, revisión visual o validación funcional.
- **Done**: tareas completadas y verificadas.

## 4. Forma de trabajo
El proyecto se desarrolla por iteraciones cortas y objetivos pequeños. En lugar de intentar construir toda la aplicación a la vez, se priorizan primero las bases del sistema y después se añaden módulos funcionales.

Orden de trabajo previsto:
1. Preparación inicial del proyecto.
2. Diseño de arquitectura.
3. Configuración de rutas y layout base.
4. Desarrollo del sistema de autenticación simple.
5. Gestión de mascotas.
6. Cuidado compartido y tutores.
7. Salud, vacunas, medicamentos y síntomas.
8. Dashboard, documentos y mejoras visuales.
9. Testing, revisión y despliegue.

Este enfoque permite construir una base sólida antes de añadir funciones más complejas.

## 5. Criterios de priorización
Las tareas se priorizan según estos criterios:

- **Impacto funcional**: primero se desarrollan las funciones necesarias para que la app tenga valor real.
- **Dependencias técnicas**: algunas tareas deben completarse antes que otras.
- **Visibilidad del progreso**: se intenta avanzar en partes que permitan ver resultados rápidamente.
- **Viabilidad del MVP**: las funcionalidades imprescindibles tienen prioridad sobre extras o bonus.

## 6. MVP y alcance
Para evitar un proyecto demasiado grande, se define un **MVP** (producto mínimo viable) con las funciones más importantes.

### Funcionalidades del MVP
- Registro e inicio de sesión.
- Dashboard básico.
- Gestión de mascotas.
- Compartición con múltiples tutores.
- Registro de vacunas y medicamentos.
- Notas diarias y alimentación.
- Registro de síntomas.
- Historial de actividad.
- Documentos básicos.

### Funcionalidades fuera del MVP inicial
- Mapa de clínicas veterinarias en Madrid.
- Historial de localización.
- Soporte multilenguaje completo PT / ES / EN.
- Notificaciones avanzadas.
- Roles complejos de permisos.
- Integraciones externas.

Estas funcionalidades podrán añadirse si el tiempo lo permite, pero no forman parte del núcleo mínimo necesario.

## 7. División de tareas
Cada funcionalidad grande se divide en subtareas más técnicas para facilitar el desarrollo y el seguimiento en Trello.

### Ejemplo: Gestión de mascotas
Card principal:
- Crear módulo de mascotas

Subtareas:
- Crear tipo `Pet` en TypeScript
- Diseñar formulario `PetForm`
- Crear página de listado de mascotas
- Crear página de detalle de mascota
- Conectar frontend con API de pets
- Añadir validación de campos
- Añadir estilos con Tailwind
- Probar flujo de creación y edición

### Ejemplo: Registro de síntomas
Card principal:
- Crear módulo de síntomas

Subtareas:
- Crear tipo `Symptom`
- Diseñar formulario de síntomas
- Añadir categoría y severidad
- Permitir subir fotos
- Crear listado de síntomas por mascota
- Conectar con endpoint correspondiente
- Mostrar mensajes de error y éxito

## 8. Convenciones de trabajo
Para mantener el proyecto ordenado, se siguen estas reglas:

- Cada card representa una funcionalidad o tarea concreta.
- Las tareas grandes se dividen en subtareas técnicas.
- Solo se mueve una tarea a **In Progress** cuando realmente se empieza a trabajar en ella.
- Una tarea no pasa a **Done** sin haber sido revisada antes.
- Las tareas terminadas deben funcionar correctamente y no mostrar errores en consola.
- La documentación se actualiza durante el proceso, no solo al final.

## 9. Tipos de tarjetas del tablero
Para organizar mejor el trabajo, las tarjetas se pueden clasificar por tipo:

- **Frontend**
- **Backend**
- **API**
- **UI/UX**
- **Docs**
- **Testing**
- **Deployment**

También se pueden usar etiquetas para identificar prioridad:
- Alta
- Media
- Baja

## 10. Flujo de desarrollo
El flujo de trabajo seguido durante el desarrollo es el siguiente:

1. Se detecta una necesidad o funcionalidad.
2. Se crea una tarjeta en **Backlog**.
3. Cuando esa tarea entra en planificación cercana, se mueve a **To Do**.
4. Al comenzar el desarrollo, pasa a **In Progress**.
5. Cuando la funcionalidad está implementada, pasa a **Review**.
6. Tras verificar funcionamiento, diseño y ausencia de errores importantes, pasa a **Done**.

Este flujo ayuda a saber en qué estado está cada parte del proyecto en todo momento.

## 11. Organización por bloques del proyecto
El trabajo se organiza por bloques funcionales:

### Bloque 1 — Setup
- Crear proyecto con Vite
- Configurar Tailwind
- Instalar React Router
- Preparar estructura de carpetas
- Inicializar Git
- Crear README inicial

### Bloque 2 — Arquitectura
- Definir tipos principales
- Diseñar recursos REST
- Preparar estructura del backend
- Diseñar flujo de datos
- Documentar decisiones en `docs/design.md`

### Bloque 3 — Autenticación y layout
- Login y registro
- Layout base
- Navegación principal
- Página 404

### Bloque 4 — Pets
- CRUD de mascotas
- Perfil y detalle
- Datos básicos y foto

### Bloque 5 — Shared care
- Invitación de tutores
- Vista compartida
- Historial de actividad

### Bloque 6 — Health
- Vacunas
- Medicamentos
- Historial veterinario
- Síntomas
- Documentos

### Bloque 7 — Dashboard y mejoras
- Cards resumen
- Alertas y recordatorios
- Mejoras de diseño
- Responsive

### Bloque 8 — Testing y deployment
- Pruebas manuales
- Corrección de bugs
- Revisión responsive
- Despliegue frontend
- Despliegue backend
- Documentación final

## 12. Seguimiento del progreso
El progreso del proyecto se medirá observando:

- Número de tarjetas en **Done**.
- Módulos principales finalizados.
- Estado del MVP.
- Incidencias detectadas en revisión.
- Calidad visual y técnica del resultado.

Más que medir cantidad de tareas, interesa comprobar que las funcionalidades clave del producto están completas y conectadas correctamente entre frontend y backend.

## 13. Riesgos detectados
Durante la planificación se identifican algunos riesgos:

- Aumentar demasiado el alcance del proyecto.
- Dedicar demasiado tiempo al diseño antes de tener la lógica funcional.
- Complejidad extra en subida de archivos o mapas.
- Problemas de integración entre frontend y backend.
- Tipos desalineados entre API y cliente.
- Falta de tiempo para testing y documentación.

Para reducir estos riesgos:
- Se prioriza el MVP.
- Se desarrolla por bloques pequeños.
- Se revisa la integración frecuentemente.
- Se deja lo opcional para fases posteriores.

## 14. Estrategia de revisión
Antes de mover una tarjeta a **Done**, se comprobará:

- Que la funcionalidad cumple su objetivo.
- Que el diseño es usable y consistente.
- Que no hay errores visibles en consola.
- Que el comportamiento responsive es correcto.
- Que el código sigue la estructura del proyecto.
- Que la documentación relevante está actualizada.

## 15. Relación entre Trello y documentación
El tablero Trello sirve para organizar la ejecución, mientras que la carpeta `docs/` documenta las decisiones tomadas.

Relación prevista:
- `docs/idea.md` → visión general del producto.
- `docs/project-management.md` → organización del trabajo.
- `docs/design.md` → arquitectura.
- `docs/components.md` → componentes creados.
- `docs/hooks.md` → hooks y lógica reutilizable.
- `docs/context.md` → estado global.
- `docs/routing.md` → rutas.
- `docs/forms.md` → formularios.
- `docs/api.md` → backend y endpoints.
- `docs/testing.md` → pruebas.
- `docs/deployment.md` → despliegue.
- `docs/retrospective.md` → reflexión final.

## 16. Conclusión de la organización
La organización del trabajo en PITUTI busca mantener un equilibrio entre planificación y flexibilidad. El uso de Trello permite visualizar el estado real del proyecto, mientras que la división en bloques y subtareas facilita avanzar paso a paso sin perder de vista el objetivo principal: construir una aplicación fullstack clara, útil y bien documentada.
````

## File: eslint.config.js
````javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
````

## File: index.html
````html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>pituti-app</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
````

## File: public/favicon.svg
````xml
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="46" fill="none" viewBox="0 0 48 46"><path fill="#863bff" d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z" style="fill:#863bff;fill:color(display-p3 .5252 .23 1);fill-opacity:1"/><mask id="a" width="48" height="46" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path fill="#000" d="M25.842 44.938c-.664.844-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.183c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.498 0-3.579-1.842-3.579H1.133c-.92 0-1.456-1.04-.92-1.787L9.91.473c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.578 1.842 3.578h11.377c.943 0 1.473 1.088.89 1.832L25.843 44.94z" style="fill:#000;fill-opacity:1"/></mask><g mask="url(#a)"><g filter="url(#b)"><ellipse cx="5.508" cy="14.704" fill="#ede6ff" rx="5.508" ry="14.704" style="fill:#ede6ff;fill:color(display-p3 .9275 .9033 1);fill-opacity:1" transform="matrix(.00324 1 1 -.00324 -4.47 31.516)"/></g><g filter="url(#c)"><ellipse cx="10.399" cy="29.851" fill="#ede6ff" rx="10.399" ry="29.851" style="fill:#ede6ff;fill:color(display-p3 .9275 .9033 1);fill-opacity:1" transform="matrix(.00324 1 1 -.00324 -39.328 7.883)"/></g><g filter="url(#d)"><ellipse cx="5.508" cy="30.487" fill="#7e14ff" rx="5.508" ry="30.487" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(89.814 -25.913 -14.639)scale(1 -1)"/></g><g filter="url(#e)"><ellipse cx="5.508" cy="30.599" fill="#7e14ff" rx="5.508" ry="30.599" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(89.814 -32.644 -3.334)scale(1 -1)"/></g><g filter="url(#f)"><ellipse cx="5.508" cy="30.599" fill="#7e14ff" rx="5.508" ry="30.599" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="matrix(.00324 1 1 -.00324 -34.34 30.47)"/></g><g filter="url(#g)"><ellipse cx="14.072" cy="22.078" fill="#ede6ff" rx="14.072" ry="22.078" style="fill:#ede6ff;fill:color(display-p3 .9275 .9033 1);fill-opacity:1" transform="rotate(93.35 24.506 48.493)scale(-1 1)"/></g><g filter="url(#h)"><ellipse cx="3.47" cy="21.501" fill="#7e14ff" rx="3.47" ry="21.501" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(89.009 28.708 47.59)scale(-1 1)"/></g><g filter="url(#i)"><ellipse cx="3.47" cy="21.501" fill="#7e14ff" rx="3.47" ry="21.501" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(89.009 28.708 47.59)scale(-1 1)"/></g><g filter="url(#j)"><ellipse cx=".387" cy="8.972" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(39.51 .387 8.972)"/></g><g filter="url(#k)"><ellipse cx="47.523" cy="-6.092" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(37.892 47.523 -6.092)"/></g><g filter="url(#l)"><ellipse cx="41.412" cy="6.333" fill="#47bfff" rx="5.971" ry="9.665" style="fill:#47bfff;fill:color(display-p3 .2799 .748 1);fill-opacity:1" transform="rotate(37.892 41.412 6.333)"/></g><g filter="url(#m)"><ellipse cx="-1.879" cy="38.332" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(37.892 -1.88 38.332)"/></g><g filter="url(#n)"><ellipse cx="-1.879" cy="38.332" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(37.892 -1.88 38.332)"/></g><g filter="url(#o)"><ellipse cx="35.651" cy="29.907" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(37.892 35.651 29.907)"/></g><g filter="url(#p)"><ellipse cx="38.418" cy="32.4" fill="#47bfff" rx="5.971" ry="15.297" style="fill:#47bfff;fill:color(display-p3 .2799 .748 1);fill-opacity:1" transform="rotate(37.892 38.418 32.4)"/></g></g><defs><filter id="b" width="60.045" height="41.654" x="-19.77" y="16.149" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="7.659"/></filter><filter id="c" width="90.34" height="51.437" x="-54.613" y="-7.533" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="7.659"/></filter><filter id="d" width="79.355" height="29.4" x="-49.64" y="2.03" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="e" width="79.579" height="29.4" x="-45.045" y="20.029" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="f" width="79.579" height="29.4" x="-43.513" y="21.178" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="g" width="74.749" height="58.852" x="15.756" y="-17.901" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="7.659"/></filter><filter id="h" width="61.377" height="25.362" x="23.548" y="2.284" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="i" width="61.377" height="25.362" x="23.548" y="2.284" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="j" width="56.045" height="63.649" x="-27.636" y="-22.853" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="k" width="54.814" height="64.646" x="20.116" y="-38.415" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="l" width="33.541" height="35.313" x="24.641" y="-11.323" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="m" width="54.814" height="64.646" x="-29.286" y="6.009" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="n" width="54.814" height="64.646" x="-29.286" y="6.009" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="o" width="54.814" height="64.646" x="8.244" y="-2.416" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="p" width="39.409" height="43.623" x="18.713" y="10.588" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter></defs></svg>
````

## File: public/icons.svg
````xml
<svg xmlns="http://www.w3.org/2000/svg">
  <symbol id="bluesky-icon" viewBox="0 0 16 17">
    <g clip-path="url(#bluesky-clip)"><path fill="#08060d" d="M7.75 7.735c-.693-1.348-2.58-3.86-4.334-5.097-1.68-1.187-2.32-.981-2.74-.79C.188 2.065.1 2.812.1 3.251s.241 3.602.398 4.13c.52 1.744 2.367 2.333 4.07 2.145-2.495.37-4.71 1.278-1.805 4.512 3.196 3.309 4.38-.71 4.987-2.746.608 2.036 1.307 5.91 4.93 2.746 2.72-2.746.747-4.143-1.747-4.512 1.702.189 3.55-.4 4.07-2.145.156-.528.397-3.691.397-4.13s-.088-1.186-.575-1.406c-.42-.19-1.06-.395-2.741.79-1.755 1.24-3.64 3.752-4.334 5.099"/></g>
    <defs><clipPath id="bluesky-clip"><path fill="#fff" d="M.1.85h15.3v15.3H.1z"/></clipPath></defs>
  </symbol>
  <symbol id="discord-icon" viewBox="0 0 20 19">
    <path fill="#08060d" d="M16.224 3.768a14.5 14.5 0 0 0-3.67-1.153c-.158.286-.343.67-.47.976a13.5 13.5 0 0 0-4.067 0c-.128-.306-.317-.69-.476-.976A14.4 14.4 0 0 0 3.868 3.77C1.546 7.28.916 10.703 1.231 14.077a14.7 14.7 0 0 0 4.5 2.306q.545-.748.965-1.587a9.5 9.5 0 0 1-1.518-.74q.191-.14.372-.293c2.927 1.369 6.107 1.369 8.999 0q.183.152.372.294-.723.437-1.52.74.418.838.963 1.588a14.6 14.6 0 0 0 4.504-2.308c.37-3.911-.63-7.302-2.644-10.309m-9.13 8.234c-.878 0-1.599-.82-1.599-1.82 0-.998.705-1.82 1.6-1.82.894 0 1.614.82 1.599 1.82.001 1-.705 1.82-1.6 1.82m5.91 0c-.878 0-1.599-.82-1.599-1.82 0-.998.705-1.82 1.6-1.82.893 0 1.614.82 1.599 1.82 0 1-.706 1.82-1.6 1.82"/>
  </symbol>
  <symbol id="documentation-icon" viewBox="0 0 21 20">
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="m15.5 13.333 1.533 1.322c.645.555.967.833.967 1.178s-.322.623-.967 1.179L15.5 18.333m-3.333-5-1.534 1.322c-.644.555-.966.833-.966 1.178s.322.623.966 1.179l1.534 1.321"/>
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="M17.167 10.836v-4.32c0-1.41 0-2.117-.224-2.68-.359-.906-1.118-1.621-2.08-1.96-.599-.21-1.349-.21-2.848-.21-2.623 0-3.935 0-4.983.369-1.684.591-3.013 1.842-3.641 3.428C3 6.449 3 7.684 3 10.154v2.122c0 2.558 0 3.838.706 4.726q.306.383.713.671c.76.536 1.79.64 3.581.66"/>
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="M3 10a2.78 2.78 0 0 1 2.778-2.778c.555 0 1.209.097 1.748-.047.48-.129.854-.503.982-.982.145-.54.048-1.194.048-1.749a2.78 2.78 0 0 1 2.777-2.777"/>
  </symbol>
  <symbol id="github-icon" viewBox="0 0 19 19">
    <path fill="#08060d" fill-rule="evenodd" d="M9.356 1.85C5.05 1.85 1.57 5.356 1.57 9.694a7.84 7.84 0 0 0 5.324 7.44c.387.079.528-.168.528-.376 0-.182-.013-.805-.013-1.454-2.165.467-2.616-.935-2.616-.935-.349-.91-.864-1.143-.864-1.143-.71-.48.051-.48.051-.48.787.051 1.2.805 1.2.805.695 1.194 1.817.857 2.268.649.064-.507.27-.857.49-1.052-1.728-.182-3.545-.857-3.545-3.87 0-.857.31-1.558.8-2.104-.078-.195-.349-1 .077-2.078 0 0 .657-.208 2.14.805a7.5 7.5 0 0 1 1.946-.26c.657 0 1.328.092 1.946.26 1.483-1.013 2.14-.805 2.14-.805.426 1.078.155 1.883.078 2.078.502.546.799 1.247.799 2.104 0 3.013-1.818 3.675-3.558 3.87.284.247.528.714.528 1.454 0 1.052-.012 1.896-.012 2.156 0 .208.142.455.528.377a7.84 7.84 0 0 0 5.324-7.441c.013-4.338-3.48-7.844-7.773-7.844" clip-rule="evenodd"/>
  </symbol>
  <symbol id="social-icon" viewBox="0 0 20 20">
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="M12.5 6.667a4.167 4.167 0 1 0-8.334 0 4.167 4.167 0 0 0 8.334 0"/>
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="M2.5 16.667a5.833 5.833 0 0 1 8.75-5.053m3.837.474.513 1.035c.07.144.257.282.414.309l.93.155c.596.1.736.536.307.965l-.723.73a.64.64 0 0 0-.152.531l.207.903c.164.715-.213.991-.84.618l-.872-.52a.63.63 0 0 0-.577 0l-.872.52c-.624.373-1.003.094-.84-.618l.207-.903a.64.64 0 0 0-.152-.532l-.723-.729c-.426-.43-.289-.864.306-.964l.93-.156a.64.64 0 0 0 .412-.31l.513-1.034c.28-.562.735-.562 1.012 0"/>
  </symbol>
  <symbol id="x-icon" viewBox="0 0 19 19">
    <path fill="#08060d" fill-rule="evenodd" d="M1.893 1.98c.052.072 1.245 1.769 2.653 3.77l2.892 4.114c.183.261.333.48.333.486s-.068.089-.152.183l-.522.593-.765.867-3.597 4.087c-.375.426-.734.834-.798.905a1 1 0 0 0-.118.148c0 .01.236.017.664.017h.663l.729-.83c.4-.457.796-.906.879-.999a692 692 0 0 0 1.794-2.038c.034-.037.301-.34.594-.675l.551-.624.345-.392a7 7 0 0 1 .34-.374c.006 0 .93 1.306 2.052 2.903l2.084 2.965.045.063h2.275c1.87 0 2.273-.003 2.266-.021-.008-.02-1.098-1.572-3.894-5.547-2.013-2.862-2.28-3.246-2.273-3.266.008-.019.282-.332 2.085-2.38l2-2.274 1.567-1.782c.022-.028-.016-.03-.65-.03h-.674l-.3.342a871 871 0 0 1-1.782 2.025c-.067.075-.405.458-.75.852a100 100 0 0 1-.803.91c-.148.172-.299.344-.99 1.127-.304.343-.32.358-.345.327-.015-.019-.904-1.282-1.976-2.808L6.365 1.85H1.8zm1.782.91 8.078 11.294c.772 1.08 1.413 1.973 1.425 1.984.016.017.241.02 1.05.017l1.03-.004-2.694-3.766L7.796 5.75 5.722 2.852l-1.039-.004-1.039-.004z" clip-rule="evenodd"/>
  </symbol>
</svg>
````

## File: README.md
````markdown
# 🐾 PITUTI App

Aplicação fullstack para gestão colaborativa de cuidados com pets.

## Stack

- **Frontend:** React + TypeScript + Tailwind CSS v4 + React Router
- **Backend:** Express (Node.js)
- **Dados:** LocalStorage + API REST

## Estrutura do projeto
src/
├── components/
├── pages/
├── hooks/
├── types/
├── utils/
├── context/
└── api/

server/src/
├── routes/
├── controllers/
├── services/
└── config/

docs/


## Organização do trabalho

A gestão do projeto é feita com um quadro Kanban no Trello:

🔗 [Abrir quadro no Trello](https://trello.com/b/0x3mrcpM/pituti-app)

Documentação completa em [docs/project-management.md](docs/project-management.md)
````

## File: server/src/config/.gitkeep
````

````

## File: server/src/controllers/.gitkeep
````

````

## File: server/src/routes/.gitkeep
````

````

## File: server/src/services/.gitkeep
````

````

## File: src/api/.gitkeep
````

````

## File: src/App.css
````css
.counter {
  font-size: 16px;
  padding: 5px 10px;
  border-radius: 5px;
  color: var(--accent);
  background: var(--accent-bg);
  border: 2px solid transparent;
  transition: border-color 0.3s;
  margin-bottom: 24px;

  &:hover {
    border-color: var(--accent-border);
  }
  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
}

.hero {
  position: relative;

  .base,
  .framework,
  .vite {
    inset-inline: 0;
    margin: 0 auto;
  }

  .base {
    width: 170px;
    position: relative;
    z-index: 0;
  }

  .framework,
  .vite {
    position: absolute;
  }

  .framework {
    z-index: 1;
    top: 34px;
    height: 28px;
    transform: perspective(2000px) rotateZ(300deg) rotateX(44deg) rotateY(39deg)
      scale(1.4);
  }

  .vite {
    z-index: 0;
    top: 107px;
    height: 26px;
    width: auto;
    transform: perspective(2000px) rotateZ(300deg) rotateX(40deg) rotateY(39deg)
      scale(0.8);
  }
}

#center {
  display: flex;
  flex-direction: column;
  gap: 25px;
  place-content: center;
  place-items: center;
  flex-grow: 1;

  @media (max-width: 1024px) {
    padding: 32px 20px 24px;
    gap: 18px;
  }
}

#next-steps {
  display: flex;
  border-top: 1px solid var(--border);
  text-align: left;

  & > div {
    flex: 1 1 0;
    padding: 32px;
    @media (max-width: 1024px) {
      padding: 24px 20px;
    }
  }

  .icon {
    margin-bottom: 16px;
    width: 22px;
    height: 22px;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    text-align: center;
  }
}

#docs {
  border-right: 1px solid var(--border);

  @media (max-width: 1024px) {
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
}

#next-steps ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 8px;
  margin: 32px 0 0;

  .logo {
    height: 18px;
  }

  a {
    color: var(--text-h);
    font-size: 16px;
    border-radius: 6px;
    background: var(--social-bg);
    display: flex;
    padding: 6px 12px;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    transition: box-shadow 0.3s;

    &:hover {
      box-shadow: var(--shadow);
    }
    .button-icon {
      height: 18px;
      width: 18px;
    }
  }

  @media (max-width: 1024px) {
    margin-top: 20px;
    flex-wrap: wrap;
    justify-content: center;

    li {
      flex: 1 1 calc(50% - 8px);
    }

    a {
      width: 100%;
      justify-content: center;
      box-sizing: border-box;
    }
  }
}

#spacer {
  height: 88px;
  border-top: 1px solid var(--border);
  @media (max-width: 1024px) {
    height: 48px;
  }
}

.ticks {
  position: relative;
  width: 100%;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: -4.5px;
    border: 5px solid transparent;
  }

  &::before {
    left: 0;
    border-left-color: var(--border);
  }
  &::after {
    right: 0;
    border-right-color: var(--border);
  }
}
````

## File: src/assets/react.svg
````xml
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="35.93" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 228"><path fill="#00D8FF" d="M210.483 73.824a171.49 171.49 0 0 0-8.24-2.597c.465-1.9.893-3.777 1.273-5.621c6.238-30.281 2.16-54.676-11.769-62.708c-13.355-7.7-35.196.329-57.254 19.526a171.23 171.23 0 0 0-6.375 5.848a155.866 155.866 0 0 0-4.241-3.917C100.759 3.829 77.587-4.822 63.673 3.233C50.33 10.957 46.379 33.89 51.995 62.588a170.974 170.974 0 0 0 1.892 8.48c-3.28.932-6.445 1.924-9.474 2.98C17.309 83.498 0 98.307 0 113.668c0 15.865 18.582 31.778 46.812 41.427a145.52 145.52 0 0 0 6.921 2.165a167.467 167.467 0 0 0-2.01 9.138c-5.354 28.2-1.173 50.591 12.134 58.266c13.744 7.926 36.812-.22 59.273-19.855a145.567 145.567 0 0 0 5.342-4.923a168.064 168.064 0 0 0 6.92 6.314c21.758 18.722 43.246 26.282 56.54 18.586c13.731-7.949 18.194-32.003 12.4-61.268a145.016 145.016 0 0 0-1.535-6.842c1.62-.48 3.21-.974 4.76-1.488c29.348-9.723 48.443-25.443 48.443-41.52c0-15.417-17.868-30.326-45.517-39.844Zm-6.365 70.984c-1.4.463-2.836.91-4.3 1.345c-3.24-10.257-7.612-21.163-12.963-32.432c5.106-11 9.31-21.767 12.459-31.957c2.619.758 5.16 1.557 7.61 2.4c23.69 8.156 38.14 20.213 38.14 29.504c0 9.896-15.606 22.743-40.946 31.14Zm-10.514 20.834c2.562 12.94 2.927 24.64 1.23 33.787c-1.524 8.219-4.59 13.698-8.382 15.893c-8.067 4.67-25.32-1.4-43.927-17.412a156.726 156.726 0 0 1-6.437-5.87c7.214-7.889 14.423-17.06 21.459-27.246c12.376-1.098 24.068-2.894 34.671-5.345a134.17 134.17 0 0 1 1.386 6.193ZM87.276 214.515c-7.882 2.783-14.16 2.863-17.955.675c-8.075-4.657-11.432-22.636-6.853-46.752a156.923 156.923 0 0 1 1.869-8.499c10.486 2.32 22.093 3.988 34.498 4.994c7.084 9.967 14.501 19.128 21.976 27.15a134.668 134.668 0 0 1-4.877 4.492c-9.933 8.682-19.886 14.842-28.658 17.94ZM50.35 144.747c-12.483-4.267-22.792-9.812-29.858-15.863c-6.35-5.437-9.555-10.836-9.555-15.216c0-9.322 13.897-21.212 37.076-29.293c2.813-.98 5.757-1.905 8.812-2.773c3.204 10.42 7.406 21.315 12.477 32.332c-5.137 11.18-9.399 22.249-12.634 32.792a134.718 134.718 0 0 1-6.318-1.979Zm12.378-84.26c-4.811-24.587-1.616-43.134 6.425-47.789c8.564-4.958 27.502 2.111 47.463 19.835a144.318 144.318 0 0 1 3.841 3.545c-7.438 7.987-14.787 17.08-21.808 26.988c-12.04 1.116-23.565 2.908-34.161 5.309a160.342 160.342 0 0 1-1.76-7.887Zm110.427 27.268a347.8 347.8 0 0 0-7.785-12.803c8.168 1.033 15.994 2.404 23.343 4.08c-2.206 7.072-4.956 14.465-8.193 22.045a381.151 381.151 0 0 0-7.365-13.322Zm-45.032-43.861c5.044 5.465 10.096 11.566 15.065 18.186a322.04 322.04 0 0 0-30.257-.006c4.974-6.559 10.069-12.652 15.192-18.18ZM82.802 87.83a323.167 323.167 0 0 0-7.227 13.238c-3.184-7.553-5.909-14.98-8.134-22.152c7.304-1.634 15.093-2.97 23.209-3.984a321.524 321.524 0 0 0-7.848 12.897Zm8.081 65.352c-8.385-.936-16.291-2.203-23.593-3.793c2.26-7.3 5.045-14.885 8.298-22.6a321.187 321.187 0 0 0 7.257 13.246c2.594 4.48 5.28 8.868 8.038 13.147Zm37.542 31.03c-5.184-5.592-10.354-11.779-15.403-18.433c4.902.192 9.899.29 14.978.29c5.218 0 10.376-.117 15.453-.343c-4.985 6.774-10.018 12.97-15.028 18.486Zm52.198-57.817c3.422 7.8 6.306 15.345 8.596 22.52c-7.422 1.694-15.436 3.058-23.88 4.071a382.417 382.417 0 0 0 7.859-13.026a347.403 347.403 0 0 0 7.425-13.565Zm-16.898 8.101a358.557 358.557 0 0 1-12.281 19.815a329.4 329.4 0 0 1-23.444.823c-7.967 0-15.716-.248-23.178-.732a310.202 310.202 0 0 1-12.513-19.846h.001a307.41 307.41 0 0 1-10.923-20.627a310.278 310.278 0 0 1 10.89-20.637l-.001.001a307.318 307.318 0 0 1 12.413-19.761c7.613-.576 15.42-.876 23.31-.876H128c7.926 0 15.743.303 23.354.883a329.357 329.357 0 0 1 12.335 19.695a358.489 358.489 0 0 1 11.036 20.54a329.472 329.472 0 0 1-11 20.722Zm22.56-122.124c8.572 4.944 11.906 24.881 6.52 51.026c-.344 1.668-.73 3.367-1.15 5.09c-10.622-2.452-22.155-4.275-34.23-5.408c-7.034-10.017-14.323-19.124-21.64-27.008a160.789 160.789 0 0 1 5.888-5.4c18.9-16.447 36.564-22.941 44.612-18.3ZM128 90.808c12.625 0 22.86 10.235 22.86 22.86s-10.235 22.86-22.86 22.86s-22.86-10.235-22.86-22.86s10.235-22.86 22.86-22.86Z"></path></svg>
````

## File: src/assets/vite.svg
````xml
<svg xmlns="http://www.w3.org/2000/svg" width="77" height="47" fill="none" aria-labelledby="vite-logo-title" viewBox="0 0 77 47"><title id="vite-logo-title">Vite</title><style>.parenthesis{fill:#000}@media (prefers-color-scheme:dark){.parenthesis{fill:#fff}}</style><path fill="#9135ff" d="M40.151 45.71c-.663.844-2.02.374-2.02-.699V34.708a2.26 2.26 0 0 0-2.262-2.262H24.493c-.92 0-1.457-1.04-.92-1.788l7.479-10.471c1.07-1.498 0-3.578-1.842-3.578H15.443c-.92 0-1.456-1.04-.92-1.788l9.696-13.576c.213-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.472c-1.07 1.497 0 3.578 1.842 3.578h11.376c.944 0 1.474 1.087.89 1.83L40.153 45.712z"/><mask id="a" width="48" height="47" x="14" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path fill="#000" d="M40.047 45.71c-.663.843-2.02.374-2.02-.699V34.708a2.26 2.26 0 0 0-2.262-2.262H24.389c-.92 0-1.457-1.04-.92-1.788l7.479-10.472c1.07-1.497 0-3.578-1.842-3.578H15.34c-.92 0-1.456-1.04-.92-1.788l9.696-13.575c.213-.297.556-.474.92-.474H53.93c.92 0 1.456 1.04.92 1.788L47.37 13.03c-1.07 1.498 0 3.578 1.842 3.578h11.376c.944 0 1.474 1.088.89 1.831L40.049 45.712z"/></mask><g mask="url(#a)"><g filter="url(#b)"><ellipse cx="5.508" cy="14.704" fill="#eee6ff" rx="5.508" ry="14.704" transform="rotate(269.814 20.96 11.29)scale(-1 1)"/></g><g filter="url(#c)"><ellipse cx="10.399" cy="29.851" fill="#eee6ff" rx="10.399" ry="29.851" transform="rotate(89.814 -16.902 -8.275)scale(1 -1)"/></g><g filter="url(#d)"><ellipse cx="5.508" cy="30.487" fill="#8900ff" rx="5.508" ry="30.487" transform="rotate(89.814 -19.197 -7.127)scale(1 -1)"/></g><g filter="url(#e)"><ellipse cx="5.508" cy="30.599" fill="#8900ff" rx="5.508" ry="30.599" transform="rotate(89.814 -25.928 4.177)scale(1 -1)"/></g><g filter="url(#f)"><ellipse cx="5.508" cy="30.599" fill="#8900ff" rx="5.508" ry="30.599" transform="rotate(89.814 -25.738 5.52)scale(1 -1)"/></g><g filter="url(#g)"><ellipse cx="14.072" cy="22.078" fill="#eee6ff" rx="14.072" ry="22.078" transform="rotate(93.35 31.245 55.578)scale(-1 1)"/></g><g filter="url(#h)"><ellipse cx="3.47" cy="21.501" fill="#8900ff" rx="3.47" ry="21.501" transform="rotate(89.009 35.419 55.202)scale(-1 1)"/></g><g filter="url(#i)"><ellipse cx="3.47" cy="21.501" fill="#8900ff" rx="3.47" ry="21.501" transform="rotate(89.009 35.419 55.202)scale(-1 1)"/></g><g filter="url(#j)"><ellipse cx="14.592" cy="9.743" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(39.51 14.592 9.743)"/></g><g filter="url(#k)"><ellipse cx="61.728" cy="-5.321" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 61.728 -5.32)"/></g><g filter="url(#l)"><ellipse cx="55.618" cy="7.104" fill="#00c2ff" rx="5.971" ry="9.665" transform="rotate(37.892 55.618 7.104)"/></g><g filter="url(#m)"><ellipse cx="12.326" cy="39.103" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 12.326 39.103)"/></g><g filter="url(#n)"><ellipse cx="12.326" cy="39.103" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 12.326 39.103)"/></g><g filter="url(#o)"><ellipse cx="49.857" cy="30.678" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 49.857 30.678)"/></g><g filter="url(#p)"><ellipse cx="52.623" cy="33.171" fill="#00c2ff" rx="5.971" ry="15.297" transform="rotate(37.892 52.623 33.17)"/></g></g><path d="M6.919 0c-9.198 13.166-9.252 33.575 0 46.789h6.215c-9.25-13.214-9.196-33.623 0-46.789zm62.424 0h-6.215c9.198 13.166 9.252 33.575 0 46.789h6.215c9.25-13.214 9.196-33.623 0-46.789" class="parenthesis"/><defs><filter id="b" width="60.045" height="41.654" x="-5.564" y="16.92" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="7.659"/></filter><filter id="c" width="90.34" height="51.437" x="-40.407" y="-6.762" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="7.659"/></filter><filter id="d" width="79.355" height="29.4" x="-35.435" y="2.801" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="e" width="79.579" height="29.4" x="-30.84" y="20.8" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="f" width="79.579" height="29.4" x="-29.307" y="21.949" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="g" width="74.749" height="58.852" x="29.961" y="-17.13" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="7.659"/></filter><filter id="h" width="61.377" height="25.362" x="37.754" y="3.055" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="i" width="61.377" height="25.362" x="37.754" y="3.055" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="j" width="56.045" height="63.649" x="-13.43" y="-22.082" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="k" width="54.814" height="64.646" x="34.321" y="-37.644" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="l" width="33.541" height="35.313" x="38.847" y="-10.552" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="m" width="54.814" height="64.646" x="-15.081" y="6.78" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="n" width="54.814" height="64.646" x="-15.081" y="6.78" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="o" width="54.814" height="64.646" x="22.45" y="-1.645" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="p" width="39.409" height="43.623" x="32.919" y="11.36" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter></defs></svg>
````

## File: src/components/Avatar.tsx
````typescript
import { useState } from 'react'

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  name: string
  photoUrl?: string
  size?: AvatarSize
  className?: string
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-20 w-20 text-xl',
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('')
}

export default function Avatar({ name, photoUrl, size = 'md', className = '' }: AvatarProps) {
  const [imgError, setImgError] = useState(false)

  return (
    <div
      className={[
        'relative flex shrink-0 items-center justify-center rounded-full',
        'bg-teal-100 font-semibold text-teal-800 overflow-hidden',
        sizeClasses[size],
        className,
      ].join(' ')}
      aria-label={name}
    >
      {photoUrl && !imgError ? (
        <img
          src={photoUrl}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  )
}
````

## File: src/components/Badge.tsx
````typescript
import type { BadgeStatus } from '../types'

interface BadgeProps {
  label: string
  status?: BadgeStatus
  className?: string
}

const statusClasses: Record<BadgeStatus, string> = {
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  danger:  'bg-red-100 text-red-700',
  info:    'bg-blue-100 text-blue-800',
  neutral: 'bg-stone-100 text-stone-600',
}

export default function Badge({ label, status = 'neutral', className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        statusClasses[status],
        className,
      ].join(' ')}
    >
      {label}
    </span>
  )
}
````

## File: src/components/Button.tsx
````typescript
import type { ButtonHTMLAttributes } from 'react'
import type { ButtonVariant, ButtonSize } from '../types'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  fullWidth?: boolean
  ariaLabel?: string
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:   'bg-teal-700 text-white hover:bg-teal-800 active:bg-teal-900',
  secondary: 'bg-stone-100 text-stone-900 border border-stone-300 hover:bg-stone-200 active:bg-stone-300',
  ghost:     'bg-transparent text-stone-700 hover:bg-stone-100 active:bg-stone-200',
  danger:    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  ariaLabel,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      aria-label={ariaLabel}
      disabled={disabled || isLoading}
      className={[
        'inline-flex items-center justify-center gap-2 font-medium',
        'transition-all duration-150 focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {isLoading && (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  )
}
````

## File: src/components/Card.tsx
````typescript
import type { ReactNode } from 'react'

type CardPadding = 'none' | 'sm' | 'md' | 'lg'

interface CardProps {
  children: ReactNode
  padding?: CardPadding
  onClick?: () => void
  className?: string
}

const paddingClasses: Record<CardPadding, string> = {
  none: '',
  sm:   'p-3',
  md:   'p-4',
  lg:   'p-6',
}

export default function Card({ children, padding = 'md', onClick, className = '' }: CardProps) {
  const interactive = !!onClick

  return (
    <div
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={interactive ? (e) => e.key === 'Enter' && onClick() : undefined}
      className={[
        'rounded-2xl border border-stone-200 bg-white shadow-sm',
        interactive ? 'cursor-pointer hover:shadow-md hover:border-teal-300 transition-all duration-150' : '',
        paddingClasses[padding],
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}
````

## File: src/components/EmptyState.tsx
````typescript
import type { ReactNode } from 'react'
import Button from './Button'

interface EmptyStateProps {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  icon?: ReactNode
}

const DefaultIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M9 9h.01M15 9h.01M9 15s1 2 3 2 3-2 3-2" strokeLinecap="round" />
  </svg>
)

export default function EmptyState({ title, description, actionLabel, onAction, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 px-8 text-center">
      <span className="text-stone-400">{icon ?? <DefaultIcon />}</span>
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-stone-800">{title}</h3>
        {description && <p className="max-w-xs text-sm text-stone-500">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  )
}
````

## File: src/components/Input.tsx
````typescript
import { useId, type ChangeEvent } from 'react'

interface InputProps {
  label: string
  name: string
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  type?: 'text' | 'email' | 'password' | 'date' | 'number' | 'tel'
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
  className?: string
}

export default function Input({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
  hint,
  disabled = false,
  required = false,
  className = '',
}: InputProps) {
  const id = useId()

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-stone-800">
        {label}
        {required && <span className="ml-1 text-red-600" aria-hidden="true">*</span>}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={[
          'w-full rounded-xl border px-3 py-2 text-sm text-stone-900',
          'placeholder:text-stone-400 focus:outline-none focus:ring-2',
          'transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
          error
            ? 'border-red-400 focus:ring-red-500 bg-red-50'
            : 'border-stone-300 focus:ring-teal-600 bg-white',
        ].join(' ')}
      />

      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-600">{error}</p>
      )}
      {!error && hint && (
        <p id={`${id}-hint`} className="text-xs text-stone-500">{hint}</p>
      )}
    </div>
  )
}
````

## File: src/components/Modal.tsx
````typescript
import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import Button from './Button'

type ModalSize = 'sm' | 'md' | 'lg'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  size?: ModalSize
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

export default function Modal({ isOpen, onClose, title, children, footer, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handler)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handler)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={['relative w-full rounded-2xl bg-white shadow-xl', sizeClasses[size]].join(' ')}>
        <header className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
          <h2 id="modal-title" className="text-base font-semibold text-stone-900">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} ariaLabel="Cerrar modal">✕</Button>
        </header>
        <div className="px-6 py-5">{children}</div>
        {footer && (
          <footer className="flex justify-end gap-2 border-t border-stone-200 px-6 py-4">
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body
  )
}
````

## File: src/components/OverviewCard.tsx
````typescript
import type { ReactNode } from 'react'
import type { BadgeStatus } from '../types'
import Badge from './Badge'

interface OverviewCardProps {
  title: string
  value: string | number
  description?: string
  status?: BadgeStatus
  statusLabel?: string
  icon?: ReactNode
  onClick?: () => void
}

export default function OverviewCard({
  title, value, description, status, statusLabel, icon, onClick,
}: OverviewCardProps) {
  const interactive = !!onClick

  return (
    <div
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={interactive ? (e) => e.key === 'Enter' && onClick() : undefined}
      className={[
        'rounded-2xl border border-stone-200 bg-white p-5 shadow-sm flex flex-col gap-3',
        interactive ? 'cursor-pointer hover:shadow-md hover:border-teal-300 transition-all duration-150' : '',
      ].join(' ')}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-stone-600">{title}</p>
        {icon && <span className="text-stone-400">{icon}</span>}
      </div>

      <p className="text-3xl font-bold tabular-nums text-stone-900">{value}</p>

      {description && <p className="text-xs text-stone-500">{description}</p>}

      {status && statusLabel && (
        <Badge label={statusLabel} status={status} />
      )}
    </div>
  )
}
````

## File: src/components/PetCard.tsx
````typescript
import type { Pet } from '../types'
import Avatar from './Avatar'
import Badge, { } from './Badge'
import Card from './Card'
import type { BadgeStatus } from '../types'

interface PetCardProps {
  pet: Pet
  onClick?: (pet: Pet) => void
  isActive?: boolean
}

const speciesLabel: Record<string, string> = {
  dog: 'Perro',
  cat: 'Gato',
  bird: 'Ave',
  rabbit: 'Conejo',
  reptile: 'Reptil',
  other: 'Otro',
}

const speciesStatus: Record<string, BadgeStatus> = {
  dog: 'info',
  cat: 'success',
  bird: 'warning',
  rabbit: 'neutral',
  reptile: 'danger',
  other: 'neutral',
}

function calcAge(birthDate?: string): string {
  if (!birthDate) return 'Edad desconocida'
  const birth = new Date(birthDate)
  const now = new Date()
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth()
  if (months < 12) return `${months} mes${months === 1 ? '' : 'es'}`
  const years = Math.floor(months / 12)
  return `${years} año${years === 1 ? '' : 's'}`
}

export default function PetCard({ pet, onClick, isActive = false }: PetCardProps) {
  return (
    <Card
      padding="md"
      onClick={onClick ? () => onClick(pet) : undefined}
      className={isActive ? 'ring-2 ring-teal-600 border-teal-300' : ''}
    >
      <div className="flex items-center gap-3">
        <Avatar name={pet.name} photoUrl={pet.photoUrl} size="md" />

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-stone-900 truncate">{pet.name}</p>
          <p className="text-xs text-stone-500 truncate">
            {pet.breed ?? 'Raza desconocida'} · {calcAge(pet.birthDate)}
          </p>
        </div>

        <Badge
          label={speciesLabel[pet.species] ?? 'Otro'}
          status={speciesStatus[pet.species] ?? 'neutral'}
        />
      </div>
    </Card>
  )
}
````

## File: src/components/SkeletonLoader.tsx
````typescript
interface SkeletonProps {
  className?: string
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={['rounded-lg bg-stone-200 skeleton-shimmer', className].join(' ')}
      aria-hidden="true"
    />
  )
}

export function SkeletonPetCard() {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/5" />
          <Skeleton className="h-3 w-3/5" />
        </div>
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
    </div>
  )
}

export function SkeletonListItem() {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white p-3 border border-stone-200">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}

export function SkeletonOverviewCard() {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-5 w-20 rounded-full" />
    </div>
  )
}
````

## File: src/context/.gitkeep
````

````

## File: src/hooks/usePets.ts
````typescript
import { useCallback, useEffect, useState } from 'react'
import type { Pet } from '../types'

interface UsePetsResult {
  pets: Pet[]
  loading: boolean
  error: string | null
  reload: () => Promise<void>
  addPet: (pet: Pet) => void
  removePet: (petId: string) => void
}

const MOCK_PETS: Pet[] = [
  {
    id: 'pet-1',
    name: 'Luna',
    species: 'cat',
    breed: 'Europeo común',
    birthDate: '2021-05-14',
    photoUrl: '',
    ownerId: 'user-1',
    createdAt: '2026-04-01T10:00:00.000Z',
  },
  {
    id: 'pet-2',
    name: 'Toby',
    species: 'dog',
    breed: 'Mestizo',
    birthDate: '2020-10-01',
    photoUrl: '',
    ownerId: 'user-1',
    createdAt: '2026-04-02T10:00:00.000Z',
  },
  {
    id: 'pet-3',
    name: 'Kiwi',
    species: 'bird',
    breed: 'Periquito',
    birthDate: '2023-02-18',
    photoUrl: '',
    ownerId: 'user-1',
    createdAt: '2026-04-03T10:00:00.000Z',
  },
]

export function usePets(): UsePetsResult {
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setPets(MOCK_PETS)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [])

  const addPet = useCallback((pet: Pet) => {
    setPets((prev) => [pet, ...prev])
  }, [])

  const removePet = useCallback((petId: string) => {
    setPets((prev) => prev.filter((pet) => pet.id !== petId))
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  return { pets, loading, error, reload, addPet, removePet }
}
````

## File: src/pages/PetListPage.tsx
````typescript
import { useCallback, useMemo, useState } from 'react'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import Input from '../components/Input'
import PetCard from '../components/PetCard'
import { SkeletonPetCard } from '../components/SkeletonLoader'
import type { Pet } from '../types'
import { usePets } from '../hooks/usePets'

export default function PetListPage() {
  const { pets, loading, error, addPet, removePet, reload } = usePets()
  const [search, setSearch] = useState('')
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null)

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value)
    },
    []
  )

  const handleSelectPet = useCallback((pet: Pet) => {
    setSelectedPetId((prev) => (prev === pet.id ? null : pet.id))
  }, [])

  const handleAddMockPet = useCallback(() => {
    const newPet: Pet = {
      id: `pet-${Date.now()}`,
      name: 'Milo',
      species: 'dog',
      breed: 'Labrador',
      birthDate: '2022-01-12',
      photoUrl: '',
      ownerId: 'user-1',
      createdAt: new Date().toISOString(),
    }
    addPet(newPet)
  }, [addPet])

  const handleDeleteSelected = useCallback(() => {
    if (!selectedPetId) return
    removePet(selectedPetId)
    setSelectedPetId(null)
  }, [removePet, selectedPetId])

  const filteredPets = useMemo(() => {
    const term = search.trim().toLowerCase()
    return [...pets]
      .filter((pet) => {
        if (!term) return true
        return (
          pet.name.toLowerCase().includes(term) ||
          pet.species.toLowerCase().includes(term) ||
          pet.breed?.toLowerCase().includes(term)
        )
      })
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [pets, search])

  return (
    <section className="min-h-screen bg-stone-50 px-4 py-8 md:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">

        {/* Header */}
        <header className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-teal-700">PITUTI</p>
            <h1 className="mt-1 text-2xl font-bold text-stone-900">Mis mascotas</h1>
            <p className="mt-1 text-sm text-stone-500">Gestiona tu familia peluda.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={reload}>Recargar</Button>
            <Button onClick={handleAddMockPet}>+ Añadir mascota</Button>
          </div>
        </header>

        {/* Filtros */}
        <div className="grid gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm md:grid-cols-[1fr_auto] md:items-end">
          <Input
            label="Buscar mascota"
            name="search"
            placeholder="Nombre, especie o raza..."
            value={search}
            onChange={handleSearchChange}
          />
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-stone-100 px-3 py-2 text-sm font-medium text-stone-600">
              {filteredPets.length} resultado(s)
            </span>
            <Button
              variant="danger"
              onClick={handleDeleteSelected}
              disabled={!selectedPetId}
            >
              Eliminar
            </Button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Lista */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonPetCard key={i} />)}
          </div>
        ) : filteredPets.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
            <EmptyState
              title="No hay mascotas"
              description="Añade una mascota para empezar."
              actionLabel="Añadir mascota"
              onAction={handleAddMockPet}
            />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredPets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                onClick={handleSelectPet}
                isActive={selectedPetId === pet.id}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
````

## File: src/types/index.ts
````typescript
// ─────────────────────────────────────────────
// Tipos de dominio — PITUTI
// ─────────────────────────────────────────────

export type Species = 'dog' | 'cat' | 'bird' | 'rabbit' | 'reptile' | 'other'
export type BadgeStatus = 'success' | 'warning' | 'danger' | 'info' | 'neutral'
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

// Usuario
export interface User {
  id: string
  name: string
  email: string
  photoUrl?: string
  createdAt: string
}

// Mascota
export interface Pet {
  id: string
  name: string
  species: Species
  breed?: string
  birthDate?: string
  photoUrl?: string
  ownerId: string
  createdAt: string
}

// Vacuna
export interface Vaccine {
  id: string
  petId: string
  name: string
  date: string
  nextDueDate?: string
  veterinary?: string
  notes?: string
}

// Medicamento
export interface Medication {
  id: string
  petId: string
  name: string
  dosage: string
  frequency: string
  startDate: string
  endDate?: string
  notes?: string
}

// Síntoma
export interface Symptom {
  id: string
  petId: string
  description: string
  severity: 'mild' | 'moderate' | 'severe'
  date: string
  resolved: boolean
}

// Registro de alimentación
export interface FeedingLog {
  id: string
  petId: string
  date: string
  food: string
  amount?: string
  notes?: string
}

// Nota
export interface Note {
  id: string
  petId: string
  content: string
  createdAt: string
}

// Documento
export interface DocumentFile {
  id: string
  petId: string
  name: string
  url: string
  type: string
  uploadedAt: string
}

// Actividad del log
export interface ActivityLog {
  id: string
  petId: string
  action: string
  description: string
  timestamp: string
}
````

## File: src/utils/.gitkeep
````

````

## File: tailwind.config
````
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
````

## File: tsconfig.app.json
````json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2023",
    "useDefineForClassFields": true,
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "types": ["vite/client"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
````

## File: tsconfig.json
````json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
````

## File: tsconfig.node.json
````json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "types": ["node"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
````

## File: docs/design.md
````markdown
## Visión general

PITUTI es una aplicación fullstack para la gestión colaborativa del cuidado de mascotas. Múltiples tutores pueden compartir el seguimiento de vacunas, medicamentos, síntomas, alimentación y documentos de un mismo animal. La arquitectura sigue una separación clara entre frontend (React), API REST (Express) y capa de datos.

***

## Estructura de componentes del frontend

### Páginas (src/pages/)

Cada página corresponde a una ruta de React Router. Son responsables de cargar datos mediante hooks y componer la UI con componentes reutilizables.

| Página | Ruta | Descripción |
|---|---|---|
| `LoginPage` | `/login` | Formulario de inicio de sesión |
| `RegisterPage` | `/register` | Formulario de registro de nuevo usuario |
| `DashboardPage` | `/dashboard` | Vista general con resumen de todas las mascotas |
| `PetListPage` | `/pets` | Listado de mascotas del tutor |
| `PetFormPage` | `/pets/new` y `/pets/:petId/edit` | Crear o editar mascota |
| `PetDetailPage` | `/pets/:petId` | Perfil completo de una mascota |
| `PetHealthPage` | `/pets/:petId/health` | Vacunas, medicamentos e historial veterinario |
| `PetFeedingsPage` | `/pets/:petId/feedings` | Registro de alimentación |
| `PetSymptomsPage` | `/pets/:petId/symptoms` | Registro de síntomas |
| `PetDocumentsPage` | `/pets/:petId/documents` | Documentos subidos |
| `PetCaregiversPage` | `/pets/:petId/caregivers` | Tutores vinculados a la mascota |
| `NotFoundPage` | `*` | Página 404 |

### Componentes reutilizables (src/components/)

Los componentes reutilizables son independientes del dominio y pueden usarse en varias páginas.

**UI base:**
- `Button` — botón con variantes (primary, secondary, ghost, danger)
- `Input` — campo de texto con label, placeholder y estado de error
- `Modal` — overlay genérico con título y acción de cierre
- `Badge` — etiqueta de estado (activo, vencido, próximo)
- `Avatar` — imagen circular de perfil con fallback de iniciales
- `Card` — contenedor con sombra y borde sutil
- `EmptyState` — mensaje + icono + CTA cuando no hay datos
- `LoadingSpinner` — indicador de carga circular
- `SkeletonLoader` — esqueleto animado que espeja el layout real
- `Divider` — separador visual horizontal

**Dominio pets:**
- `PetCard` — tarjeta resumida de una mascota (nombre, especie, foto)
- `PetProfileHeader` — cabecera del perfil con foto, nombre y especie
- `PetAvatarUploader` — componente de subida de foto de mascota
- `OverviewCard` — card de resumen de una categoría (vacunas, medicamentos, etc.)

**Dominio salud:**
- `VaccineList` — lista de vacunas con estado por dosis
- `VaccineForm` — formulario de nueva vacuna
- `MedicationList` — lista de medicamentos activos
- `MedicationForm` — formulario de nuevo medicamento
- `SymptomList` — lista de síntomas registrados
- `SymptomForm` — formulario de nuevo síntoma

**Dominio rutina:**
- `FeedingList` — historial de alimentación
- `FeedingForm` — formulario de nuevo registro de alimentación
- `NoteList` — lista de anotaciones diarias
- `NoteForm` — formulario de nueva nota

**Dominio documentos y actividad:**
- `DocumentList` — lista de documentos subidos
- `DocumentUploader` — componente de subida de archivos
- `ActivityFeed` — historial de acciones de todos los tutores

**Navegación:**
- `AppLayout` — layout principal con sidebar/header y outlet de rutas
- `Navbar` — barra de navegación superior
- `Sidebar` — navegación lateral (desktop)
- `BottomNav` — navegación inferior (mobile)

***

## Componentes que serán reutilizables

La regla es: un componente es reutilizable si puede funcionar con datos diferentes sin cambiar su código interno. La lista priorizada:

1. `Button`, `Input`, `Modal`, `Badge`, `Card`, `EmptyState`, `SkeletonLoader` — reutilizables en toda la app
2. `PetCard` — reutilizable en listados y dashboard
3. `OverviewCard` — reutilizable para vacunas, medicamentos y síntomas
4. `ActivityFeed` — reutilizable en detalle de mascota y dashboard
5. Todos los formularios (`VaccineForm`, `MedicationForm`, etc.) — reutilizables para crear y editar mediante prop `initialData`

***

## Gestión del estado

La aplicación usa tres niveles de estado, cada uno con una responsabilidad clara:

| Nivel | Herramienta | Qué gestiona |
|---|---|---|
| **Estado local** | `useState` | UI: modales abiertos, valores de formularios, pestañas activas |
| **Estado global** | Context API (`AuthContext`, `PetContext`) | Usuario autenticado, mascota seleccionada actualmente |
| **Estado del servidor** | Custom hooks (`usePets`, `useVaccines`, etc.) | Datos cargados desde la API, con loading, data y error |

### AuthContext
Guarda el usuario autenticado y expone `login`, `logout` y `useAuth`. El token de sesión se almacena en memoria (variable de módulo) durante la sesión activa para evitar exposición en LocalStorage en entornos no seguros.

### PetContext
Guarda la mascota actualmente seleccionada y la lista resumida de mascotas del usuario. Permite que el sidebar y el dashboard accedan a esta información sin prop drilling.

### Custom hooks
Cada recurso tiene su propio hook. Ejemplo: `usePets` encapsula `fetch`, `loading`, `error` y funciones de mutación (`createPet`, `updatePet`, `deletePet`). Esta separación permite reusar lógica entre páginas sin duplicar código.

***

## Diseño de la API REST

### Convenciones

- Base URL: `/api/v1`
- Formato: JSON
- Autenticación: Bearer token en header `Authorization`
- Respuestas de error: `{ error: string, message: string }`
- Respuestas de éxito: el recurso directamente o un array del recurso

### Recursos y endpoints

#### Auth

| Método | Endpoint | Descripción | Body | Respuesta |
|---|---|---|---|---|
| `POST` | `/auth/register` | Registrar usuario | `{ name, email, password }` | `{ user, token }` |
| `POST` | `/auth/login` | Iniciar sesión | `{ email, password }` | `{ user, token }` |
| `GET` | `/auth/me` | Usuario autenticado | — | `User` |

#### Pets

| Método | Endpoint | Descripción | Body | Respuesta |
|---|---|---|---|---|
| `GET` | `/pets` | Listar mascotas del tutor | — | `Pet[]` |
| `POST` | `/pets` | Crear mascota | `PetInput` | `Pet` |
| `GET` | `/pets/:petId` | Detalle de mascota | — | `Pet` |
| `PUT` | `/pets/:petId` | Actualizar mascota | `PetInput` | `Pet` |
| `DELETE` | `/pets/:petId` | Eliminar mascota | — | `{ success: true }` |

#### Caregivers

| Método | Endpoint | Descripción | Body | Respuesta |
|---|---|---|---|---|
| `GET` | `/pets/:petId/caregivers` | Listar tutores | — | `Caregiver[]` |
| `POST` | `/pets/:petId/caregivers/invite` | Invitar tutor | `{ email }` | `{ code }` |
| `POST` | `/pets/:petId/caregivers/join` | Aceptar invitación | `{ code }` | `Caregiver` |
| `DELETE` | `/pets/:petId/caregivers/:caregiverId` | Eliminar tutor | — | `{ success: true }` |

#### Vacunas

| Método | Endpoint | Descripción | Body | Respuesta |
|---|---|---|---|---|
| `GET` | `/pets/:petId/vaccines` | Listar vacunas | — | `Vaccine[]` |
| `POST` | `/pets/:petId/vaccines` | Registrar vacuna | `VaccineInput` | `Vaccine` |
| `PUT` | `/pets/:petId/vaccines/:vaccineId` | Actualizar vacuna | `VaccineInput` | `Vaccine` |
| `DELETE` | `/pets/:petId/vaccines/:vaccineId` | Eliminar vacuna | — | `{ success: true }` |

#### Medicamentos

| Método | Endpoint | Descripción | Body | Respuesta |
|---|---|---|---|---|
| `GET` | `/pets/:petId/medications` | Listar medicamentos | — | `Medication[]` |
| `POST` | `/pets/:petId/medications` | Registrar medicamento | `MedicationInput` | `Medication` |
| `PUT` | `/pets/:petId/medications/:medicationId` | Actualizar | `MedicationInput` | `Medication` |
| `DELETE` | `/pets/:petId/medications/:medicationId` | Eliminar | — | `{ success: true }` |

#### Síntomas

| Método | Endpoint | Descripción | Body | Respuesta |
|---|---|---|---|---|
| `GET` | `/pets/:petId/symptoms` | Listar síntomas | — | `Symptom[]` |
| `POST` | `/pets/:petId/symptoms` | Registrar síntoma | `SymptomInput` | `Symptom` |
| `DELETE` | `/pets/:petId/symptoms/:symptomId` | Eliminar síntoma | — | `{ success: true }` |

#### Alimentación

| Método | Endpoint | Descripción | Body | Respuesta |
|---|---|---|---|---|
| `GET` | `/pets/:petId/feedings` | Listar registros | — | `FeedingLog[]` |
| `POST` | `/pets/:petId/feedings` | Registrar alimentación | `FeedingInput` | `FeedingLog` |
| `DELETE` | `/pets/:petId/feedings/:feedingId` | Eliminar registro | — | `{ success: true }` |

#### Notas

| Método | Endpoint | Descripción | Body | Respuesta |
|---|---|---|---|---|
| `GET` | `/pets/:petId/notes` | Listar notas | — | `Note[]` |
| `POST` | `/pets/:petId/notes` | Crear nota | `{ content }` | `Note` |
| `DELETE` | `/pets/:petId/notes/:noteId` | Eliminar nota | — | `{ success: true }` |

#### Documentos

| Método | Endpoint | Descripción | Body | Respuesta |
|---|---|---|---|---|
| `GET` | `/pets/:petId/documents` | Listar documentos | — | `DocumentFile[]` |
| `POST` | `/pets/:petId/documents` | Subir documento | `multipart/form-data` | `DocumentFile` |
| `DELETE` | `/pets/:petId/documents/:documentId` | Eliminar documento | — | `{ success: true }` |

#### Actividad

| Método | Endpoint | Descripción | Respuesta |
|---|---|---|---|
| `GET` | `/pets/:petId/activity` | Historial de acciones | `ActivityLog[]` |

***

## Contratos de datos (TypeScript)

```typescript
interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

interface Pet {
  id: string
  name: string
  species: string
  breed?: string
  birthDate?: string
  photoUrl?: string
  ownerId: string
  createdAt: string
}

interface Caregiver {
  id: string
  petId: string
  userId: string
  name: string
  email: string
  role: 'owner' | 'caregiver'
  invitedBy: string
  joinedAt: string
}

interface Vaccine {
  id: string
  petId: string
  name: string
  date: string
  nextDoseDate?: string
  veterinarian?: string
  notes?: string
  createdBy: string
  createdAt: string
}

interface Medication {
  id: string
  petId: string
  name: string
  dose: string
  frequency: string
  startDate: string
  endDate?: string
  notes?: string
  createdBy: string
  createdAt: string
}

interface Symptom {
  id: string
  petId: string
  category: string
  severity: 'low' | 'medium' | 'high'
  description: string
  photoUrl?: string
  createdBy: string
  createdAt: string
}

interface FeedingLog {
  id: string
  petId: string
  foodType: string
  quantity: string
  appetiteLevel: 'none' | 'low' | 'normal' | 'high'
  notes?: string
  createdBy: string
  createdAt: string
}

interface Note {
  id: string
  petId: string
  content: string
  createdBy: string
  createdAt: string
}

interface DocumentFile {
  id: string
  petId: string
  name: string
  fileUrl: string
  fileType: string
  createdBy: string
  createdAt: string
}

interface ActivityLog {
  id: string
  petId: string
  userId: string
  userName: string
  action: string
  resource: string
  createdAt: string
}
```

***

## Persistencia de datos

| Dato | Dónde se persiste | Motivo |
|---|---|---|
| Usuarios | Servidor | Necesario para autenticación y compartir entre dispositivos |
| Mascotas | Servidor | Compartidas entre múltiples tutores |
| Vacunas, medicamentos, síntomas | Servidor | Historial médico compartido entre tutores |
| Alimentación, notas | Servidor | Registro colaborativo |
| Documentos (archivos) | Servidor (almacenamiento de archivos) | Acceso desde cualquier dispositivo |
| Historial de actividad | Servidor | Auditoría de acciones de tutores |
| Token de sesión | Memoria del cliente (variable de módulo) | Sesión activa, no persiste entre recargas intencionalmente |
| Mascota seleccionada | Memoria del cliente (PetContext) | Estado de UI temporal |
| Preferencias de tema (dark/light) | LocalStorage | Preferencia de UI del usuario |

***

## Flujo de datos

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND (React)                   │
│                                                      │
│  Page                                                │
│   └── custom hook (usePets, useVaccines...)          │
│         └── src/api/client.ts  (fetch tipado)        │
│               └── HTTP Request (Bearer token)        │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS /api/v1/...
┌──────────────────────▼──────────────────────────────┐
│                  BACKEND (Express)                   │
│                                                      │
│  routes/        → define los endpoints               │
│   └── controllers/ → recibe req, llama al service   │
│         └── services/  → lógica de negocio           │
│               └── [Data Store]                       │
└─────────────────────────────────────────────────────┘
```

**Flujo de una solicitud típica:**

1. El usuario abre la página de detalle de una mascota
2. `PetDetailPage` llama al hook `usePet(petId)`
3. El hook llama a `api/pets.ts` → `getPet(petId)`
4. `client.ts` hace `GET /api/v1/pets/:petId` con el token en el header
5. Express recibe la petición en `routes/pets.ts`
6. El router llama a `controllers/petsController.ts`
7. El controller llama a `services/petsService.ts`
8. El service consulta los datos y devuelve el objeto `Pet`
9. El controller responde con JSON `{ ...pet }`
10. El hook actualiza su estado `data` y el componente re-renderiza

***

## Decisiones de arquitectura

### Por qué arquitectura por capas en el backend
La separación en `routes → controllers → services` permite cambiar la fuente de datos (en memoria, base de datos SQL, MongoDB) sin tocar la lógica de negocio ni las rutas. Los controllers solo orquestan; los services contienen las reglas.

### Por qué Context API en lugar de Redux
La aplicación tiene dos estados globales simples: usuario autenticado y mascota seleccionada. Redux añadiría boilerplate innecesario para este nivel de complejidad. Context API con hooks customizados es suficiente y más fácil de mantener.

### Por qué custom hooks para el estado del servidor
Encapsular `fetch + loading + error` en hooks reutilizables (`usePets`, `useVaccines`) permite que varias páginas compartan la misma lógica de carga sin duplicación. Si en el futuro se migra a React Query o SWR, el cambio se hace solo dentro del hook.

### Por qué el token en memoria y no en LocalStorage
LocalStorage es vulnerable a ataques XSS. Guardar el token en una variable de módulo (memoria JS) reduce la superficie de ataque. La contrapartida es que el usuario pierde la sesión al recargar la página, lo que se puede resolver en el futuro con cookies HttpOnly.

### Por qué no base de datos en la primera fase
El ejercicio permite LocalStorage o API externa como fuente de datos. El backend se diseña con contratos claros para que, cuando se añada una base de datos real, solo cambie la capa `services/` sin impactar rutas ni frontend.
````

## File: src/App.tsx
````typescript
// App.tsx — punto de entrada de la aplicación
// Este fichero se expandirá en la Actividad 9 (React Router)
// Por ahora muestra PetListPage directamente para poder probar los pasos 7 y 8.

import PetListPage from './pages/PetListPage'

export default function App() {
  return <PetListPage />
}



// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <section id="center">
//         <div className="hero">
//           <img src={heroImg} className="base" width="170" height="179" alt="" />
//           <img src={reactLogo} className="framework" alt="React logo" />
//           <img src={viteLogo} className="vite" alt="Vite logo" />
//         </div>
//         <div>
//           <h1>Get started</h1>
//           <p>
//             Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
//           </p>
//         </div>
//         <button
//           className="counter"
//           onClick={() => setCount((count) => count + 1)}
//         >
//           Count is {count}
//         </button>
//       </section>

//       <div className="ticks"></div>

//       <section id="next-steps">
//         <div id="docs">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#documentation-icon"></use>
//           </svg>
//           <h2>Documentation</h2>
//           <p>Your questions, answered</p>
//           <ul>
//             <li>
//               <a href="https://vite.dev/" target="_blank">
//                 <img className="logo" src={viteLogo} alt="" />
//                 Explore Vite
//               </a>
//             </li>
//             <li>
//               <a href="https://react.dev/" target="_blank">
//                 <img className="button-icon" src={reactLogo} alt="" />
//                 Learn more
//               </a>
//             </li>
//           </ul>
//         </div>
//         <div id="social">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#social-icon"></use>
//           </svg>
//           <h2>Connect with us</h2>
//           <p>Join the Vite community</p>
//           <ul>
//             <li>
//               <a href="https://github.com/vitejs/vite" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#github-icon"></use>
//                 </svg>
//                 GitHub
//               </a>
//             </li>
//             <li>
//               <a href="https://chat.vite.dev/" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#discord-icon"></use>
//                 </svg>
//                 Discord
//               </a>
//             </li>
//             <li>
//               <a href="https://x.com/vite_js" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#x-icon"></use>
//                 </svg>
//                 X.com
//               </a>
//             </li>
//             <li>
//               <a href="https://bsky.app/profile/vite.dev" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#bluesky-icon"></use>
//                 </svg>
//                 Bluesky
//               </a>
//             </li>
//           </ul>
//         </div>
//       </section>

//       <div className="ticks"></div>
//       <section id="spacer"></section>
//     </>
//   )
// }

// export default App
````

## File: src/main.tsx
````typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

const root = document.getElementById('root')!
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
)
````

## File: vite.config.ts
````typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
````

## File: package.json
````json
{
  "name": "pituti-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-router-dom": "^7.14.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.4",
    "@tailwindcss/vite": "^4.2.2",
    "@types/node": "^24.12.0",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "autoprefixer": "^10.4.27",
    "eslint": "^9.39.4",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.4.0",
    "postcss": "^8.5.9",
    "tailwindcss": "^4.2.2",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.57.0",
    "vite": "^8.0.1"
  }
}
````

## File: src/index.css
````css
@import "tailwindcss";

/* Tipografia base */
@layer base {
  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
  }

  body {
    @apply bg-stone-50 text-stone-900;
    font-family: 'Inter', system-ui, sans-serif;
    min-height: 100dvh;
  }

  h1, h2, h3, h4, h5, h6 {
    text-wrap: balance;
    line-height: 1.15;
  }

  p, li {
    text-wrap: pretty;
  }

  *:focus-visible {
    @apply outline-none ring-2 ring-teal-600 ring-offset-2;
  }
}

/* Animação skeleton */
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}

.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    var(--color-stone-200) 25%,
    var(--color-stone-100) 50%,
    var(--color-stone-200) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;

  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}
````
