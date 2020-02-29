let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
const dotenv = require('dotenv');
const axios = require('axios')


dotenv.config();

var cors = require('cors')
app.use(cors())


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});



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

http.listen(5001, process.env.local,() => {
    console.log('Listening on port *: 5001');
});

var clients = [];

io.on('connection', (socket) => {

    // socket.emit('connections', Object.keys(io.sockets.connected).length);

     // console.log('user connected ID = '+  socket.id);
     //
     // console.log('Clientes conectados '+clients.length);
     //

        // let client_id = socket.id;
        // const data = { client_id: client_id};
        /*con.query('INSERT INTO server SET ?', data , function(err, result, fields) {
            if (err) {
                console.log(err);
            }else{
                // Your row is inserted you can view
                console.log('Registro de conecção inserido no banco ID = '+result.insertId);
            }
        }); // fechando a conexão
        */




    //Removing the socket on disconnect
    socket.on('disconnect', function() {
        for(var name in clients) {
            if(clients[name].socket === socket.id) {
                delete clients[name];
                break;
            }
        }
    })

    // socket.on('chat-message', (data) => {
    //     socket.broadcast.emit('chat-message', (data));
    // });
    //
    // socket.on('typing', (data) => {
    //     socket.broadcast.emit('typing', (data));
    // });
    //
    // socket.on('stopTyping', () => {
    //     socket.broadcast.emit('stopTyping');
    // });
    //
    // socket.on('leave', (data) => {
    //     socket.broadcast.emit('leave', (data));
    // });

    socket.on('add-user', function(data){
        clients[data] = {
            "socket": socket.id
        };
        console.log(clients);
    });

    socket.on('private-message', function(data){


        async function getcliente() {
            // pegar email do remetente
            var headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Authorization': "Bearer "  + data.token
            };
            var fraude = false;

            await axios.get('http://localhost:8000/api/user', { headers })
                .then((res) => {
                    if(res.data.email === data.user) {
                        fraude = true;
                    }
                })
                .catch((error) => {
                    console.error(error)
                })

            return fraude;
        }

        fraude = getcliente();

        if(fraude) {
            if(typeof clients[data.toUser] != 'undefined' && typeof clients[data.toUser].socket != 'undefined') {
                io.sockets.connected[clients[data.toUser].socket].emit("chat-message", data);
                console.log('enviando mensagem e gravando no banco')
            } else {
                // so grava no banco o cliente esta offline ou ainda nucna entrou no chat
                console.log('gravando no banco')
            }
        } else {
            console.log('tentativa de fraude')
        }

    });


//con.end((err) => {
 //console.log('DB Disconect');
//});

});
