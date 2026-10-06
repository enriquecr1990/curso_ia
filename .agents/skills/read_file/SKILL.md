---
name: read_file
description: Skill para leer y extraer el contenido de archivos del sistema local.
---

# Plantilla de Nueva Skill
## Nombre 
read_file

## Objetivo
Proporcionar a los agentes (principalmente al Coder o Analyst) la capacidad de leer el contenido exacto de archivos dentro del repositorio de código para analizarlos o tomarlos como base.

## Cuando usar 
Cuando un agente necesita conocer la implementación exacta de un componente, ver la configuración de un archivo o revisar un log de error en disco.

## Cuando no usar
No usar para archivos binarios, imágenes o videos. No usar si la ruta del archivo es externa al entorno de trabajo (`workspace`) autorizado.

## Entradas necesarias 
- `filePath` (String): La ruta relativa o absoluta del archivo que se desea leer (ej. `src/index.js`).

## Procedimiento
1. Recibir la ruta del archivo `filePath`.
2. Validar que el archivo existe en el sistema de archivos local y es de tipo texto.
3. Leer el archivo utilizando el módulo `fs` de Node.js u otra herramienta del sistema.
4. Retornar el string con el contenido.

## Salidas esperadas 
- El contenido del archivo en formato de texto plano (string). Si hay error, retornar el mensaje de error de lectura.

## Combinaciones recomendadas
- Se recomienda que el `Coder` use esto antes de intentar escribir código (para entender el contexto de un archivo existente).
- El `Analyst` lo puede usar para leer reportes.

## Riesgos y limites
- Leer archivos demasiado grandes (ej. bundle.js minificados o bases de datos SQLite) desbordará la ventana de contexto del LLM. Se debe truncar si supera los 2000 líneas.
- Riesgo de seguridad si se permite leer fuera del `workspace`.
