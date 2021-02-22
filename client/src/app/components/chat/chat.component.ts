// Angular libraries
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

// Models
import { User } from 'src/app/models/user';
import { Message } from 'src/app/models/message';

// Services
import { WebSocketService } from '../../services/web-socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  userChat: User = new User();

  myMessages: any;

  eventName: string = 'send-message';

  inputName: string = '';

  usersCounter:any = 0;

  inputMessage: string = '';

  constructor(
    private _activatedRouter: ActivatedRoute,
    private _webSocketService: WebSocketService,
    private _router: Router
  ) {
    // Update users' quantity
    this._webSocketService.getTotalUsers();
  }

  ngOnInit(): void {

    // Get the ID from URL param
    this.userChat.id = this._activatedRouter.snapshot.params.id;
    // Get name from Query Params extracted of URL
    this.userChat.name = this._activatedRouter.snapshot.queryParams.name;
    // The input should show the current user's name, because the user can change it
    this.inputName = this.userChat.name

    // Set a listener to update messages on server
    this._webSocketService.listen('text-event').subscribe( data => 
      {
        this.myMessages = data;
      }
    )

    // Watch the observable which indicate the users quantity on server
    this._webSocketService.counterUser.subscribe( counter => {
      this.usersCounter = counter
    })

    // This emit is to show the current messages on server
    this._webSocketService.emit(this.eventName, null)

  }

  // Push the message wrote for user to the server
  myMessage(){
    // Create the message
    let userMessage: Message = new Message();
    userMessage.id = this.userChat.id;
    userMessage.text = this.inputMessage;
    userMessage.user = this.userChat.name;

    // Emit the event 'send-message' with data to be pushed
    this._webSocketService.emit(this.eventName, userMessage);
    // Clean the input
    this.inputMessage = '';
    // Update users' quantity
    this._webSocketService.getTotalUsers();
  }

  // Funcion para cambiar el nombre de los mensajes enviados
  changeName(){
    // Generate the data {previous_user_name: Data to make the comparison, new_user_name: Data which is gonna replace the current name}
    let data = {previous_user_name: this.userChat.id, new_user_name: this.inputName}
    // Emit the event
    this._webSocketService.emit('change-messages', data);
    // Update the input with the new user name
    this.userChat.name = this.inputName;
    // Update users' quantity
    this._webSocketService.getTotalUsers();
    // Change URL
    this._router.navigate(
      [`/chat/${this.userChat.id}`],
      { queryParams: { name: this.userChat.name } }
    )
  }

}
