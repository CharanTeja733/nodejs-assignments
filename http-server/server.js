// start creating server here
//Your task is to create a TODO backend using the Node.js core `http` module. You will build a basic web server capable of handling different HTTP methods and routes to manage a list of Todo items.
import http from 'http';
import url from 'url';

let todos = [];
let id = 1;

http.createServer(function(req, res) {
     const urlParts = url.parse(req.url, true); 
     const pathname = urlParts.pathname;
     const queryData = urlParts.query;

    
    if(req.method === 'GET'&& pathname === '/') {
        res.writeHead(200, {'Content-Type': 'text/plain'})
        res.end('Hello World');
    } else if(req.method === 'GET'&& pathname === '/todos') {
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(JSON.stringify(todos));
    } else if( req.method === 'GET'&& pathname === '/todo') {
        const findId =  parseInt(queryData.id);

        if(isNaN(findId)) {
            res.writeHead(404);
            res.end()
            return;
        }

        const index = todos.findIndex(todo => todo.id === findId);

        if(index === -1) {
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: 'Todo not found'}))
            return;
        }

        const todo = todos[index];

        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(JSON.stringify(todo));
        
    } else if(req.method === 'POST' && pathname === '/create/todo') {
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            try {
                const todo = JSON.parse(body);
                 todo.id = id++;

                todos.push(todo);

                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(todos));
            } catch (err) {
                res.writeHead(400);
                res.end('Invalid JSON');
            }        
        });
    } else if(req.method === 'DELETE' && pathname === '/todo')  {
        const deleteId = parseInt(queryData.id);

        if(isNaN(deleteId)) {
            res.writeHead(404);
            res.end()
            return;
        }
        const index = todos.findIndex(todo => todo.id === deleteId);
        if(index === -1) {
            res.writeHead(404);
            res.end()
            return;
        }

        todos.splice(index, 1);
        res.writeHead(200)
        res.end()

    } else {
        res.writeHead(404);
        res.end();
    }    
})
.listen(3000, () => console.log('server is running on port 3000'));
