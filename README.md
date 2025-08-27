# Cangjie UK Team website

This website was create to represent open source Cangjie projects of Huawei research center. 


## How to add new project to the website?

You need to add another entry in the **projectInformation.json** file, and add a *.md* file with your blog about development of the project inside. The name in the *.json* file has to match the name of the *.md* file. 

In the .json file you should include:
- authors of the project
- gitcode repo link
- name of the project
- date of creation

After completing these steps, you have to run **scripts/preProcessing.js** file, to ensure that any code included in the blog is highlighted in a correct way. Then website will be completed. 