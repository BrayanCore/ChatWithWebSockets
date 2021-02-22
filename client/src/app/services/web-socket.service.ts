// Angular Libraries
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// External libraries
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client'

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  socket: any;

  server = 'http://localhost:3000';

  // Observable with quantity users value
  counterUser = new Observable<any>();

  constructor(
    private http: HttpClient
  ) {
    this.socket = io(this.server)
  }

  listen(eventName: String): Observable<any> {
    return new Observable((Subscriber) => {
      this.socket.on(eventName, (data: any) => {
        Subscriber.next(data);
      })
    })
  }

  emit(eventName: String, data:any): void {
    this.socket.emit(eventName, data);
  }

  // Method to update the total users on server
  public getTotalUsers(): void {
    // Emit this event to update the quantity
    this.emit('number-users', null);
    // Update the observable
    this.counterUser =  this.listen('users-counter');
  }

  // Method to return a random name
  getData(user: number): Observable<string> {

    // URL which contain a JSON with users
    const url =`https://jsonplaceholder.typicode.com/users?id=${user}`
    // Subject to return the name
    var subject = new Subject<string>();
    
    // Execute the request
    this.http.get(url).subscribe((res: any)=>
      {
        /* 
        'res' is an array, so, the index should be especified, 
        but if we send the id like query param, res is an array with just 1 element
        */
        subject.next(res[0].name)
      }, (error) => {
        // If by some reason, the request fail, the default name will be just 'Guess'
        subject.next('Guess')
      }
    )

    // Return the random name
    return subject.asObservable();
  
  }

}
