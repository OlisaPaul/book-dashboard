import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

describe('Books GraphQL (e2e)', () => {
  let app: INestApplication;

  // Mock Auth0 token for testing
  const mockToken = 'mock-jwt-token';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('books query', () => {
    it('should return unauthorized without token', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: '{ books { id name description } }',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
          expect(res.body.errors[0].extensions.code).toBe('UNAUTHENTICATED');
        });
    });

    // Note: This test would require a valid Auth0 token or mocking the AuthGuard
    it.skip('should return books with valid token', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          query: '{ books { id name description } }',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.books).toBeDefined();
          expect(Array.isArray(res.body.data.books)).toBe(true);
        });
    });
  });

  describe('createBook mutation', () => {
    it('should return unauthorized without token', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation {
              createBook(input: { name: "Test Book", description: "Test Description" }) {
                id
                name
                description
              }
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
          expect(res.body.errors[0].extensions.code).toBe('UNAUTHENTICATED');
        });
    });
  });

  describe('updateBook mutation', () => {
    it('should return unauthorized without token', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation {
              updateBook(id: 1, input: { name: "Updated Book" }) {
                id
                name
                description
              }
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
          expect(res.body.errors[0].extensions.code).toBe('UNAUTHENTICATED');
        });
    });
  });

  describe('deleteBook mutation', () => {
    it('should return unauthorized without token', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation {
              deleteBook(id: 1)
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
          expect(res.body.errors[0].extensions.code).toBe('UNAUTHENTICATED');
        });
    });
  });
});
