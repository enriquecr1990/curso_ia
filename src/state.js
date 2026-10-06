import { Annotation } from "@langchain/langgraph";

// Definimos la Memoria Viva (State) del sistema multi-agente
// Esta es la estructura de datos que persiste a través del grafo
export const AgentState = Annotation.Root({
  messages: Annotation({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  nextAgent: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => "orchestrator",
  }),
  context: Annotation({
    reducer: (x, y) => ({ ...x, ...y }),
    default: () => ({}),
  }),
});
