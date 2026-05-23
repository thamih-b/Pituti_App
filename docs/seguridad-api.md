# Seguridad de la API

## DDL y DML

En bases de datos, **DDL** es el lenguaje que define la estructura de los datos. Se usa para crear, modificar o eliminar tablas y otros objetos con sentencias como `CREATE`, `ALTER` y `DROP`.

**DML** es el lenguaje que manipula los datos ya almacenados. Se usa para consultar o cambiar registros con sentencias como `SELECT`, `INSERT`, `UPDATE` y `DELETE`.

En esta API, las rutas de negocio deberían usar DML para trabajar con datos y reservar DDL solo para migraciones o tareas de administración.

## SQL injection

La inyección SQL ocurre cuando una entrada del usuario se concatena directamente dentro de una consulta. En ese caso, el valor recibido puede cambiar la estructura del SQL y ejecutar acciones no previstas.

Ejemplo vulnerable:

```ts
const title = req.body.title;
const query = "SELECT * FROM notes WHERE title = '" + title + "'";
```

Si alguien envía un valor como `"'; DROP TABLE notes;--"`, la consulta deja de buscar por título y pasa a ejecutar código SQL no deseado.

## Consultas parametrizadas

Las consultas parametrizadas evitan ese problema porque la estructura del SQL y los valores viajan por separado. La base de datos interpreta los parámetros solo como datos, no como código.

Ejemplo seguro:

```ts
const query = "SELECT * FROM notes WHERE title = $1";
await db.query(query, [req.body.title]);
```

En este formato, aunque el usuario envíe texto malicioso, la base de datos lo tratará como un valor literal del campo `title`.

## Variables de entorno

Las variables de entorno son valores de configuración que se leen desde el entorno de ejecución y no se escriben dentro del código fuente. Se usan para guardar datos sensibles como la conexión a la base de datos, secretos de JWT o claves de servicios externos.

La connection string nunca debe aparecer hardcodeada en el código porque eso expone credenciales y facilita accesos no autorizados. Lo correcto es leerla desde una variable de entorno, por ejemplo `process.env.DATABASE_URL`.

Ejemplo:

```ts
const connectionString = process.env.DATABASE_URL;
```

Esto permite cambiar la configuración entre desarrollo, pruebas y producción sin modificar el código ni comprometer secretos en el repositorio.