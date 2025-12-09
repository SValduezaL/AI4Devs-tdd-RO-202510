# Resumen de Prompts y Resultados - Suite de Tests para Registro de Candidatos

Este documento resume todos los prompts utilizados en esta sesión de desarrollo, junto con los resultados y actividades realizadas.

---

## Prompt Auxiliar 1: Generación de Especificaciones TDD

**Modelo LLM:** ChatGPT 5.1

### Prompt Original

```
Estoy desarrollando un software en Javascript + Typescript + Prisma como OCR + Express en el backend, y React + Typescript en el Frontend. Quiero desarrollar tests de pruebas unitarios del código desarrollado hasta ahora. Como experto en desarrollo de Pruebas Unitarias con más de 20 años en el sector, y en la redacción de especificaciones para agentes de IA, redacta unas especificaciones que cumplan las mejores prácticas en desarrollo TDD, primero genéricas pero luego especificando el uso de JEST (ver https://jestjs.io/docs/getting-started) y mockeando el Cliente Prisma de la Base de Datos (ver https://www.prisma.io/blog/testing-series-1-8eRB5p0Y8o#mock-prisma-client). Redacta estas especificaciones en formato markdown en un fichero llamado [TDD_especs.md] y siguiendo también las recomendaciones indicadas para testing en los dos ficheros adjuntos [backend-standards.mdc] y [frontend-standards.mdc]
```

### Resultado Obtenido

**Archivo generado:** `Specs/TDD_specs_md`

**Contenido:**

-   Documento completo de especificaciones TDD con 573 líneas

-   Estructura del documento:

    -   **1. Objetivo del documento:** Definición del alcance y tecnologías (Jest, Prisma, React)

    -   **2. Principios generales de TDD:**

        -   Ciclo TDD (Red-Green-Refactor)
        -   Tipos de tests y pirámide de testing (Unit, Integration, E2E)
        -   Qué testear / qué no testear
        -   Reglas generales de calidad de tests

    -   **3. Estándares globales de testing del proyecto:**

        -   Cobertura mínima: 90% en branches, functions, lines y statements
        -   Localización y nombres de archivos de test
        -   Organización del código de test (test-utils/, builders/, mocks/)

    -   **4. Especificaciones TDD + Jest en el Backend:**

        -   Configuración de Jest con TypeScript (ts-jest)
        -   Unidades a testear (dominio, servicios, repositorios, controladores)
        -   Mocking del Prisma Client con jest-mock-extended
        -   Tests de integración con Prisma (sin mock)
        -   Especificaciones para controladores Express

    -   **5. Especificaciones TDD + Jest en el Frontend:**

        -   Configuración Jest + React Testing Library
        -   Qué se testea en frontend (funciones puras, componentes, hooks)
        -   Ejemplos de tests con RTL

    -   **6. Reglas de TDD aplicadas al flujo de trabajo:**

        -   Para nuevas features
        -   Para corrección de bugs

    -   **7. Checklist rápida para desarrolladores**

**Características clave:**

-   Guía completa para mockear Prisma Client usando `jest-mock-extended`
-   Ejemplos de código para cada tipo de test
-   Configuración de Jest para backend y frontend
-   Estándares de cobertura y organización
-   Patrones AAA (Arrange-Act-Assert)
-   Convenciones de naming y estructura

**Total:** 1 documento de especificaciones completo de 573 líneas que sirve como guía maestra para todo el testing del proyecto

---

## Prompt Auxiliar 2: Generación de Metaprompt para Suite de Tests

**Modelo LLM:** ChatGPT 5.1

### Prompt Original

```
Como experto en prompt engineering redacta un prompt para que la IA de cursor genere una suite de tests unitarios en Jest, siguiendo las especificaciones marcadas en un archivo en concreto
```

### Resultado Obtenido

**Resultado:** Prompt optimizado que fue utilizado como base para el Prompt 2 principal

**Características del metaprompt generado:**

-   Estructura clara con contexto del proyecto
-   Instrucciones obligatorias detalladas
-   Referencias a especificaciones TDD
-   Definición de objetivos específicos
-   Formato de salida esperado
-   Consideraciones sobre mockeo de Prisma
-   Enfoque en calidad del código de test

**Uso:** Este metaprompt fue refinado y expandido para crear el Prompt 2 completo que se utilizó para generar la suite de tests unitarios, incorporando:

-   Referencias específicas a `@Specs/TDD_specs_md`
-   Referencias a la User Story en `@user_stories.md`
-   Instrucciones detalladas sobre mockeo de Prisma
-   Planificación de pasos de implementación
-   Consideraciones sobre servidores en ejecución

**Nota:** El metaprompt original fue adaptado y enriquecido con el contexto específico del proyecto antes de ser utilizado, resultando en el Prompt 2 documentado más abajo.

---

## Prompt 1: Generación de User Story para Registro de Candidatos

**Modelo LLM:** Claude Sonnet 4.5 / Auto

### Prompt Original

```
Tengo que hacer una suite de tests unitarios en Jest para la funcionalidad de insertar candidatos en base de datos. Hay 2 familias principales de tests, recepción de los datos del formulario, y guardado en la base de datos.

Lo primero que vamos a hacer es definir la User Story relacionada con estas dos familias de tests. Como experto Product Owner con más de 20 años de experiencia liderando equipos de desarrollo de Producto, genera la User Story donde el candidato (o el recruiter) pueda insertar los datos en el formulario y guardarlos en la base de datos, acorde al código ya desarrollado en este proyecto.

Utiliza tu experiencia y las especificaciones definidas en @Specs/user_stories_specs.md, y descríbela en el formato utilizado en los ejemplos de dicho documento.

Guarda la User Story en un documento llamado "user_stories.md" en el directorio raíz
```

### Resultado Obtenido

**Archivo generado:** `user_stories.md`

**Contenido:**

-   1 User Story completa para el registro de candidatos en el sistema ATS

-   La User Story incluye:

    -   Formato estándar: "Como candidato o reclutador, quiero poder registrar los datos personales, educativos, profesionales y el currículum de un candidato en el sistema, para que la información quede almacenada de forma estructurada y disponible para procesos de selección posteriores."

    -   Descripción detallada del contexto y propósito

    -   Criterios de aceptación organizados en dos secciones principales:

        -   **Recepción de datos del formulario:** 7 criterios de aceptación
        -   **Guardado en base de datos:** 7 criterios de aceptación

    -   Notas adicionales con reglas de negocio, campos obligatorios/opcionales y consideraciones técnicas

    -   Tareas técnicas sugeridas (9 tareas)

**Estructura de Criterios de Aceptación:**

-   **Recepción de datos del formulario:**

    -   Validación de campos obligatorios (nombre, apellido, email)
    -   Validación de formato de email
    -   Validación de nombres (longitud, caracteres permitidos)
    -   Validación de teléfono (formato español)
    -   Validación de educación (institución, título, fechas)
    -   Validación de experiencia laboral (empresa, puesto, fechas)
    -   Validación de CV (filePath, fileType)

-   **Guardado en base de datos:**
    -   Creación de registro en tabla Candidate
    -   Creación de registros relacionados (Education, WorkExperience, Resume)
    -   Manejo de email duplicado
    -   Respuestas HTTP apropiadas (201, 400)
    -   Manejo de errores de validación

**Total:** 1 User Story completa con 14 criterios de aceptación detallados

---

## Prompt 2: Generación de Suite Completa de Tests Unitarios con Jest y TDD

**Modelo LLM:** Claude Sonnet 4.5 / Auto

### Prompt Original

```
Como IA experta en desarrollo backend y frontend con Typescript, Jest y TDD. Llevas más de 10 años escribiendo y manteniendo suites de tests unitarios robustas, legibles y fácilmente mantenibles. Además sigues estrictamente unas especificaciones de testing definidas en @Specs/TDD_specs_md

Contexto del proyecto:

- Tech stack:
  - Backend: Node.js + Typescript + Express.
  - ORM/BBDD: Prisma Client.
  - Frontend: React + Typescript.
  - Framework de tests: Jest.

Objetivo:

1. Diseñar y generar una SUITE COMPLETA de tests unitarios en Jest, siguiendo al 100% las especificaciones indicadas para la User Story definida en @user_stories.md

3. Respetar la filosofía TDD: diseñar los casos de prueba en función del comportamiento público esperado, no de detalles internos de implementación.

Instrucciones obligatorias:

1. Lee y resume brevemente (para ti) las reglas clave de:
   - Estructura de los describe/it.
   - Convenciones de nombre de tests.
   - Manejo de mocks, especialmente mock del Prisma Client.
   - Reglas de organización de archivos de test (ubicación, patrón de nombre *.spec.ts o *.test.ts, etc.).
   - Criterios de cobertura mínima, tipos de casos límite y casos de error a cubrir.

2. Para la funcionalidad a testear:
   - Identifica todas las funciones/métodos públicos que deban ser testeados.
   - Para cada función:
     - Define los escenarios de éxito (happy path).
     - Define los escenarios de error y edge cases (valores nulos, parámetros inválidos, errores de BBDD/Prisma, etc.).

3. Mock de Prisma:
   - NO debes acceder a una base de datos real.
   - Debes mockear el Prisma Client según se describe en {{RUTA_DEL_ARCHIVO_DE_ESPECIFICACIONES}}.
   - Asegúrate de mockear sólo lo necesario (create, findUnique, update, etc.) y devolver datos de ejemplo coherentes con los tipos del esquema Prisma.

4. Formato del resultado:
   - Genera el contenido COMPLETO del archivo de tests en ./backend/src/tests/test-iniciales.tests.ts
   - Usa imports relativos correctos según la estructura del proyecto.
   - Incluye todos los imports de Jest, Prisma mocked client y cualquier helper/builder de datos indicado en las especificaciones.

5. Calidad del código de test:
   - Los tests deben ser:
     - Claros y autoexplicativos.
     - Aislados entre sí (reset de mocks entre tests cuando proceda).
     - Deterministas (no depender de tiempo real, red u otros factores externos).
   - Evita sobre-mockear: céntrate en el comportamiento observable.

6. Explicación breve al final:
   - Al final de la respuesta, añade un breve listado de:
     - Qué casos de uso cubre la suite.
     - Qué escenarios quedarían pendientes en caso de que falte información en el código o las especificaciones.

Salida esperada:

- Devuelve ÚNICAMENTE:
  1) El archivo de test completo dentro de un bloque de código con lenguaje `ts`.
  2) Después, una breve explicación en texto plano de la cobertura y decisiones de diseño de los tests.

Planifica los pasos para generar la suite de tests unitarios en Jest solicitada, y a continuación instala las librerías necesarias, modifica o crea los archivos necesarios para mockear la base de datos y genera los tests de acuerdo al plan generado. Para cada test, pregunta primero si lo quiero antes de generarlo.

Ten en cuenta que actualmente tengo los servidores backend y frontend arrancados, así como el docker con el cliente Prisma. Incluye en la planificación el cierre de estos servidores de ser necesario.
```

### Resultado Obtenido

**Archivos generados:**

1. **Configuración y utilidades:**

    - `backend/jest.config.js` - Configuración de Jest con cobertura mínima del 90%
    - `backend/test-utils/setupTests.ts` - Setup para limpieza de mocks entre tests
    - `backend/test-utils/prismaMock.ts` - Utilidades para mockear Prisma (placeholder)

2. **Builders/Factory Pattern:**

    - `backend/test-utils/builders/candidateBuilder.ts` - Factory para crear datos de test de candidatos
    - `backend/test-utils/builders/educationBuilder.ts` - Factory para crear datos de educación
    - `backend/test-utils/builders/workExperienceBuilder.ts` - Factory para crear datos de experiencia laboral
    - `backend/test-utils/builders/resumeBuilder.ts` - Factory para crear datos de CV

3. **Tests unitarios:**
    - `backend/src/tests/candidateService.test.ts` - Suite completa de tests del servicio y validación (45 tests)
    - `backend/src/tests/candidateController.test.ts` - Suite de tests del controlador

**Cobertura de tests implementada:**

-   **Validación de datos del formulario (validateCandidateData):**

    -   30+ tests cubriendo todos los casos de validación
    -   Validación de campos obligatorios (firstName, lastName, email)
    -   Validación de nombres (longitud mínima/máxima, caracteres permitidos)
    -   Validación de email (formato correcto)
    -   Validación de teléfono (formato español: 6, 7, 9, longitud)
    -   Validación de dirección (longitud máxima)
    -   Validación de educación (institución, título, fechas formato YYYY-MM-DD)
    -   Validación de experiencia laboral (empresa, puesto, descripción, fechas)
    -   Validación de CV (filePath y fileType requeridos)
    -   Modo edición (skip validación cuando hay id)

-   **Guardado en base de datos (addCandidate service):**

    -   7 tests cubriendo escenarios de guardado
    -   Creación exitosa con todos los datos relacionados
    -   Creación con solo campos obligatorios
    -   Manejo de errores de validación
    -   Manejo de email duplicado (P2002)
    -   Propagación de errores de base de datos
    -   Creación con múltiples educaciones
    -   Creación con múltiples experiencias laborales

-   **Controlador (addCandidateController):**
    -   8 tests cubriendo respuestas HTTP
    -   Respuesta 201 cuando se crea exitosamente
    -   Respuesta 400 cuando falla la validación
    -   Respuesta 400 cuando el email ya existe
    -   Respuesta 400 cuando falla la conexión a BD
    -   Manejo de errores desconocidos
    -   Validación de formato de email y teléfono

**Decisiones de diseño implementadas:**

1. **Mockeo de modelos:** Se mockean directamente los modelos (Candidate, Education, WorkExperience, Resume) en lugar de PrismaClient, ya que cada modelo instancia su propio PrismaClient.

2. **Patrón Builder:** Uso de builders para crear datos de test de forma legible y mantenible, siguiendo el patrón Factory.

3. **Estructura AAA:** Todos los tests siguen el patrón Arrange-Act-Assert para máxima claridad.

4. **Naming descriptivo:** Nombres de tests que describen claramente el comportamiento esperado.

5. **Aislamiento:** Cada test es independiente con limpieza de mocks en `beforeEach`.

**Total:** 45 tests unitarios completos siguiendo las especificaciones TDD

---

## Prompt 3: Ejecución de Tests y Corrección de Errores

**Modelo LLM:** Claude Sonnet 4.5 / Auto

### Prompt Original

```
ejecuta los tests
```

### Resultado Obtenido

**Actividades realizadas:**

1. **Ejecución inicial de tests:**

    - Se detectaron errores de TypeScript relacionados con el encadenamiento de métodos en los builders
    - Se identificó que los métodos `withEducations()`, `withWorkExperiences()` y `withCV()` debían llamarse antes de `buildValid()` o `buildMinimal()`

2. **Correcciones aplicadas:**

    - Corrección de 15+ instancias donde se encadenaban incorrectamente los métodos del builder
    - Eliminación de import innecesario en `candidateBuilder.ts` que causaba error de compilación
    - Ajuste de rutas de importación

3. **Resultado final:**
    - ✅ **45 tests pasando** en 2 suites de tests
    - ✅ Tiempo de ejecución: ~30 segundos
    - ✅ Cobertura de código:
        - `validator.ts`: 98.13%
        - `candidateService.ts`: 100%
        - `candidateController.ts`: 100%
    - ⚠️ Cobertura global: 49.6% (debido a que los modelos están completamente mockeados y otros archivos no tienen tests)

**Archivos modificados:**

-   `backend/src/tests/candidateService.test.ts` - Corrección de encadenamiento de métodos builder
-   `backend/src/tests/candidateController.test.ts` - Corrección de encadenamiento de métodos builder
-   `backend/test-utils/builders/candidateBuilder.ts` - Eliminación de import innecesario

**Estado final:** Todos los tests pasan correctamente y la suite está lista para uso

---

## Resumen General de la Sesión

### Objetivos Cumplidos

✅ **User Story completa** generada siguiendo las especificaciones del proyecto  
✅ **Suite completa de tests unitarios** (45 tests) implementada siguiendo TDD  
✅ **Configuración de Jest** con cobertura mínima del 90%  
✅ **Estructura de test-utils** con builders y mocks  
✅ **Todos los tests pasando** sin errores

### Archivos Generados

-   `user_stories.md` - 1 User Story completa
-   `backend/jest.config.js` - Configuración de Jest
-   `backend/test-utils/setupTests.ts` - Setup de tests
-   `backend/test-utils/prismaMock.ts` - Utilidades de mock
-   `backend/test-utils/builders/*.ts` - 4 builders para datos de test
-   `backend/src/tests/candidateService.test.ts` - Suite principal de tests
-   `backend/src/tests/candidateController.test.ts` - Tests del controlador

### Métricas Finales

-   **Tests totales:** 45
-   **Tests pasando:** 45 (100%)
-   **Cobertura de código crítico:** 98-100%
-   **Tiempo de ejecución:** ~30 segundos
-   **Librerías instaladas:** jest-mock-extended

### Próximos Pasos Sugeridos

Para alcanzar el 90% de cobertura global:

1. Agregar tests para los modelos (sin mockear completamente)
2. Agregar tests para `fileUploadService.ts`
3. Agregar tests para las rutas (`candidateRoutes.ts`)

---

**Fecha de generación:** 2025-12-09  
**Tecnologías utilizadas:** TypeScript, Jest, Prisma, Express, TDD
