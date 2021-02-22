'use strict'

const app = require('express')()
const serverHttp = require('http').Server(app)
const io = require('socket.io')(serverHttp)

var myMessages = [];

io.on('connection', 
    function(socket){
        socket.on('send-message', 
            function(data) {
                
                if (data !== null) {
                    myMessages.push(data)
                }
                
                socket.emit('text-event', myMessages)
                socket.broadcast.emit('text-event', myMessages)
            }
        )
        socket.on('change-messages',
            function(data){
                // Actualizamos los mensajes
                myMessages.forEach( message =>
                    {
                        if(message.id == data.previous_user_name){
                            message.user = data.new_user_name
                        }
                    }
                )
                // Los regresamos actualizados
                socket.emit('text-event', myMessages)
                socket.broadcast.emit('text-event', myMessages)
            }
        )
        socket.on('number-users',
            function(){
                console.log(io.eio.clientsCount)
                socket.emit('users-counter', io.eio.clientsCount)
                socket.broadcast.emit('users-counter', io.eio.clientsCount)
            }
        )
    }
)

serverHttp.listen(3000, () => {
    console.log(`server running on port: ${3000}`)
})