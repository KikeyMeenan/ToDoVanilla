const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const config = require('./webpack.config.js');
const path = require('path');
var fs = require('fs');
const bodyParser = require('body-parser');
const {
    promisify
} = require('util')
const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)
const {
    Client
} = require('pg');

const app = express();
const port = 8080;

const compiler = webpack(config);

let client;

//move this into local env var
const connectionString = process.env.DATABASE_URL ? process.env.DATABASE_URL : 'postgresql://postgres:hwaaw488@localhost:5432/todo'

const connectNewClient = () => {
    client = new Client({
        connectionString
    });

    client.connect(err => {
        if (err) {
            console.error('connection error', err.stack)
        } else {
            console.log('connected')
        }
    })
}



app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//Enable "webpack-dev-middleware"
app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
}));

app.use(express.static('./public'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
})

app.get('/create', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/create.html'));
});

app.get('/categories/list', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/categories.html'));
})

app.get('/categories/create', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/createCategory.html'));
})

//extract all this api stuff
app.get('/items', async function (req, res) {
    connectNewClient()

    client.query(itemsDisplayQuery, (clientErr, clientRes) => {
        if (clientErr) throw clientErr;
        if (clientRes.rows == null || clientRes.rows.length < 1) {
            //handle no rows
        }
        const mappedItems = clientRes.rows.map(mapItemDisplay);
        client.end();
        res.json(mappedItems)
    });
});

const itemsDisplayQuery = `
SELECT 
items.id as item_id,
items.name as item_name,
items.complete,
items.priority,
items.description,
items.effort,
items."completeBy",
items."categoryId" as item_categoryid,
categories.id as category_id,
categories.name as category_name
FROM items INNER JOIN categories ON items."categoryId" = categories.id;
`

//could really do with a way of testing this stuff?
app.post('/item', async function (req, res) {
    //handle errors from this

    const newItem = req.body;
    connectNewClient()

    client.query(
        `INSERT INTO items(name, complete, priority, "categoryId", description, effort, "completeBy") 
        VALUES('${newItem.Name}', '${newItem.Complete ? '1' : '0'}', '${newItem.Priority.toString()}', '${newItem.CategoryId.toString()}', '${newItem.Description}', '${newItem.Effort.toString()}', ${newItem.CompleteBy != "" ? `'${newItem.CompleteBy}'` : null })`, (clientErr, clientRes) => {
            if (clientErr) {
                //do all this error handling better!
                res.send(500);

                console.log(clientErr.stack)
                client.end();
            } else {
                client.end();
                res.send(clientRes);
            }
        })
});

app.put('/toggleItemComplete', async function (req, res) {
    //handle errors from this
    connectNewClient()
    
    client.query(
        `UPDATE items SET complete = '${req.body.isComplete ? '1' : '0'}'
         where id = ${req.body.completedItemId.toString()}`, (clientErr, clientRes) => {
            if (clientErr) {
                client.end();

                //do all this error handling better!
                res.send(500);

                console.log(clientErr.stack)
            } else {
                client.end();
                res.send(clientRes);
            }
        })
});

app.delete('/item', async function (req, res) {
    //handle errors from this

    connectNewClient()

    client.query(
        `DELETE from items where id = ${req.body.Id.toString()}`, (clientErr, clientRes) => {
            if (clientErr) {
                client.end();

                //do all this error handling better!
                res.send(500);

                console.log(clientErr.stack)
            } else {
                client.end();
                res.send(clientRes);
            }
        })
});

app.get('/categories', async function (req, res) {
    connectNewClient()

    client.query('SELECT * FROM categories;', (clientErr, clientRes) => {
        if (clientErr) throw clientErr;
        if (clientRes.rows == null || clientRes.rows.length < 1) {
            //handle no rows
        }
        const mappedCategories = clientRes.rows.map(mapCategory);
        client.end();
        res.json(mappedCategories)
    });
});

app.post('/category', async function (req, res) {
    //handle errors from this

    const newCategory = req.body;
    connectNewClient()

    client.query(
        `INSERT INTO categories(name) 
        VALUES('${newCategory.Name}')`, (clientErr, clientRes) => {
            if (clientErr) {
                //do all this error handling better!
                res.send(500);

                console.log(clientErr.stack)
                client.end();
            } else {
                client.end();
                res.send(clientRes);
            }
        })
});

const mapItemDisplay = (item) => {
    return {
        "Id": item.item_id,
        "Name": item.item_name,
        'Complete': item.complete == "1" ? true : false,
        'Priority': item.priority,
        'Description': item.description,
        'Effort': item.effort,
        'CompleteBy': item.completeBy,
        'CategoryId': item.item_categoryid,
        'CategoryName': item.category_name
    };
}

const mapCategory = (category) => {
    return {
        "Id": category.id,
        "Name": category.name,
    };
}

app.listen(process.env.PORT || port, () => {
    console.log('Server started on port:' + port);
});