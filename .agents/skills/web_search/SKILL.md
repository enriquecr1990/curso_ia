---
name: web_search
description: Skill para buscar información en internet usando un motor de búsqueda.
---

# Plantilla de Nueva Skill
## Nombre 
web_search

## Objetivo
Permitir a los agentes (especialmente al Researcher) buscar información actualizada, documentación técnica o resolver dudas generales accediendo a internet.

## Cuando usar 
Cuando el conocimiento interno del LLM no es suficiente, la información debe ser en tiempo real, o cuando se requiera validar datos actualizados (versiones, noticias, etc).

## Cuando no usar
Cuando la respuesta ya existe en la Memoria Viva del proyecto o en archivos locales del repositorio. No usar para cosas obvias o cálculos lógicos que el modelo pueda resolver.

## Entradas necesarias 
- `query` (String): La cadena de texto específica que se enviará al buscador (ej. "novedades de LangGraph v0.1").

## Procedimiento
1. Recibir el `query`.
2. Ejecutar la llamada a la API del buscador configurado.
3. Extraer los títulos, fragmentos (snippets) y URLs de los primeros 5 resultados.
4. Consolidar los resultados en formato texto.

## Salidas esperadas 
- Un bloque de texto con los resultados estructurados (resumen del contenido) para que el agente que lo llamó pueda analizarlo.

## Combinaciones recomendadas
- Se recomienda combinar con `read_file` si la búsqueda web indica que hay un archivo local relacionado.
- Usar en conjunto con el agente `Researcher`.

## Riesgos y limites
- Dependencia de la conexión a internet y límite de la API del buscador.
- Riesgo de alucinaciones si los resultados web no son precisos.
- Límite de tokens si los resultados de búsqueda son demasiado largos; se debe truncar la información.
