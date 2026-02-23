# Guía: Engram + Agent Teams Lite en Cursor

Esta guía explica cómo están configurados **Engram** (memoria persistente para el agente) y **Agent Teams Lite** (desarrollo dirigido por especificaciones con sub-agentes) en Cursor, y cómo usarlos.

---

## 1. Engram — Memoria persistente para el agente

**Repositorio:** [Gentleman-Programming/engram](https://github.com/Gentleman-Programming/engram)

### Qué es

Engram da al asistente de Cursor **memoria persistente**: lo que guardas con `mem_save` y los resúmenes de sesión con `mem_session_summary` se almacenan en SQLite (por defecto en `~/.engram/engram.db`). En la siguiente sesión, el agente puede usar `mem_search` y `mem_context` para recuperar contexto y no “empezar de cero”.

- **Un solo binario** en Go, sin Node/Python/ChromaDB.
- **Compatible con MCP**: Cursor se conecta por stdio al comando `engram mcp`.
- **Privacidad**: puedes marcar contenido sensible con `<private>...</private>` y se redacta antes de guardar.

### Instalación

1. **Instalar el binario Engram** (elige una opción):

   - **Windows:** Descarga el binario desde [GitHub Releases](https://github.com/Gentleman-Programming/engram/releases) (ej. `engram_1.3.1_Windows_x86_64.zip`), descomprímelo y asegúrate de que `engram.exe` esté en el `PATH`.
   - **Con Go instalado:**  
     `go install github.com/Gentleman-Programming/engram/cmd/engram@latest`
   - **macOS/Linux:**  
     `brew install gentleman-programming/tap/engram`

2. **Comprobar:** En una terminal ejecuta `engram version`.

3. **Configuración MCP en Cursor**  
   En este proyecto ya está creado `.cursor/mcp.json` con:

   ```json
   {
     "mcpServers": {
       "engram": {
         "command": "engram",
         "args": ["mcp"]
       }
     }
   }
   ```

   En Windows, Cursor puede usar también la config **global** en `%USERPROFILE%\.cursor\mcp.json`. Si no ves las herramientas de Engram, copia el bloque `engram` dentro de `mcpServers` en ese archivo, guarda y **reinicia Cursor por completo**.

### Uso en Cursor

Una vez Engram está instalado y el MCP cargado, el agente dispone de estas herramientas (entre otras):

| Herramienta | Uso |
|-------------|-----|
| **mem_save** | Guardar una observación estructurada (decisión, bugfix, patrón, etc.). Campos típicos: `title`, `type`, `content`; opcional `topic_key` para ir actualizando la misma memoria. |
| **mem_search** | Búsqueda full-text en todas las memorias. Úsala al empezar trabajo relacionado con algo pasado. |
| **mem_context** | Obtener contexto reciente de sesiones anteriores. **Importante:** tras un “reset” de contexto o compactación, el agente debe llamar primero a `mem_context`. |
| **mem_session_summary** | Guardar resumen de fin de sesión (Goal, Discoveries, Accomplished, Files). |
| **mem_timeline** | Contexto cronológico alrededor de una observación (por ID). |
| **mem_get_observation** | Ver el contenido completo de una memoria por ID. |
| **mem_update** / **mem_delete** | Actualizar o borrar (soft/hard) una observación. |
| **mem_stats** | Estadísticas del sistema de memoria. |

En `.cursorrules` ya hay instrucciones para que el agente:

- Guarde de forma proactiva después de trabajo relevante.
- Tras compactación o reinicio de contexto, llame a `mem_context` antes de seguir.
- Use `mem_session_summary` al cerrar una sesión relevante.

**Ejemplos de frases para ti:**  
“Recuerda que decidimos usar React Query para cache” → el agente puede usar `mem_save`.  
“¿Qué habíamos acordado sobre la API de export?” → el agente puede usar `mem_search` o `mem_context`.

### TUI y CLI (opcional)

- **Terminal UI:** `engram tui` — Navegar y buscar memorias en la terminal.
- **CLI:** `engram search "texto"`, `engram context`, `engram stats`, etc.

---

## 2. Agent Teams Lite — SDD con sub-agentes

**Repositorio:** [Gentleman-Programming/agent-teams-lite](https://github.com/Gentleman-Programming/agent-teams-lite)  
En este proyecto el orquestador oficial del repo está integrado: `.cursorrules` incluye la política de artefactos, el grafo de dependencias y el mapeo comando→skill de `examples/cursor/.cursorrules`.

### Qué es

**Agent Teams Lite** es un patrón de orquestación para desarrollo **dirigido por especificaciones (SDD)**:

- Un **orquestador** (en Cursor, el mismo agente siguiendo `.cursorrules`) reconoce comandos como `/sdd:init`, `/sdd:new`, `/sdd:continue`, etc.
- Cada “fase” (explorar, proponer, escribir specs, diseño, tareas, implementar, verificar, archivar) sigue instrucciones definidas en **skills** (archivos Markdown).
- Los artefactos (propuesta, specs, design, tasks) se pueden persistir en **Engram** (recomendado) o en **openspec** (carpeta en el repo), o no persistir.

En Cursor no existe un “Task tool” que lance sub-agentes con contexto fresco; el agente ejecuta las fases **en línea** leyendo los `SKILL.md` correspondientes. Aun así, el flujo ordenado (proposal → specs → design → tasks → apply → verify → archive) y las reglas en los skills mejoran la previsibilidad y la calidad.

### Instalación de los skills (recomendado)

Para que los comandos SDD sigan las instrucciones oficiales:

1. Clona el repo (o descarga y descomprime):
   ```bash
   git clone https://github.com/Gentleman-Programming/agent-teams-lite.git
   cd agent-teams-lite
   ```
2. Ejecuta el instalador y elige **Cursor**:
   ```bash
   ./scripts/install.sh
   ```
   En Windows puedes copiar manualmente la carpeta `skills/sdd-*` al proyecto, por ejemplo:
   ```
   BOCALAN/
   └── skills/
       ├── sdd-init/
       ├── sdd-explore/
       ├── sdd-propose/
       ├── sdd-spec/
       ├── sdd-design/
       ├── sdd-tasks/
       ├── sdd-apply/
       ├── sdd-verify/
       └── sdd-archive/
   ```
   Cada una debe contener su `SKILL.md`.

Si no instalas los skills, el agente seguirá las reglas genéricas de `.cursorrules` para SDD, pero con menos detalle que leyendo cada `SKILL.md`.

### Comandos SDD en Cursor

| Comando | Qué hace |
|---------|----------|
| **/sdd:init** | Inicializa el contexto de orquestación. Crea `openspec/` solo si usas persistencia tipo openspec. |
| **/sdd:explore &lt;tema&gt;** | Explorar idea: analizar codebase, comparar enfoques. No crea archivos. |
| **/sdd:new &lt;nombre&gt;** | Nuevo cambio: exploración + propuesta (y opcionalmente specs, design, tasks). Ejemplo: `/sdd:new add-csv-export`. |
| **/sdd:continue** | Ejecutar la siguiente fase lista (specs, design, tasks, apply, verify, archive). |
| **/sdd:ff &lt;nombre&gt;** | “Fast-forward”: planificación rápida (proposal → specs → design → tasks). |
| **/sdd:apply** | Implementar las tareas en lotes y marcar ítems en `tasks.md`. |
| **/sdd:verify** | Verificar implementación frente a specs (CRITICAL / WARNING / SUGGESTION). |
| **/sdd:archive** | Cerrar el cambio y persistir estado (en Engram o en openspec). |

### Flujo típico

1. **Iniciar:** `/sdd:init`
2. **Nueva feature:** `/sdd:new add-dark-mode` (o el nombre que quieras).
3. Revisar propuesta; si apruebas, **seguir:** “continúa” o `/sdd:continue` para specs + design + tasks.
4. **Implementar:** `/sdd:apply` (el agente va marcando tareas).
5. **Verificar:** `/sdd:verify`
6. **Cerrar:** `/sdd:archive`

La persistencia por defecto recomendada es **Engram**: los artefactos se guardan con `mem_save` y no ensucian el repo. Si prefieres archivos en el proyecto, se puede usar **openspec** (carpeta `openspec/` con `changes/`, `specs/`, etc.); eso se puede indicar en las reglas o al pedir la feature.

### Relación con Engram

- Si Engram está configurado y disponible, el orquestador puede **persistir** propuestas, specs, design y resúmenes en Engram con `mem_save`.
- Así el historial de decisiones y especificaciones sobrevive entre sesiones y se puede recuperar con `mem_search` y `mem_context`.

---

## 3. Resumen de archivos en este proyecto

- **`.cursor/mcp.json`** — Configuración del servidor MCP de Engram para Cursor.
- **`.cursorrules`** — Reglas para: (1) uso proactivo de Engram y recuperación tras compactación, (2) comandos y flujo de Agent Teams Lite (SDD).

Pasos mínimos para ti:

1. Instalar el binario **Engram** y asegurarte de que `engram` (o `engram.exe`) esté en el `PATH`.
2. Reiniciar Cursor y comprobar que aparecen las herramientas MCP de Engram.
3. (Opcional) Clonar **agent-teams-lite** y copiar `skills/sdd-*` a `BOCALAN/skills/` para tener el flujo SDD completo.
4. Usar en chat: comandos `/sdd:...` para features grandes y frases como “recuérdalo” o “¿qué habíamos decidido?” para aprovechar Engram.

Si quieres, en un siguiente paso se puede añadir una regla en `.cursor/rules/` que refuerce el uso de Engram en ciertos tipos de archivos o tareas.
