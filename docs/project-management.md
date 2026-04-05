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