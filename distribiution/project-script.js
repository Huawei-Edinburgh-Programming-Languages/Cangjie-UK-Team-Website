import { Utils } from "./tableOfContents.js";


class BlogWebsite
{
    constructor()
    {
        this.blogId = 0 ;
        this.projectName = "Example" ;
        this.projectRepoLink = "https://www.example.com/" ;
        this.authors = [] ;
        this.init() ;
    }

    async init()
    {
        this.getBlogId() ;
        await this.loadProjectInformation() ;
        await this.loadTableOfContents() ;
        await this.loadBlog() ;
        this.setUpEventListeners() ;
    }  

    getBlogId()
    {
        const urlParams = new URLSearchParams(window.location.search) ;
        const idParam = urlParams.get("id") ;
        this.blogId = Number.parseInt(idParam,10) || 0 ;
    }

    async getProjectInformation()
    {
        const response = await fetch("projectInformation.json") ;

        const projectInformationList = await response.json() ;
        if(projectInformationList.length <=this.blogId) throw new Error("Incorrect project Id.") ;
        const projectInformation = projectInformationList[this.blogId] ;

        /// getting rid of underscores for spaces
        this.projectName = projectInformation.name ;
        this.projectRepoLink = projectInformation.repoLink ;
        this.authors = projectInformation.authors ;
    }

    loadProjectName()
    {
        const projectNameElement = document.getElementById("project-name") ;
        const temp = this.projectName.replace(/_/g," ") ;
        projectNameElement.textContent = `Welcome to ${temp}!` ;
    }

    loadRepoLink()
    {
        const repoLinkElement = document.getElementById("repo-link") ;
        repoLinkElement.href = this.projectRepoLink ;
    }

    loadAuthorsList()
    {
        const authorsListElement = document.getElementById("authors-list") ;
        authorsListElement.innerHTML = this.authors
        .map((author) => `<span class="author-tag">${author}</span>`)
        .join("") ;
    }

    async loadProjectInformation()
    {
        await this.getProjectInformation() ;
        this.loadProjectName() ;
        this.loadRepoLink() ;
        this.loadAuthorsList() ;
    }

    setUpGoBackButton()
    {
        const goBackButton = document.getElementById("go-back-button") ;
        goBackButton.addEventListener("click", () => {
            window.location.href = "index.html" ;
        })
    }

    setUpEventListeners()
    {
        this.setUpGoBackButton() ;
    } 

    async loadBlog()
    {
        const blogContent = document.getElementById("blog-content") ;
        const response = await fetch(`blogsHTML/${this.projectName}.html`) ;
        if (!response.ok) throw new Error(`Blog ${this.projectName} not found`) ;
        blogContent.innerHTML = await response.text() ;
    }

    async loadTableOfContents()
    {
        const response = await fetch(`blogs/${this.projectName}.md`) ;
        if (!response.ok) throw new Error(`Blog ${this.projectName} not found`) ;
        const markdownContent = await response.text() ;

        const tocElement = document.getElementById("table-of-contents") ;
        const headers = Utils.generateHeaders(markdownContent) ;
        if (headers.length === 0) 
        {
            tocElement.innerHTML = '<p class="no-toc">No sections found</p>';
            return;
        }
        const tocHTML = Utils.buildNestedListTOC(headers) ;
        tocElement.innerHTML = `<nav class="toc">${tocHTML}</nav>`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
  new BlogWebsite()
})
