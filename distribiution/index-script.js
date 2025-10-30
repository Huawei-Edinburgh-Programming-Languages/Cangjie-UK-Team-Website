import { Utils } from "./tableOfContents.js"


let allProjectsRaw = []
let allProjects = []
let showingAll = false
const INITIAL_DISPLAY_COUNT = 6

function formatDateForDisplay(dmy)
{
    // Expecting DD/MM/YYYY
    const [d, m, y] = dmy.split("/")
    const date = new Date(Number(y), Number(m) - 1, Number(d))
    const fmt = new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
    return fmt.format(date)
}

async function loadProjects() 
{
    const response = await fetch("projectInformation.json")
    allProjectsRaw = await response.json()
    allProjects = Utils.copyAndSort(allProjectsRaw) ;
    displayProjects()
}

function displaySingleProject(project, projectsContainer)
{
    const projectCard = document.createElement("div")
    projectCard.className = "project-card"

    const tags = Array.isArray(project.tags) ? project.tags : []
    const description = project.description || ""
    // authors/date intentionally omitted per design

    projectCard.innerHTML = `
    <h3>${project.name}</h3>
    ${description ? `<p class="project-summary">${description}</p>` : ""}
    ${tags.length ? `<div class="project-tags">${tags.map(t => `<span class="tag">${t}</span>`).join(" ")}</div>` : ""}
    <a href="projectTemplate.html?id=${allProjectsRaw.indexOf(project)}" class="project-link">View Project →</a>
    `
    projectsContainer.appendChild(projectCard)
}

function displayProjects() 
{
    const projectsContainer = document.getElementById("projects-container")
    const showMoreContainer = document.getElementById("show-more-container")

    projectsContainer.innerHTML = ""

    const projectsToShow = showingAll ? allProjects : allProjects.slice(0, INITIAL_DISPLAY_COUNT)

    for(const project of projectsToShow) displaySingleProject(project, projectsContainer) ;

    if (allProjects.length > INITIAL_DISPLAY_COUNT) 
    {
        showMoreContainer.style.display = "block"
        const showMoreBtn = document.getElementById("show-more-btn")
        showMoreBtn.textContent = showingAll
        ? "Show Less"
        : `Show More (${allProjects.length - INITIAL_DISPLAY_COUNT} more)`
    } 
    else 
    {
        showMoreContainer.style.display = "none"
    }
}

function toggleShowMore() 
{
    showingAll = !showingAll
    displayProjects()
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  loadProjects()
})

window.toggleShowMore = toggleShowMore
