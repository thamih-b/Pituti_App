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