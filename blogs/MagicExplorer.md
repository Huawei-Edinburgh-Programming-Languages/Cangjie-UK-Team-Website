# MagicExplorer: An Automated Browser Agent System with Cangjie Magic Framework

As interns at Huawei, we embarked on an ambitious journey to create
MagicExplorer, an intelligent automated browser agent system that could
navigate and interact with web applications autonomously. This project
became a testament to iterative design, architectural evolution, and the
powerful capabilities of Huawei's Cangjie Magic framework.

## The Evolution of Architecture: From Complexity to Elegance

### Phase 1: The FFI Foundation

Our initial approach leveraged Foreign Function Integration (FFI) to
execute Python code from within our Cangjie environment. This allowed us
to harness the robust Python Playwright package through carefully
crafted wrapper functions. Playwright provided the essential DOM
manipulation capabilities - clicking elements, scraping content, and
basic navigation.

The first iteration was remarkably simple: we would prompt our agent to
identify which button to click, manually feed this information back to
Playwright, and observe the results. While this proved the concept, the
limitations were immediately apparent. The system lacked flexibility for
dynamic actions like scrolling or adaptive navigation, creating a rigid
interaction model that couldn't handle real-world web complexity.

### Phase 2: Tool-Based Single Agent

Recognizing these constraints, we evolved to a tool-based architecture
where our Cangjie agent had direct access to click and navigation tools.
This version represented a significant leap forward - we could prompt
the system with a goal once and watch it autonomously navigate toward
completion.

However, new challenges emerged. The agent struggled with memory
retention, often repeating previous actions in an endless loop,
expecting different results. Goal verification became problematic, with
the system unable to accurately determine task completion. Additionally,
the FFI layer introduced significant performance bottlenecks, making the
entire system frustratingly slow.

### Phase 3: Multi-Agent Architecture

Faced with these limitations, we returned to first principles. Our
analysis revealed that overwhelming a single agent with multiple
responsibilities was counterproductive. We designed a two-agent system:

- The Planner: Responsible for breaking down goals into actionable steps

- The Executor: Focused on implementing the planner's instructions

Simultaneously, we made a crucial technological shift. We rewrote our
Playwright functions in JavaScript and integrated them via Model Context
Protocol (MCP). This is where Cangjie Magic truly began to shine - the
framework provided seamless interaction capabilities with our JavaScript
tools, dramatically improving performance and flexibility.

### Phase 4: The Vision Experiment

Despite improvements, we encountered a fundamental problem: the planner
lacked contextual awareness of the current webpage state. To address
this, our team split into three groups, each exploring different
architectural approaches:

Vision-Only Approach: This system continuously captured browser
screenshots, overlaying highlighted boxes around clickable elements with
indexed labels. While innovative, dense websites created overlapping
boxes and visual clutter that obscured important information, making
this approach impractical as a primary solution.

Enhanced Multi-Agent System: We refined the planner-executor
communication protocols and attempted to provide contextual feedback.
However, the fundamental context gap persisted, leading to execution
failures and insufficient attention to goal achievement details.

Single Agent with Memory: This approach would ultimately prove
transformative.

## The Breakthrough: Single Agent with Enhanced Memory

Our final architecture represented a return to simplicity, but with
sophisticated memory management. The single agent now maintained
comprehensive memory of previous actions, enabling it to:

- Understand previously attempted steps

- Identify completed objectives

- Make accurate decisions about goal achievement

- Avoid repetitive action loops


Memory manager which includes list of classes implementing interface Action.
```cangjie
public class MemoryManager <: ToString
{
    var stepsCompleted: ArrayList<Action>
    var manualMemory:  String
    var end: Int64

    public MemoryManager(){
        stepsCompleted = ArrayList<Action>([])
        manualMemory = ""
        end = 0
    }

    public func addClick(resultingUrl: String, itemClicked: String, inputText: String, result: Bool){
        stepsCompleted.add(Click(resultingUrl,itemClicked,inputText,result))
    }

    public func addURLNavigator(resultingUrl: String){
        stepsCompleted.add(UrlNavigation(resultingUrl))
    }

    public func addBack(resultingUrl: String){
        stepsCompleted.add(Back(resultingUrl))
    }

    public func addFileUpload(nameOfTheFileUploaded: String){
        stepsCompleted.add(FileUpload(nameOfTheFileUploaded))
    }

    public func addExtraAgent(subGoal: String, executionResult: String){
        stepsCompleted.add(ExtraAgent(subGoal, executionResult))
    }

    public func addScreenshotterCall(response: String){
        stepsCompleted.add(ScreenshotterCall(response))
    }

    public func addCaptchaInteruption(){
        stepsCompleted.add(CaptchaInteruption())
    }

    public func toString(): String{
        var out: String = "List of previous completed steps: \n "
        for(ind in Range(end ,Int64(stepsCompleted.size-1),1,true,true,true)){
            let action = stepsCompleted[ind]
            manualMemory += "Operation number ${ind}: ${action}\n"
        }
        end = stepsCompleted.size
        return "List of previous completed steps: \n ${manualMemory}"
    }

    public func back(): String{
        if(stepsCompleted.isEmpty()){
            return "No previous steps"
        }else{
            return stepsCompleted[stepsCompleted.size-1].toString()
        }
    }
}
```

Action interface
```cangjie
open class Action <: ToString {
    public open func toString(): String{
        return "blank"
    }
}
```

And example implementation of Action interface on class Click
```cangjie
class Click  <: Action
{
    public Click(let resultingUrl: String, let itemClicked: String, let inputText: String, let result: Bool){}

    public func success(): String{
        var formatted: String = "Clicked: ${itemClicked}"
        if(!(inputText.isEmpty())) { formatted += " and filled with text `${inputText}`" }
        formatted += ". Resulting URL ${resultingUrl}."
        return formatted
    }

    public func fail(): String{
        let formatted: String = "Failed To click and fill: ${itemClicked}, item is not a fillable field, attempted to fill with ${inputText}"
        return formatted
    }

    public func toString(): String{
        if(result){
            return this.success()
        }else{
            return this.fail()
        }
    }
}
```

## Cangjie Magic: The Game Changer

This is where Cangjie Magic demonstrated its exceptional capabilities:

Structured Response Control: Cangjie Magic enabled us to query agents
and enforce JSON-formatted responses, allowing us to encode goal
completion status as boolean values while capturing the agent's
decision-making rationale.

Tool Management: The framework provided granular control over which MCP
server tools were available to each agent through Cangjie wrapper tools.
This architectural pattern proved crucial for our memory system
implementation.

Memory Integration: By creating Cangjie Magic wrapper tools that
mirrored our MCP server tools, we could update our memory class after
every interaction, maintaining perfect state consistency.

Terminal Actions: Perhaps most importantly, Cangjie Magic's ability to
convert tools into terminal actions was revolutionary. This feature
ensured that after each execution, the agent would exit the current
request, enabling our incremental, memory-driven architecture to
function correctly.


## JavaScript Integration: Powering Real-Time Browser Interaction

While the Cangjie Magic framework formed the architectural backbone of MagicExplorer, our JavaScript interaction layer provided the essential capabilities that made autonomous browser control possible.

### What the JavaScript Does

Our JavaScript code acts as the **hands and eyes** of the AI agent in the browser. It allows us to:

- Inject JS into web pages for scraping DOM elements
- Click buttons, fill out forms, select from dropdowns
- Highlight elements (for the vision agent)
- Handle tabs and solve simple CAPTCHAs

We built this system using **Playwright**, which allowed us to programmatically control and inject JavaScript into websites in a way that mimics user interaction.

### Architecture: MCP Server and Tool Abstraction

The browser interaction logic is abstracted through an **MCP (Model Context Protocol) server**. The idea is simple but powerful: we expose JavaScript functions as "tools" with descriptive metadata. The AI agent doesn’t need to know how they work internally - it just receives a list of available tools, their descriptions, and how to call them.

The AI sends a JSON request to the MCP server, specifying which tool to call and with what arguments. The server then triggers the correct JS function and returns the result, again as JSON. This modular abstraction allowed the backend and AI agent to evolve independently.

### Development Journey: From Monolith to Modular

Initially, everything - scraping logic, Playwright control, and tool definitions - was lumped into a single file. As the project grew, this quickly became unmanageable.

We evolved the structure into **modular components**, each encapsulating a specific capability. Here's what it looks like now:

Each folder (e.g., `clickingTools`, `scrapingTools`, `visionTools`) contains logically grouped functionality. At the center is `browserManager.js`, which holds instances of all tool classes and binds tool names to function references for the MCP server.

This architecture made the system:

- Easier to maintain
- Simpler to debug
- Straightforward to extend

### Scraping: The Balancing Act

Scraping turned out to be the trickiest part. At first, we tried scraping **everything** on a page - but this overwhelmed the agent with irrelevant elements. So we narrowed the scope to just **buttons, search bars, and links**, giving the agent just enough to reason over.

Later, we refined our approach to **filter visible and semantically relevant elements**, using CSS selectors and heuristics. We avoided generic `<div>` elements unless they had meaningful roles. This reduced noise and improved performance dramatically.

### Handling the Real Web: Tabs, CAPTCHAs, and Failures

Web automation isn’t just about clicks - real websites introduce complications:

- **Tabs:** Some buttons open links in new tabs. We had to handle tab switching explicitly using Playwright’s APIs.
- **CAPTCHAs:** We integrated a CAPTCHA handler that detects image-based CAPTCHAs and sends them to our vision agent for decoding.
- **Iframes:** These remain a limitation. Our JS injection architecture cannot reach into cross-origin iframes, so websites like Google Docs don’t work.

Whenever an action fails - whether due to a missing element or an unexpected structure - we catch the error and return it to the agent. This allows it to **replan or retry** intelligently.

### Simplicity Over Realism

Unlike some automation platforms, we didn’t aim to mimic human behavior (like mouse movements or slow typing). Instead, we focused on **functional control**, simulating clicks and inputs directly using Playwright.

### What We're Proud Of

One of the most satisfying outcomes was making **scraping actually useful**. Initially, we feared the agent would always be flooded with junk. But by iterating on our selectors and filtering logic, we achieved highly accurate, semantically meaningful extractions.

Another highlight was the CAPTCHA solver integration and our ability to handle real-world browsing tasks like account registration, email verification, and even file uploads - all programmatically.

### Reflections

If we could go back, we’d start with this modular architecture from day one. But hindsight is 20/20. We learned a lot from evolving the system organically, identifying pain points, and improving based on real use cases.

Right now, our biggest areas for future improvement include:

- Better support for scrolling and lazy-loaded content
- Handling cross-origin iframes

### Final Thoughts

Our JavaScript layer abstracts complex browser interactions into simple, AI-callable tools. The result is a powerful agent that can interpret a goal, plan steps, and take real actions inside the browser - all thanks to a robust and well-designed JavaScript interaction layer.


## Advanced Features and Hybrid Intelligence

Our final system incorporated sophisticated capabilities:

- File Upload Support: Seamless handling of file uploads across different
websites 
- Tab Management: Dynamic tab switching and spawning of new
browser instances 
- Subtask Delegation: Agents could create specialized
instances for specific subgoals (particularly valuable for handling
confirmation codes during authentication flows)

## Vision Agent Integration

We repurposed our earlier vision system as an intelligent fallback
mechanism. When semantic information from scraped elements proves
insufficient, the executor can consult the vision agent for guidance.
This hybrid approach provides several advantages:

Dense Information Processing: The vision system can process more
comprehensive webpage information without token limitations

Element Discovery: Ability to interact with elements that were filtered
out during optimization

Adaptability: Enhanced performance on poorly designed websites without
sacrificing efficiency on standard sites

## Results and Impact

MagicExplorer successfully demonstrates autonomous web navigation across
a diverse range of tasks. The system can handle complex workflows
including:

- Multi-step authentication processes

- Form submissions and file uploads

- Cross-tab navigation and coordination

- Dynamic content interaction

- Goal verification and completion confirmation

## Lessons Learned

This project reinforced several key principles:

- Simplicity Over Complexity: Our most successful architecture was
ultimately the simplest, enhanced with sophisticated state management

- Framework Integration: Cangjie Magic's capabilities were essential to
our success, providing the precise control needed for complex agent
orchestration

- Iterative Design: Each architectural iteration taught us valuable
lessons that informed our final solution

- Hybrid Intelligence: Combining different AI approaches (semantic and
visual) created a more robust and adaptable system

## Future Directions

While MagicEplorer successfully completes a wide variety of tasks, we
acknowledge that certain web pages and interaction patterns remain
challenging. Our extensible architecture provides a solid foundation for
continuous improvement through:

- Enhanced tool integration

- Improved error handling and recovery

- Advanced visual processing capabilities

- Broader website compatibility testing

## Conclusion

This project has shown that building successful AI agents demands more than just powerful models - it also requires robust frameworks that enable precise control and seamless integration.

Our evolution from an initial FFI-based prototype to a hybrid architecture highlights the value of iterative development, architectural adaptability, and a strong tooling foundation. As we continue to enhance MagicExplorer's capabilities, we're excited by the opportunities that lie ahead.

