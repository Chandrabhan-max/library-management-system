import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

/* 
register - 

{
  "name": "Abhi",
  "email": "abhi@gmail.com",
  "password": "123456",
  "role": "ADMIN"
}

login - 

{
  "email": "abhi@gmail.com",
  "password": "123456"
}

*/
