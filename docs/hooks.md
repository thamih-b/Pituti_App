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
