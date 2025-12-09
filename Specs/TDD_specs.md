# Especificaciones TDD + Testing (Jest, Prisma, React)

## 1. Objetivo del documento

Este documento define las **especificaciones de desarrollo guiado por pruebas (TDD)** y los **estándares de testing** para el proyecto:

* Backend: Node.js + TypeScript + Express + Prisma.
* Frontend: React + TypeScript.
* Framework de tests: **Jest** (unitarios, integración) y Cypress (E2E, según estándar de frontend).

El objetivo es:

* Asegurar **calidad, mantenibilidad y regresiones mínimas**.
* Alinear con los estándares de backend/frontend existentes (coverage, estructura de carpetas, mocks, etc.).
* Definir **cómo** usar Jest con TypeScript y **cómo mockear Prisma Client** siguiendo las guías oficiales. ([jestjs.io][1])

---

## 2. Principios generales de TDD

### 2.1 Ciclo TDD

Todo nuevo desarrollo (feature o bugfix) seguirá, por defecto, el ciclo:

1. **Red**

   * Escribir un test que **falle** claramente (describe el comportamiento deseado).
   * Ejecutar la suite y confirmar que el fallo es por el motivo esperado.

2. **Green**

   * Implementar el código mínimo necesario para que el test pase.
   * Ejecutar solo ese test y luego toda la suite para verificar que no se rompen otros casos.

3. **Refactor**

   * Refactorizar el código de producción y/o los tests:

     * Eliminar duplicidad.
     * Mejorar nombres, legibilidad.
     * Mantener tests verdes tras la refactorización.

> Regla: no se sube código nuevo de negocio sin al menos un test asociado que haya pasado por **Red → Green → Refactor**.

---

### 2.2 Tipos de tests y pirámide de testing

* **Unit tests**

  * Un único “unit of behavior” (función, método, hook, componente) aislado.
  * Sin acceso a red, disco, DB ni servicios externos.
  * Mocks/stubs de:

    * Prisma Client.
    * Servicios externos (OCR, APIs).
    * Capa HTTP o UI (en backend).
* **Integration tests**

  * Múltiples componentes reales colaborando:

    * Por ejemplo: controller + service + validaciones + DB de test (Prisma con base de datos de prueba).
  * Menos mocks: solo se mockean servicios externos fuera del alcance del test.
* **End-to-End (E2E)**

  * Simulan el flujo completo de usuario (Cypress en frontend).
  * Uso de `data-testid` cuando no sea posible usar roles/labels semánticos.

**Pirámide objetivo:**

* Muchos **unit tests**.
* Menos **integration tests**.
* Pocos, pero críticos, **E2E**.

---

### 2.3 Qué sí testear / qué no testear

**Testear:**

* Reglas de negocio (dominio, services, use-cases).
* Validaciones de entrada/salida (DTOs, schemas).
* Transformaciones de datos (mappers).
* Integración con Prisma (repositories) y contratos (qué queries se disparan).
* Comportamiento visible del UI (renderizado condicional, eventos, flujos de usuario).

**No testear:**

* Detalles de implementación internos (estructura interna de clases, estados privados).
* Código generado automáticamente (tipos generados, clientes de Prisma, etc.).
* Librerías de terceros (solo nuestro uso de ellas).
* Estilos visuales salvo cuando forman parte del comportamiento (clases de estado activo/deshabilitado sí, paddings no).

---

### 2.4 Reglas generales de calidad de tests

* Tests **rápidos, deterministas y aislados**.
* Naming descriptivo:

  * `describe('UserService - createUser', ...)`
  * `it('should create a user when data is valid', ...)`
* Patrón **Arrange – Act – Assert** (AAA) claro en cada test:

  ```ts
  it('should ...', async () => {
    // Arrange
    // Act
    // Assert
  });
  ```
* No duplicar lógica compleja en los tests (tests no re-implementan la función testada).
* Utilizar **test data builders / factories** para objetos repetitivos (usuarios, direcciones, pedidos), siguiendo la carpeta `test-utils/builders` definida en los estándares de backend.
* Toda nueva funcionalidad en backend o frontend debe ir acompañada de sus tests.

---

## 3. Estándares globales de testing del proyecto

Basado en los documentos de estándares de backend y frontend:

### 3.1 Cobertura mínima

* Cobertura mínima global: **90%** en **branches, functions, lines y statements**.
  Esto se aplicará a:

  * Backend (`backend/src/**/*.{ts}`)
  * Frontend (`frontend/src/**/*.{ts,tsx}`)

Se configurará vía `coverageThreshold` en Jest (ver secciones más abajo).

### 3.2 Localización y nombres de archivos de test

* Nombre: `[NombreComponente|Servicio].test.ts` o `.test.tsx` (frontend).
* Ubicación:

  * Tests **co-localizados**:

    * `src/service/UserService.ts` → `src/service/UserService.test.ts`
    * `src/components/Button.tsx` → `src/components/Button.test.tsx`
  * Alternativamente, uso de carpetas `__tests__` adyacentes al código cuando se considere más limpio:

    * `src/service/__tests__/UserService.test.ts`

### 3.3 Organización del código de test

* Carpeta común (backend): `test-utils/`

  * `test-utils/builders`: factories para entidades de dominio.
  * `test-utils/mocks`: mocks de servicios, Prisma, etc.
* Reglas de mockeo (aplican a todo el proyecto):

  * Mockear dependencias externas (Prisma, servicios HTTP, OCR, etc.).
  * Mockear repositorios en tests de servicios.
  * Mockear servicios en tests de controladores.
  * Limpiar mocks en `beforeEach` con `jest.clearAllMocks()` o `mockReset(...)` según el caso.

---

## 4. Especificaciones TDD + Jest en el Backend (Node + TS + Express + Prisma)

### 4.1 Configuración de Jest con TypeScript en backend

Se usará **Jest** con **ts-jest** como preset para compilar TypeScript en tiempo de test. ([jestjs.io][1])

Ejemplo de `backend/jest.config.ts`:

```ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts}',
    '!src/**/index.ts',
    '!src/**/types.ts',
    '!src/**/config/**',
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/test-utils/setupTests.ts'],
};

export default config;
```

`test-utils/setupTests.ts`:

```ts
beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});
```

### 4.2 Unidades a testear en backend

Prioridad TDD:

1. **Funciones de dominio / utilidades puras** (sin IO).
2. **Servicios (use-cases)** que encapsulan lógica de negocio:

   * Usan repositorios / Prisma / otros servicios → estos se mockean.
3. **Repositorios Prisma**:

   * Mockean el Prisma Client, pero verifican que se llaman las queries correctas.
4. **Controladores Express**:

   * Mock del service.
   * Request/response simulados (mocks o librerías tipo `supertest`).

---

### 4.3 Mocking del Prisma Client (unit tests)

El objetivo es **no tocar la base de datos real en tests unitarios**, siguiendo las guías oficiales de Prisma para mockear Prisma Client. ([Prisma][2])

Hay dos patrones relevantes en la documentación de Prisma:

1. **Singleton**: Prisma se instancia una vez y se exporta; los tests mockean ese módulo.
2. **Dependency Injection**: Prisma se inyecta como dependencia en servicios.

Para este proyecto:

* **Patrón recomendado**: **Singleton + mock** (más sencillo y compatible con los estándares actuales).

#### 4.3.1 Definición del cliente Prisma real

`src/infra/db/prismaClient.ts`:

```ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
```

#### 4.3.2 Definición de un mock centralizado de Prisma (jest-mock-extended)

Se recomienda usar `jest-mock-extended` para crear mocks profundos de Prisma Client. ([GitHub][3])

Instalación:

```bash
npm install --save-dev jest-mock-extended
```

`test-utils/prismaMock.ts`:

```ts
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';
import prisma from '../src/infra/db/prismaClient';

// Mock del módulo que exporta el prisma real
jest.mock('../src/infra/db/prismaClient', () => {
  const { mockDeep } = require('jest-mock-extended');
  return {
    __esModule: true,
    default: mockDeep<PrismaClient>(),
  };
});

// Exportamos una referencia tipada al mock
export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

// Reseteamos el mock antes de cada test
beforeEach(() => {
  mockReset(prismaMock);
});
```

**Convenciones:**

* Cualquier test que necesite interactuar con la capa de datos a nivel unitario usará `prismaMock`.
* Nunca se llamó a la base de datos real en un **unit test**.

#### 4.3.3 Uso del mock de Prisma en tests de servicio/repositorio

Ejemplo: test de un servicio que usa Prisma vía un repositorio:

```ts
// src/service/UserService.ts
import prisma from '../infra/db/prismaClient';

export class UserService {
  async createUser(data: { email: string; name: string }) {
    const user = await prisma.user.create({ data });
    return user;
  }
}
```

Test (TDD):

```ts
// src/service/UserService.test.ts
import { UserService } from './UserService';
import { prismaMock } from '../../test-utils/prismaMock';

describe('UserService - createUser', () => {
  const service = new UserService();

  it('should create a user when data is valid', async () => {
    // Arrange
    const input = { email: 'test@example.com', name: 'Test User' };
    const fakeUser = { id: 1, ...input };

    prismaMock.user.create.mockResolvedValueOnce(fakeUser as any);

    // Act
    const result = await service.createUser(input);

    // Assert
    expect(prismaMock.user.create).toHaveBeenCalledWith({ data: input });
    expect(result).toEqual(fakeUser);
  });

  it('should propagate errors from prisma', async () => {
    prismaMock.user.create.mockRejectedValueOnce(new Error('DB error'));

    await expect(
      service.createUser({ email: 'x@y.z', name: 'X' }),
    ).rejects.toThrow('DB error');
  });
});
```

**Reglas:**

* Siempre verificar:

  * Que se llama al modelo correcto: `prismaMock.user.findUnique`, `prismaMock.order.update`, etc.
  * Que se pasan los parámetros esperados (`where`, `data`, `select`, etc.).
* Incluir tests explícitos para:

  * Caminos correctos (happy path).
  * Errores de DB (excepciones, duplicados, constraints, etc.).
  * Operaciones con transacciones (`prisma.$transaction`) mockeando los resultados esperados.

---

### 4.4 Tests de integración con Prisma (sin mock)

Para casos donde **sí queremos golpear la base de datos** (test de integración):

* Usar una **base de datos de test** separada (por ejemplo, `DATABASE_URL` de test).
* Ejecutar migraciones antes de la suite (via `globalSetup` de Jest o scripts de npm).
* No usar `prismaMock` ni `jest.mock` sobre `prismaClient`; estos tests deben importar el `prisma` real.

Recomendado:

* Ubicar estos tests en `backend/tests/integration/*.test.ts`.
* Configurar un segundo `jest.config.integration.ts` o usar etiquetas (e.g. nombres con `.int.test.ts`) y comandos de npm distintos (`npm run test:unit`, `npm run test:integration`).

---

### 4.5 Especificaciones TDD para controladores Express

En línea con los estándares de backend:

* Los controladores deben testear:

  * Manejo correcto de parámetros y body.
  * Validaciones (400 vs 422 vs 404 vs 500).
  * Transformación del resultado del service a respuesta HTTP.
* El **service se mockea completamente**:

  * No se golpea DB aquí.
  * Solo se verifica que se llama al service con los argumentos correctos y que se devuelven los códigos de estado adecuados.

Ejemplo:

```ts
// src/controllers/UserController.test.ts
import request from 'supertest';
import app from '../app'; // Express app
import { UserService } from '../service/UserService';

jest.mock('../service/UserService');

const UserServiceMock = UserService as jest.MockedClass<typeof UserService>;

describe('UserController - POST /users', () => {
  it('should return 201 when user is created', async () => {
    UserServiceMock.prototype.createUser.mockResolvedValueOnce({
      id: 1,
      email: 'test@example.com',
      name: 'Test',
    } as any);

    const res = await request(app)
      .post('/users')
      .send({ email: 'test@example.com', name: 'Test' });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe('test@example.com');
  });
});
```

---

## 5. Especificaciones TDD + Jest en el Frontend (React + TS)

### 5.1 Configuración Jest + React Testing Library

El frontend usa:

* **Jest** como runner.
* **React Testing Library (RTL)** para tests de componentes. ([shinagawa-web.com][4])

Ejemplo de `frontend/jest.config.ts`:

```ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  rootDir: './',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.(ts|tsx)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/index.tsx',
    '!src/**/types.ts',
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/src/test/setupTests.ts'],
};

export default config;
```

`src/test/setupTests.ts`:

```ts
import '@testing-library/jest-dom';
```

### 5.2 Qué se testea en frontend (TDD)

Prioridad:

1. **Funciones puras** (helpers, formatters, hooks sin IO) → **unit tests** simples.
2. **Componentes de UI** con React Testing Library:

   * Renderizar UI correcta para distintos props/estado.
   * Manejo de eventos (click, input, submit).
   * Interacciones con el usuario (via `userEvent`).
   * Mensajes de error/estado vacíos/loading.
3. **Hooks personalizados**:

   * Testear lógica con un wrapper de test (e.g. `renderHook` de RTL).
4. **Integración con servicios de API (fetch/Axios)**:

   * Mockear llamadas HTTP (e.g., `jest.mock('./services/api')` o `msw`).

**Reglas:**

* Preferir queries semánticas:

  * `screen.getByRole`, `getByText`, `getByLabelText`, etc.
* Usar `data-testid` solo cuando no haya alternativa semántica (esta convención es coherente con el uso en Cypress descrito en estándares de frontend).
* No testear implementaciones internas (estado interno exacto, hooks internos) si se puede testear el comportamiento visible.
* Para componentes complejos, añadir tests de **regresión de comportamiento** (lo que el usuario ve y puede hacer).

Ejemplo simple RTL:

```tsx
// src/components/SubmitButton.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SubmitButton } from './SubmitButton';

describe('SubmitButton', () => {
  it('should call onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    render(<SubmitButton onClick={onClick}>Enviar</SubmitButton>);

    await user.click(screen.getByRole('button', { name: /enviar/i }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## 6. Reglas de TDD aplicadas al flujo de trabajo

### 6.1 Para nuevas features

1. Crear issue / tarea con comportamiento esperado.
2. Escribir PRIMERO los tests:

   * Backend: servicio/repositorio/controlador según aplique.
   * Frontend: hooks/componentes afectados.
3. Ver todos los nuevos tests en rojo.
4. Implementar el mínimo código necesario para ponerlos en verde.
5. Refactorizar código de producción + tests.
6. Verificar:

   * `npm test` (backend y frontend).
   * Coverage ≥ 90% (no bajar global).

### 6.2 Para corrección de bugs

1. Reproducir el bug en un **test que falle**:

   * Backend: test unitario de la función/service implicado.
   * Frontend: test de componente o hook que reproduzca el comportamiento.
2. Corregir el código hasta que el test pase.
3. Añadir, si procede, tests adicionales para caminos alternativos relacionados.
4. No cerrar la incidencia sin que exista al menos un test que demuestre que el bug no volverá.

---

## 7. Checklist rápida para desarrolladores

Antes de hacer commit / abrir PR:

* [ ] He escrito tests **antes o durante** la implementación (TDD).
* [ ] Los tests cubren:

  * [ ] Happy path.
  * [ ] Errores y edge cases relevantes.
* [ ] En backend:

  * [ ] En unit tests, Prisma Client está **mockeado** (`prismaMock`).
  * [ ] No accedo a la DB real en unit tests.
* [ ] En frontend:

  * [ ] Uso React Testing Library con queries semánticas.
  * [ ] Solo uso `data-testid` cuando es estrictamente necesario.
* [ ] `npm test` pasa en backend y frontend.
* [ ] La cobertura se mantiene por encima del **90%** o la PR incluye una justificación explícita para casos excepcionales.
* [ ] Los nombres de los tests son descriptivos y se entiende qué comportamiento están validando.

---

