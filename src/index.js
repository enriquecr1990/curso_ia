import dotenv from "dotenv";
dotenv.config();

import { StateGraph, END, START } from "@langchain/langgraph";
import { AgentState } from "./state.js";
import { orchestratorAgent, researcherAgent, coderAgent, analystAgent } from "./agents.js";
import { HumanMessage } from "@langchain/core/messages";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { skillsList } from "./skills.js";

const buildEcosystem = () => {
  // Construimos el grafo (Nodos y Conexiones) usando el AgentState como Memoria Viva
  const workflow = new StateGraph(AgentState)
    // 1. Agregar Nodos (Agentes y Skills)
    .addNode("orchestrator", orchestratorAgent)
    .addNode("researcher", researcherAgent)
    .addNode("coder", coderAgent)
    .addNode("analyst", analystAgent)
    .addNode("skills", new ToolNode(skillsList));

  // 2. Definir conexiones (Edges)
  // Todo empieza siempre en el orquestador
  workflow.addEdge(START, "orchestrator");

  // Ruteo condicional desde el orquestador a los agentes especializados
  workflow.addConditionalEdges("orchestrator", (state) => {
    if (state.nextAgent === "researcher") return "researcher";
    if (state.nextAgent === "coder") return "coder";
    if (state.nextAgent === "analyst") return "analyst";
    return END; // Si no delega a nadie, se termina la ejecución
  });

  // Función para evaluar si un agente llamó a una tool/skill
  const routeAfterAgent = (state) => {
    const lastMessage = state.messages[state.messages.length - 1];
    // Si el último mensaje tiene tool_calls, vamos al nodo de skills
    if (lastMessage?.tool_calls?.length > 0) {
      return "skills";
    }
    // Si no usó skills, regresa el control al orquestador
    return "orchestrator"; 
  };

  // Conectar los agentes a la lógica de ruteo
  workflow.addConditionalEdges("researcher", routeAfterAgent);
  workflow.addConditionalEdges("coder", routeAfterAgent);
  workflow.addConditionalEdges("analyst", routeAfterAgent);

  // Cuando las skills terminan de ejecutarse, regresan la información al orquestador
  workflow.addEdge("skills", "orchestrator");

  return workflow.compile();
};

async function testEcosystem() {
  console.log("=========================================");
  console.log("Iniciando Ecosistema de Agentes y Skills");
  console.log("Memoria Viva activada (LangGraph + Gemini)");
  console.log("=========================================\n");
  
  if (!process.env.GOOGLE_API_KEY) {
    console.error("ADVERTENCIA: Falta GOOGLE_API_KEY en las variables de entorno.");
    console.log("Por favor, crea un archivo .env en la raíz de curso_ia y agrega tu GOOGLE_API_KEY.\n");
  }

  const app = buildEcosystem();

  const initialState = {
    messages: [new HumanMessage("Por favor investiga qué es LangGraph usando tus skills de búsqueda.")],
    context: { project: "curso_ia", framework: "gemini-sdk" }
  };

  console.log("Grafo compilado correctamente. Los nodos están conectados.");
  console.log("Para probar el flujo completo, descomenta app.invoke en src/index.js una vez configurada tu API Key.");
  
  // Para probar realmente el grafo, descomenta esto cuando tengas la API key configurada:
  /*
  try {
      console.log("Ejecutando iteración sobre la memoria viva...");
      const finalState = await app.invoke(initialState, { recursionLimit: 10 });
      console.log("\n--- RESULTADO FINAL ---");
      console.log(finalState.messages[finalState.messages.length - 1].content);
  } catch (e) {
      console.error("Error durante la ejecución del grafo:", e.message);
  }
  */
}

testEcosystem();
