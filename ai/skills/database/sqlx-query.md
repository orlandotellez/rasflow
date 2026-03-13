# Skill: Crear Query SQLx

Esta skill proporciona las mejores prácticas para escribir queries con SQLx en el proyecto.

## Reglas Fundamentales

1. **SIEMPRE** usar macros `query_as!` o `query_as_!` para queries tipadas
2. **NUNCA** usar strings concatenados (SQL injection)
3. **SIEMPRE** usar parámetros (`$1`, `$2`, etc.)
4. **USAR** tipos de Rust correspondientes a tipos de PostgreSQL

## Tipos de Mapeo

| PostgreSQL | Rust (sqlx) |
|-----------|-------------|
| UUID | uuid::Uuid |
| TIMESTAMP | chrono::DateTime<Utc> |
| VARCHAR | String |
| INTEGER | i32/i64 |
| BOOLEAN | bool |
| JSONB | serde_json::Value |
| TEXT | String |

## Patrones de Query

### SELECT simple

```rust
let users = sqlx::query_as!(
    User,
    "SELECT id, email, created_at as \"created_at!\" FROM users WHERE id = $1",
    user_id
)
.fetch_one(db)
.await?;
```

### SELECT con opcional

```rust
let user = sqlx::query_as!(
    User,
    "SELECT id, email, password_hash, created_at as \"created_at!\" 
     FROM users WHERE email = $1",
    email
)
.fetch_optional(db)
.await?
.ok_or(AppError::NotFound("User not found".to_string()))?;
```

### INSERT con RETURNING

```rust
let task = sqlx::query_as!(
    Task,
    r#"
        INSERT INTO tasks (title, description, priority, project_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id, title, description, priority, project_id, 
                  created_at as "created_at!", updated_at as "updated_at!"
    "#,
    payload.title,
    payload.description,
    payload.priority,
    payload.project_id
)
.fetch_one(db)
.await?;
```

### UPDATE

```rust
let task = sqlx::query_as!(
    Task,
    r#"
        UPDATE tasks 
        SET title = $1, description = $2, updated_at = NOW()
        WHERE id = $3
        RETURNING id, title, description, updated_at as "updated_at!"
    "#,
    new_title,
    new_description,
    task_id
)
.fetch_one(db)
.await?;
```

### DELETE

```rust
sqlx::query!(
    "DELETE FROM tasks WHERE id = $1",
    task_id
)
.execute(db)
.await?;
```

### JOIN con relaciones

```rust
let tasks_with_project = sqlx::query_as!(
    TaskWithProject,
    r#"
        SELECT 
            t.id as task_id,
            t.title,
            t.description,
            p.id as project_id,
            p.name as project_name
        FROM tasks t
        INNER JOIN projects p ON t.project_id = p.id
        WHERE t.user_id = $1
        ORDER BY t.created_at DESC
    "#,
    user_id
)
.fetch_all(db)
.await?;
```

### Paginación

```rust
let offset = (page - 1) * limit;

let (tasks, total) = try_join!(
    sqlx::query_as!(
        Task,
        "SELECT id, title, description, created_at as \"created_at!\" 
         FROM tasks WHERE user_id = $1 
         ORDER BY created_at DESC 
         LIMIT $2 OFFSET $3",
        user_id, limit, offset
    )
    .fetch_all(db),
    sqlx::query_scalar!(
        "SELECT COUNT(*) FROM tasks WHERE user_id = $1",
        user_id
    )
    .fetch_one(db)
)?;
```

## Alias con "column_name!"

En SQLx, cuando hacés SELECT de columnas, necesitás un alias de Rust para el mapping:

```rust
sqlx::query,
    "SELECT_as!(
    User 
        id, 
        email, 
        created_at as \"created_at!\" 
     FROM users",
)
// El "!" indica que el campo NO es Option<T>
```

Para campos opcionales:
```rust
sqlx::query_as!(
    Task,
    "SELECT id, title, description FROM tasks WHERE id = $1",
    task_id
)
// description puede ser Option<String> si la columna es nullable
```

## Errores Comunes

### ❌ Mal: Concatenación de strings
```rust
let query = format!("SELECT * FROM users WHERE email = '{}'", email);
sqlx::query(&query) // PELIGRO: SQL Injection!
```

### ✅ Bien: Parámetros
```rust
sqlx::query!(
    "SELECT * FROM users WHERE email = $1",
    email
)
```

### ❌ Mal: Olidar el alias
```rust
sqlx::query_as!(
    User,
    "SELECT id, email, created_at FROM users" // Error de compilación
)
```

### ✅ Bien: Con alias
```rust
sqlx::query_as!(
    User,
    "SELECT id, email, created_at as \"created_at!\" FROM users"
)
```

## Transacciones

Para operaciones que requieren múltiples queries:

```rust
let mut tx = db.begin().await?;

sqlx::query!("INSERT INTO ...", ...)
    .execute(&mut *tx)
    .await?;

sqlx::query!("UPDATE ...", ...)
    .execute(&mut *tx)
    .await?;

tx.commit().await?;
```

## Checklist para Queries

- [ ] Usar `query_as!` o `query!`
- [ ] Usar parámetros (`$1`, `$2`) en vez de concatenación
- [ ] Usar alias `"name!"` para el mapping de columnas
- [ ] Manejar `fetch_optional()` con `.ok_or()` para resultados opcionales
- [ ] Usar transacciones para múltiples operaciones
- [ ] Manejar errores con `AppError`
