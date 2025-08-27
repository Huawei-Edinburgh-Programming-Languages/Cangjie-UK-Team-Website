import { Utils } from "./tableOfContents.js"


let allProjectsRaw = []
let allProjects = []
let showingAll = false
const INITIAL_DISPLAY_COUNT = 6

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

    // Create authors string
    const authorsText =
    project.authors.length > 1 ? `Authors: ${project.authors.join(", ")}` : `Author: ${project.authors[0]}`

    projectCard.innerHTML = `
    <h3>${project.name}</h3>
    <p>${authorsText}</p>
    <p class="project-date">Updated: ${project.date}</p>
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
