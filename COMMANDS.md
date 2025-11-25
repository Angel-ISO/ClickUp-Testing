# Comandos de Testing

Este documento explica cómo usar el sistema de tags para ejecutar tests de manera selectiva.

##  Tabla de Contenidos

- [¿Qué son los Tags?](#qué-son-los-tags)
- [Categorías de Tests](#categorías-de-tests)
- [Tags de Ejecución](#tags-de-ejecución)
- [Comandos Disponibles](#comandos-disponibles)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Cómo Agregar Tags a tus Tests](#cómo-agregar-tags-a-tus-tests)

## ¿Qué son los Tags?

Los **tags** son etiquetas que se agregan a los tests para poder filtrarlos y ejecutar solo grupos específicos. Esto es útil para:

-  Ejecutar solo tests críticos (smoke tests) antes de hacer deploy
-  Ejecutar solo tests de una funcionalidad específica mientras desarrollas
-  Ejecutar solo tests negativos para validar manejo de errores
-  Ahorrar tiempo ejecutando subconjuntos relevantes de tests

## Categorías de Tests

Cada test case tiene una categoría que indica su tipo:

| Categoría | Código | Descripción | Ejemplo |
|-----------|--------|-------------|---------|
| **Functional Positive** | `FP` | Tests de camino feliz con inputs válidos | TC-FP-001 |
| **Functional Negative** | `FN` | Tests con inputs inválidos y errores | TC-FN-002 |
| **Performance** | `P` | Tests de rendimiento y tiempos de respuesta | TC-P-001 |
| **Security** | `S` | Tests de seguridad y autenticación | TC-S-003 |
| **Fuzz** | `FF` | Tests con inputs aleatorios o inesperados | TC-FF-004 |
| **Reliability** | `FR` | Tests de consistencia y estabilidad | TC-FR-005 |

## Tags de Ejecución

Los tags de ejecución se agregan a los tests para filtrarlos:

### `@smoke`
Tests **críticos** que deben pasar siempre. Cada funcionalidad debe tener al menos un smoke test.

**Cuándo usar:**
- Test principal de crear un recurso
- Test de login/autenticación
- Tests que validan funcionalidad core

### `@funcionalidad:nombre`
Agrupa tests por módulo o feature.

**Funcionalidades disponibles:**
- `@funcionalidad:folders` - Tests de carpetas
- `@funcionalidad:tasks` - Tests de tareas
- `@funcionalidad:lists` - Tests de listas
- `@funcionalidad:tags` - Tests de etiquetas
- `@funcionalidad:comments` - Tests de comentarios

### `@negativos`
Todos los tests de casos negativos (errores, validaciones).

**Cuándo usar:**
- Tests que esperan códigos de error (400, 401, 403, 404, etc.)
- Tests de validación de campos requeridos
- Tests de permisos insuficientes

## Comandos Disponibles

### Smoke Tests

Ejecutar **todos** los smoke tests:
```bash
npm run test:smoke
```

Ejecutar smoke tests de una funcionalidad específica:
```bash
npm run test:smoke:folders      # Solo smoke de folders
npm run test:smoke:tasks         # Solo smoke de tasks
npm run test:smoke:lists         # Solo smoke de lists
npm run test:smoke:tags          # Solo smoke de tags
npm run test:smoke:comments      # Solo smoke de comments
```

###  Tests Negativos

Ejecutar **todos** los tests negativos:
```bash
npm run test:negativos
```

Ejecutar tests negativos de una funcionalidad específica:
```bash
npm run test:negativos:folders   # Solo negativos de folders
npm run test:negativos:tasks     # Solo negativos de tasks
npm run test:negativos:lists     # Solo negativos de lists
npm run test:negativos:tags      # Solo negativos de tags
npm run test:negativos:comments  # Solo negativos de comments
```

###  Tests por Funcionalidad

Ejecutar **todos** los tests de una funcionalidad:
```bash
npm run test:funcionalidad:folders    # Todos los tests de folders
npm run test:funcionalidad:tasks      # Todos los tests de tasks
npm run test:funcionalidad:lists      # Todos los tests de lists
npm run test:funcionalidad:tags       # Todos los tests de tags
npm run test:funcionalidad:comments   # Todos los tests de comments
```

###  Otros Comandos de Testing

```bash
npm test                  # Ejecutar todos los tests
npm run test:watch        # Ejecutar tests en modo watch
npm run test:coverage     # Ejecutar tests con reporte de cobertura
```

## Ejemplos de Uso

### Ejemplo 1: Desarrollo de Feature
Estás trabajando en la funcionalidad de folders y quieres ejecutar solo esos tests:

```bash
npm run test:funcionalidad:folders
```

### Ejemplo 2: Pre-Deploy Check
Antes de hacer deploy, ejecutas los smoke tests para asegurar que lo crítico funciona:

```bash
npm run test:smoke
```

### Ejemplo 3: Validar Manejo de Errores
Quieres verificar que todos los casos negativos de tasks funcionan correctamente:

```bash
npm run test:negativos:tasks
```

### Ejemplo 4: Quick Check de una Feature
Solo quieres ejecutar los tests críticos de comments:

```bash
npm run test:smoke:comments
```

## Cómo Agregar Tags a tus Tests

### Paso 1: Importar los Helpers

```javascript
import { taggedDescribe, buildTags, FUNCIONALIDADES } from '../../bussines/utils/tags.js';
```

### Paso 2: Usar `taggedDescribe` en lugar de `describe`

**Test Positivo con Smoke:**
```javascript
taggedDescribe(
  buildTags({ smoke: true, funcionalidad: FUNCIONALIDADES.FOLDERS }),
  'TC-FP-001 - Verify that user can create a folder',
  () => {
    it('should create folder successfully', async () => {
      // test implementation
    });
  }
);
```

**Test Negativo:**
```javascript
taggedDescribe(
  buildTags({ funcionalidad: FUNCIONALIDADES.FOLDERS, negative: true }),
  'TC-FN-002 - Verify error when folder name is missing',
  () => {
    it('should return 400 error', async () => {
      // test implementation
    });
  }
);
```

**Test de Seguridad Smoke:**
```javascript
taggedDescribe(
  buildTags({ smoke: true, funcionalidad: FUNCIONALIDADES.FOLDERS }),
  'TC-S-003 - Verify unauthorized access is rejected',
  () => {
    it('should reject invalid token', async () => {
      // test implementation
    });
  }
);
```

### Paso 3: Ejecutar tus Tests Filtrados

```bash
# Ejecutar solo el smoke test que acabas de crear
npm run test:smoke:folders

# Ejecutar todos los tests de folders
npm run test:funcionalidad:folders

# Ejecutar solo los negativos
npm run test:negativos:folders
```

## Reglas de Etiquetado

1. **Cada funcionalidad debe tener al menos un test `@smoke`**
2. **Todos los tests `FN` deben tener el tag `@negativos`**
3. **Todos los tests deben tener un tag `@funcionalidad:nombre`**
4. **Los tests críticos (happy path principal) deben ser `@smoke`**

## Tips

- **En CI/CD**: Puedes ejecutar solo `npm run test:smoke` en pull requests para feedback rápido
- **Durante desarrollo**: Usa `npm run test:funcionalidad:X` para enfocarte en lo que estás desarrollando
- **Antes de release**: Ejecuta `npm test` para correr todos los tests
- **Debugging**: Usa `npm run test:watch` junto con los filtros para desarrollo iterativo

## Más Información

Para más detalles sobre la implementación, consulta:
- `bussines/utils/tags.js` - Definición de tags y helpers
- `TC-FP-001.test.js` - Ejemplo de test con tags implementados
