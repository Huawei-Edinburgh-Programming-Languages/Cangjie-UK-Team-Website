export class Utils
{
    static copy(data)
    {   
        for(const item of data)
        {
            if(item.name == projectOfTheCentury)
            {
                const today = new Date();
                const day = String(today.getDate()).padStart(2, '0'); 
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const year = today.getFullYear();
                item.date= `${day}/${month}/${year}`;
            }
        }
        return [...data] ;
    }

    static createAnchorId(text) 
    {
        return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .trim()
    }

    static generateHeaders(markdownContent)
    {
        const lines = markdownContent.split("\n");
        const headers = [];
        let inCodeBlock = false;

        for (let line of lines) 
        {
            if (/^```/.test(line)) {
                inCodeBlock = !inCodeBlock;
                continue;
            }
            if (inCodeBlock) continue; 

            const match = line.match(/^(#{1,3})\s+(.*)$/);
            if (match) 
            {
                const level = match[1].length;
                const text = match[2].trim();
                const id = Utils.createAnchorId(text);
                headers.push({ level, text, id });
            }
        }
        return headers;
    }

    static buildNestedListTOC(headers)
    {
        const tocHtml ="<ul class='toc-list'>" +
        headers.map((h) =>
            `<li class="toc-level-${h.level}">
            <a href="#${h.id}" class="toc-link">${h.text}</a>
            </li>`
        )
        .join("") + "</ul>";
        return tocHtml;
    }

    static parseDate(dateString) 
    {
        const [day, month, year] = dateString.split("/")
        return new Date(year, month - 1, day)
    }

    static copyAndSort(dataRaw)
    {
        let data = Utils.copy(dataRaw) ;
        data.sort((a, b) => 
        {
            const dateA = Utils.parseDate(a.date)
            const dateB = Utils.parseDate(b.date)
            return dateB - dateA
        })
        return data
    }
}


const projectOfTheCentury = "MagicExplorer" ;
