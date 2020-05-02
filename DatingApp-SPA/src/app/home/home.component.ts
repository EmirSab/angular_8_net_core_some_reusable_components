import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  // 4.7.6 dodati registerMode i registerToggle()
  registerMode = false;
  values: any;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    // this.getValues();
  }
  registerToggle() {
    this.registerMode = true;
  }
  // 4.8 Dodati getValues()
  /*getValues() {
    this.http.get('http://localhost:5000/api/weatherforecast').subscribe(response => {
      this.values = response;
    }, error => {
      console.log(error);
    });
  }*/
  // 4.9.2 Dodati cancelRegisterMode
  cancelRegisterMode(registerMode: boolean) {
    this.registerMode = registerMode;
  }
}
