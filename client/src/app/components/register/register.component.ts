// Angular imports
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// External libraries
import { UUID } from 'angular2-uuid';

// Models
import { User } from 'src/app/models/user';

// Services
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  user: User = new User();

  constructor(
    private _webSocketService: WebSocketService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    // Generate the user id
    this.user.id = UUID.UUID();
  }

  joinChat(){
    // Change URL to /chat sending user.id like parameter and user.name like Query Param
    this._router.navigate(
      [`/chat/${this.user.id}`],
      { queryParams: { name: this.user.name } }
    )
  }

  randomName(){

    // Generate a number between 1 and 10, becuase the page wich has the JSON just has 10 users availables
    let randomNumber = Math.floor(Math.random() * 10) + 1;
    //  Execute the method wich return the random name
    this._webSocketService.getData(randomNumber).subscribe(
      result => {
        // Change URL to /chat sending user.id like parameter and the random name(result) like Query Param
        this._router.navigate(
          [`/chat/${this.user.id}`],
          { queryParams: { name: result } }
        )
      }
    )
    
  }

}
