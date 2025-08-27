```cangjie
package MagicExplorer

import magic.dsl.*  
import magic.prelude.*  
import magic.config.Config 
import magic.model.ollama.OllamaEmbeddingModel
import magic.mcp.*
import magic.rag.graph.{MiniRagBuilder,MiniRagConfig,MiniRag}
import magic.tokenizer.Cl100kTokenizer
import magic.core.model.{ChatModel, EmbeddingModel}
import magic.model.openai.*
import magic.dsl.tool
import magic.tool.*
import magic.mcp.StdioMCPServer
import std.fs.*
import std.io.*
let mcpServerPath = "browser-manipulator-refactored/mcpServer.js"

//"Log into youtube and then play rick roll video on youtube."
//"Submit an application to a Software Engineering job in Phili at Susqehanna, use my CV which is in file cv.pdf."
//Go to amazon and add all products from 'List of item to purchase' to basket. Then purchase them. If nessesary create an account."
//"Fill out a reservation for me for a one-way flight from Edinburgh to Krakow on ryanair website, with depart date on August 8th 2025. I will only take cabin bag, dont want to select seats or anything additional."
//"send an email to maksymilian.sieklinski@gmail.com saying that you will send him his money in two weeks time. Make the email text a poem."
//"Go from huawei wikipedia page to ramen wikipedia page."
//"Log into strava account and find out how many followers you have"
//"Go to this website, and see if you can solve the challenge: https://2captcha.com/demo/normal"

func instantiateModel() {
    var agent = Executor()
    let agentTools = agent.client.tools 
    loadAgentSpecifications()
    println(API_MODEL)
    let cangjieWrapperTools : Array<String> = ["screenshot","click","currentUrl","back","uploadFile","urlNavigator","passCaptcha","close"]

    for(tool in agentTools){
        if(!cangjieWrapperTools.contains(tool.name)){
            agent.toolManager.addTools(ArrayList<Tool>([tool]))
        }

    }

    return agent
}

func executeGoal(currentGoal: String): String{


    let isSubGoal : Bool = (currentGoal != goal)
    let prevGoal = goal
    goal = currentGoal
    executorPrompt = getPrompt('executor-prompt.md')
    let agent = instantiateModel()
    while(let Some(decision) <- agent.chatGet<ExecutorValue>("Complete an incremental step towards your goal\n List of previous actions: ${agent.memoryManager}.")){
        println(agent.memoryManager.back())
        if(decision.finishedExecution){
            println(decision.result)
            goal = prevGoal
            // Closes Page
            if(isSubGoal){ agent.callMCPTool("close") }
            return decision.result
        }
    }
    goal = prevGoal
    return "Agent failure"
}

main(): Int64 {
    // Create the agent with the MCP server configured
    executeGoal(goal)
    return 0
}
```