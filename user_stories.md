# User Stories

## User Story: Registro de Candidatos en el Sistema

**User Story**:  
Como candidato o reclutador, quiero poder registrar los datos personales, educativos, profesionales y el currículum de un candidato en el sistema, para que la información quede almacenada de forma estructurada y disponible para procesos de selección posteriores.

**Descripción**:  
Esta funcionalidad permite la creación de nuevos registros de candidatos en el sistema ATS. El usuario (ya sea el propio candidato o un reclutador que actúa en su nombre) debe poder introducir información completa a través de un formulario web, incluyendo datos personales básicos, historial educativo, experiencia laboral y documentos adjuntos. El sistema debe validar la información recibida y persistirla correctamente en la base de datos, estableciendo las relaciones apropiadas entre el candidato y sus datos relacionados (educación, experiencia, CV).

**Criterios de aceptación**:

### Recepción de datos del formulario
- **Dado** que el usuario accede al formulario de registro de candidatos, **cuando** completa los campos obligatorios (nombre, apellido, email), **entonces** el sistema debe permitir el envío del formulario.
- **Dado** que el usuario introduce datos en el formulario, **cuando** el email no cumple el formato válido (regex de email), **entonces** el sistema debe mostrar un error de validación y no permitir el envío.
- **Dado** que el usuario introduce un nombre o apellido, **cuando** el campo contiene menos de 2 caracteres, más de 100 caracteres o caracteres no permitidos, **entonces** el sistema debe rechazar el dato y mostrar un mensaje de error.
- **Dado** que el usuario introduce un teléfono, **cuando** el formato no cumple con el patrón español (9 dígitos comenzando por 6, 7 o 9), **entonces** el sistema debe mostrar un error de validación.
- **Dado** que el usuario agrega una educación, **cuando** completa los campos de institución, título y fecha de inicio, **entonces** el sistema debe aceptar y permitir agregar múltiples registros educativos.
- **Dado** que el usuario agrega una experiencia laboral, **cuando** completa los campos de empresa, puesto y fecha de inicio, **entonces** el sistema debe aceptar y permitir agregar múltiples registros de experiencia.
- **Dado** que el usuario sube un archivo de CV, **cuando** el archivo se procesa correctamente, **entonces** el sistema debe almacenar la ruta del archivo y su tipo para asociarlo al candidato.

### Guardado en base de datos
- **Dado** que el formulario contiene datos válidos de un candidato, **cuando** se envía la solicitud al endpoint de creación, **entonces** el sistema debe crear un nuevo registro en la tabla Candidate con los datos personales proporcionados.
- **Dado** que se crea un candidato con educaciones asociadas, **cuando** se guarda el candidato, **entonces** el sistema debe crear los registros correspondientes en la tabla Education vinculados al candidato mediante candidateId.
- **Dado** que se crea un candidato con experiencias laborales asociadas, **cuando** se guarda el candidato, **entonces** el sistema debe crear los registros correspondientes en la tabla WorkExperience vinculados al candidato mediante candidateId.
- **Dado** que se crea un candidato con un CV adjunto, **cuando** se guarda el candidato, **entonces** el sistema debe crear un registro en la tabla Resume vinculado al candidato mediante candidateId, incluyendo filePath, fileType y uploadDate.
- **Dado** que se intenta crear un candidato con un email que ya existe en el sistema, **cuando** se procesa la solicitud, **entonces** el sistema debe rechazar la operación y devolver un error indicando que el email ya está registrado (debido a la restricción unique en el campo email).
- **Dado** que se crea exitosamente un candidato, **cuando** se completa la operación, **entonces** el sistema debe devolver el objeto candidato creado con su ID generado y un código de estado HTTP 201.
- **Dado** que se intenta crear un candidato con datos inválidos, **cuando** la validación falla, **entonces** el sistema debe devolver un código de estado HTTP 400 con un mensaje de error descriptivo indicando qué campo o validación falló.

**Notas**:
- Los campos obligatorios son: firstName, lastName, email.
- Los campos opcionales son: phone, address.
- Las educaciones y experiencias laborales son opcionales pero, si se proporcionan, deben cumplir con sus propias validaciones.
- El CV es opcional, pero si se proporciona, debe incluir filePath y fileType válidos.
- Las fechas deben estar en formato YYYY-MM-DD.
- El sistema debe manejar transacciones para asegurar la integridad de los datos: si falla el guardado de alguna relación (educación, experiencia o CV), se debe revertir toda la operación.
- Las validaciones se realizan tanto en el frontend (para UX) como en el backend (para seguridad e integridad de datos).

**Tareas**:
- Implementar validación de datos del formulario en el frontend.
- Implementar validación de datos en el backend (validator.ts).
- Implementar lógica de guardado del candidato principal en base de datos.
- Implementar lógica de guardado de educaciones relacionadas.
- Implementar lógica de guardado de experiencias laborales relacionadas.
- Implementar lógica de guardado de CV relacionado.
- Implementar manejo de errores y respuestas HTTP apropiadas.
- Implementar tests unitarios para validación de datos del formulario.
- Implementar tests unitarios para guardado en base de datos.

