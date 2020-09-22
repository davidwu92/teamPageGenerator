//software engineering team member PAGE GENERATOR
const inquirer = require("inquirer")
const path = require("path") //makes file and directory paths consistent across operating systems.
const fs = require("fs") //lets us work with files on this computer.

//resolve: creates an absolute path for the "output" directory. Returns "currentfiledir/output".
const outputDir = path.resolve(__dirname, "output");
//join: joins strings into a path specific to OS. Returns currentfiledir/output/team.html
const outputPath = path.join(outputDir, "team.html");

const templatesDir = path.resolve(__dirname, "templates")

let members = [] //objects: {name, email, github, id, role, moreMembers}

const newMember = ()=>{
  console.log("Add a team member.")
  inquirer.prompt([
    {type:"input", name:"name", message:"Team member's name?"},
    {type:"input", name:"email", message:"Team member email?"},
    {type:"input", name:"github", message:"Team member github username?"},
    {type:"input", name:"id", message:"Team member id?"},
    {type:"list", choices:["Manager", "Engineer", "Intern"], name:"role", message:"What's their role at your organization?"},
    {type:"list", choices:["Yes", "No"], name:"moreMembers", message:"Do you have any more members to add?"}
  ])
    .then(res=>{
      members.push(res);
      console.log(members)
      res.moreMembers == "Yes" ? newMember() : buildTeam();
    })
}

const buildTeam = ()=>{  //builds the team using array of members.
  if (!fs.existsSync(outputDir)) { //if the output directory doesn't exist, make it.
    fs.mkdirSync(outputDir)
  }
  fs.writeFileSync(outputPath, renderMain(members), "utf-8"); //writes the main.html file using utf-8.
  console.log("Done!")
}

const renderMain = (teamArray)=>{ //renders main.html
  let teamCards = renderTeam(teamArray)
  let mainHtml = fs.readFileSync(path.resolve(templatesDir, "main.html"), "utf-8")
  mainHtml = replacePlaceholders(mainHtml, "team", teamCards)
  return mainHtml
}

const renderTeam = (teamArray) =>{ //uses memberCard.html templates
  let teamCards = []
  teamArray.forEach(member=>{
    let template = fs.readFileSync(path.resolve(templatesDir, "memberCard.html"), "utf8"); //string of team template
    template = replacePlaceholders(template, "name", member.name)
    template = replacePlaceholders(template, "id", member.id)
    template = replacePlaceholders(template, "role", member.role)
    template = replacePlaceholders(template, "github", member.github)
    template = replacePlaceholders(template, "email", member.email)
    switch (member.role){
      case "Manager":
        template = replacePlaceholders(template, "icon", `<i class="material-icons">free_breakfast</i>`)
        teamCards.unshift(template)
        break;
      case "Engineer":
        template = replacePlaceholders(template, "icon", `<i class="material-icons">settings</i>`)
        teamCards.push(template)
        break;
      case "Intern":
        template = replacePlaceholders(template, "icon", `<i class="material-icons">local_library</i>`)
        teamCards.push(template)
        break;
    }
  })
  return teamCards.join("")
}

const replacePlaceholders = (template, placeholder, value)=>{
  const pattern = new RegExp("{{"+placeholder+"}}", "gm");
  return template.replace(pattern, value);
}



newMember()