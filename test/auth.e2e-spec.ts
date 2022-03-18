import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { disconnect } from 'mongoose';
import { AuthDto } from 'src/auth/dto/auth.dto'

const loginDto: AuthDto = {
  login: 'a@a.aa',
  password: 'fedka' 
}

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) - SUCCESS', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200)
      .then(({ body }: request.Response) => {
        token = body.access_token;
        expect(token).toBeDefined();
      })
  });

  it('/auth/login (POST) - FAIL', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({...loginDto, password: 'ass'})
      .expect(401, {
        "statusCode": 401,
        "message": "Неправильный пароль",
        "error": "Unauthorized"
      })
  });

  it('/auth/login (POST) - FAIL', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send()
      .expect(400, {
        "statusCode": 400,
        "message": [
          "login must be a string",
          "password must be a string"
        ],
        "error": "Bad Request"
      })
  });

  afterAll(() => {
    disconnect()
  })
});
