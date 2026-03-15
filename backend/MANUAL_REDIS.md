## 📕 Manual de Redis para Desarrolladores Rust

Redis es una base de datos **en memoria** (RAM). A diferencia de PostgreSQL, que es persistente y relacional, Redis está diseñado para la **velocidad extrema**..

### 1. Conceptos Fundamentales

* **Key-Value Store:** Redis guarda datos como un diccionario. A una **Llave** única le corresponde un **Valor**.
* **TTL (Time To Live):** Es el tiempo de vida de un dato. Cuando el contador llega a cero, Redis elimina el dato automáticamente.
* **In-Memory:** Los datos viven en la RAM. Si el servidor de Redis se reinicia sin persistencia configurada, los datos desaparecen (por eso solo lo usamos para caché y no como base de datos principal).

---

### 2. Comandos Esenciales (CLI)

Para ejecutar estos comandos, abre tu terminal y escribe `redis-cli`. Si estás en Railway, usa la pestaña **CLI** en tu servicio de Redis.

#### A. Exploración

| Comando | Descripción | Ejemplo |
| --- | --- | --- |
| `KEYS *` | Lista todas las llaves activas. | `KEYS "projects:*"` |
| `EXISTS [key]` | Verifica si una llave existe (1 = sí, 0 = no). | `EXISTS projects:user:1` |
| `TTL [key]` | Consulta cuánto tiempo le queda a la llave. | `TTL projects:user:1` |
| `TYPE [key]` | Te dice qué tipo de dato es (string, list, hash). | `TYPE projects:user:1` |

#### B. Gestión de Datos

| Comando | Descripción | Ejemplo |
| --- | --- | --- |
| `GET [key]` | Obtiene el valor (el JSON) de la llave. | `GET projects:user:1:page:1` |
| `SET [key] [val]` | Guarda un valor sin tiempo de expiración. | `SET nombre "Orlando"` |
| `SETEX [key] [s] [val]` | Guarda un valor con TTL en segundos. | `SETEX temp 60 "dato"` |
| `DEL [key]` | Borra una llave manualmente. | `DEL projects:user:1` |
| `FLUSHALL` | **¡Peligro!** Borra absolutamente todo. | `FLUSHALL` |

#### C. Monitoreo en Tiempo Real

Si quieres ver qué está haciendo tu código de Rust en vivo, ejecuta:

```bash
MONITOR

```

*Cada vez que refresques tu página de proyectos, verás los comandos `GET` y `SET` pasar por la pantalla.*

---

### 3. El Ciclo de Vida en tu App (Workflow)

Tu implementación sigue el patrón **Cache-Aside**. Así es como se mueven los datos:

1. **Construcción de Key:** Creas un identificador único basado en variables: `projects:user:{user_id}:page:{page}`.
2. **Consulta:** `GET key`. Si Redis responde, saltas directamente al final.
3. **Fallback:** Si Redis no tiene el dato, haces `SELECT` en PostgreSQL.
4. **Hidratación:** Guardas el resultado en Redis con `SETEX` para que la próxima vez sea rápido.
5. **Invalidación:** Cuando haces un `UPDATE` o `DELETE` de un proyecto, usas `DEL` o `KEYS + DEL` para borrar el caché viejo y evitar que el usuario vea datos desactualizados.

---

### 4. Tips para Producción 

* **Evita `KEYS *` en producción:** Si tienes miles de usuarios, este comando puede bloquear Redis por unos milisegundos. Es mejor usar `SCAN` si necesitas listar llaves en apps muy grandes.
* **El tamaño de la llave importa:** Intenta que tus llaves sean descriptivas pero no excesivamente largas para ahorrar unos bytes de RAM.
* **Serialización:** Recuerda que Redis no entiende tus "Structs" de Rust. Siempre debes convertir a JSON (como ya haces con `serde_json`) antes de guardar.

---

### 5. Resumen de Estados del TTL

Cuando consultes el TTL de una llave (`TTL llave`), recibirás estos códigos:

* **Número positivo:** Segundos restantes.
* **-1:** La llave existe pero no tiene tiempo de expiración (es eterna).
* **-2:** La llave no existe (ya expiró o nunca se creó).

