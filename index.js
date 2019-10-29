const express = require('express');
const server = express();
server.use(express.json());

let requisitions = 0;
var arrayIndex = -1;

const projects = [];

server.use((req, res, next) => {
   
    console.time('Request'); 
    console.log(`Método: ${req.method}; URL: ${req.url}`);
    console.log('Requisições do servidor: ', ++requisitions);

    next();
    
    console.timeEnd('Request');
});

// this middleware checks if the ID exists in the projects array
function checkIfProjecExists(req, res, next) {
    const { id } = req.params; 
    
    arrayIndex = projects.findIndex(pj => pj.id == id);

    if ( arrayIndex < 0 ) {          
        return res.status(400).json({error: 'Project does not exists'});
    }
    console.log('Index na function: ', arrayIndex);
    return next(); 
}

// this middleware checks if the ID exists in the array only for new projects 
function checkIfNewProjecExists(req, res, next) {
    const { id } = req.body;
    
    arrayIndex = projects.findIndex(pj => pj.id == id);

    if ( arrayIndex > -1 ) {          
        return res.status(400).json({error: `Project ${id} already exists`});
    }
    return next(); 
}

// GET /projects 
// this route lists all the projects and its tasks
server.get('/projects', (req, res) => {

    return res.json( projects);
});

// POST /projects 
// this route must receive an id e a title inside the body and register a new project inside the
// array on the following format: { id: "1", title: 'Novo projeto', tasks: [] }; 
server.post('/projects', checkIfNewProjecExists, (req, res) => {
    const {id, title} = req.body;

    projects.push( {id: id, title: title, tasks: []} );

    return res.json(projects);
});

// PUT /projects/:id 
// this route changes only the title of the project of the ID 
// encountered in the parameters of the route
server.put('/projects/:id', checkIfProjecExists, (req, res) => {
    const {title} = req.body;

    projects[arrayIndex].title = title;

    return res.json(projects);
});

// DELETE /projects/:id 
// this route erases the project with the ID send in the parameter
server.delete('/projects/:id', checkIfProjecExists, (req, res) => {

    projects.splice(arrayIndex, 1); 

    return res.send();
});

// POST /projects/:id/tasks 
// this route receives the field named title and save a new task in the 
// array os tasks tha exists indexed by the id number received in the 
// parameters  of the route
server.post('/projects/:id/tasks', checkIfProjecExists, (req, res) => {
    const {title} = req.body;

    projects[arrayIndex].tasks.push(title); 

    return res.json(projects);
});

server.listen(3100);