let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

var options = {
  hostname: 'localhost',
  port: 8000,
  path: '/api/user',
  method: 'GET',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json',
  }
};

/*
const mysql = require('mysql');

// First you need to create a connection to the db
const con = mysql.createConnection({
    host: '213.190.6.43',
    user: 'u745336311_flemu',
    password: '1970497humel',
    database: 'u745336311_larav',
    multipleStatements: true
});
con.connect((err) => {
    if(err){
        console.log('Error connecting to Db');
        return;
    }
    console.log('Connection established');
});
*/

http.listen(5001, '0.0.0.0', () => {
    console.log('Listening on port *: 5001');
});

var clients = [];

io.on('connection', (socket) => {

    // socket.emit('connections', Object.keys(io.sockets.connected).length);

     console.log('user connected ID = '+  socket.id);

     console.log('Clientes conectados '+clients.length);


    try {
        let client_id = socket.id;
        const data = { client_id: client_id};
        /*con.query('INSERT INTO server SET ?', data , function(err, result, fields) {
            if (err) {
                console.log(err);
            }else{
                // Your row is inserted you can view
                console.log('Registro de conecção inserido no banco ID = '+result.insertId);
            }
        }); // fechando a conexão
        */
    } catch (err) {
        console.log(err);
    }



    //Removing the socket on disconnect
    socket.on('disconnect', function() {
        for(var name in clients) {
            if(clients[name].socket === socket.id) {
                delete clients[name];
                break;
            }
        }
    })

    socket.on('chat-message', (data) => {
        socket.broadcast.emit('chat-message', (data));
    });

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', (data));
    });

    socket.on('stopTyping', () => {
        socket.broadcast.emit('stopTyping');
    });

    socket.on('joined', (data) => {
         clients[socket.id].push(data['socket']);
        socket.broadcast.emit('joined', (data));
    });

    socket.on('leave', (data) => {
        socket.broadcast.emit('leave', (data));
    });
    socket.on('add-user', function(data){
        console.log('adicionando', data);
        clients[data] = {
            "socket": socket.id
        };
        console.log(clients[data]);

    });

    socket.on('private-message', function(data){
        io.sockets.connected[clients[data.toUser].socket].emit("chat-message", data);
    });


//con.end((err) => {
 //console.log('DB Disconect');
//});

});
