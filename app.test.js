import request from 'supertest';
import { jest } from '@jest/globals';
import app from './app.js';

// Variables for length of db and created users during testing
let dbLength;
let createdIDs = [];
// Set timeout to 8s because DB host is sometimes slow
jest.setTimeout(80000);

describe("GET /users", () => {
    describe("when called", () => {
        test("should respond with a 200 status code", async () => {
            const response = await request(app).get("/users/");
            dbLength = Object.keys(response.body).length;
            expect(response.statusCode).toBe(200);
        })
        test("should specify json as the content type in the http header", async () => {
            const response = await request(app).get("/users/");
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        })
    })
})

describe("GET /users/:id", () => {
    describe("given that such a user exists", () => {
        test("should respond with a 200 status code", async () => {
            const response = await request(app).get("/users/1/");
            expect(response.statusCode).toBe(200);
        })
        test("should specify json as the content type in the http header", async () => {
            const response = await request(app).get("/users/1/");
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        })
        test("should return a user object", async () => {
            const response = await request(app).get("/users/1/");
            expect(Object.keys(response.body).length).toBe(4);
        })
    })
    describe("given that such a user doesn't exist", () => {
        test("should respond with a 404 status code", async () => {
            const response = await request(app).get("/users/797979797799977977979797/");
            expect(response.statusCode).toBe(404);
        })
        test("should specify json as the content type in the http header", async () => {
            const response = await request(app).get("/users/797979797799977977979797/");
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        })
        test("should return a correct error message", async () => {
            const response = await request(app).get("/users/797979797799977977979797/");
            expect(response.body).toEqual({"error": "User not found"});
        })
    })
})

describe("POST /users", () => {
    describe("given correct input", () => {
        test("should respond with a 201 status code and json content type", async () => {
            const response = await request(app).post("/users/").send({"username":"test1", "email":"test1@test.test", "age":24});
            expect(response.statusCode).toBe(201);
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
            createdIDs.push(response.body[response.body.length - 1].ID);
            dbLength++;
        })
        test("should add user to database", async () => {
            const response = await request(app).post("/users/").send({"username":"test2", "email":"test2@test.test", "age":24})
            expect(response.body.length).toBe(dbLength + 1);
            createdIDs.push(response.body[response.body.length - 1].ID);
            dbLength++;
        })
    })
    describe("given incorrect input", () => {
        test("should respond with a 400 status code", async () => {
            // Each body element is a wrong input case, i.e. providing only certain fields or invalid email
            const bodies = [
                { username: "username" },
                { email:"email@email.com" },
                { age: 36 },
                { username: "uniquename24242", email:"emailemail.com", age:36 },
                { username: "uniquename24242", email:"email@email.com", age:1000 },
                { username: "u", email:"email@email.com", age:36 },
                {}
            ]
            for (const body of bodies) {
                const response = await request(app).post("/users/").send(body)
                expect(response.statusCode).toBe(400)
            }
        })
    })
})

describe("PUT /users/:id", () => {
    describe("given correct input", () => {
        test("should respond with a 200 status code and json content type", async () => {
            const response = await request(app).put(`/users/${createdIDs[0]}`).send({ "age": 37 });
            expect(response.statusCode).toBe(200);
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        })
        test("should modify user data", async () => {
            const response = await request(app).put(`/users/${createdIDs[1]}`).send({ "age": 1 })
            expect(response.body[response.body.length - 1].age).toEqual(1);
        })
    })
    describe("given incorrect input", () => {
        test("should respond with a 400 status code to invalid input", async () => {
            // Each body element is a wrong input case, i.e. providing only certain fields or invalid email
            const bodies = [
                { username: "yoyoyoyyoooooooooooooooooooooooooooooo" },
                { email:"emailemail.com" },
                { age: 180 },
                { username: "y" },
                {}
            ]
            for (const body of bodies) {
                const response = await request(app).put(`/users/${createdIDs[0]}`).send(body)
                expect(response.statusCode).toBe(400)
            }
        })
        test("should respond with a 404 status code to invalid id", async () => {
            const response = await request(app).put(`/users/797979797799977977979797`).send({ age: 99 })
            expect(response.statusCode).toBe(404)
        })
    })
})

describe("DELETE /users/:id", () => {
    describe("given correct input", () => {
        test("should respond with a 200 status code and json content type", async () => {
            const response = await request(app).delete(`/users/${createdIDs[0]}`);
            expect(response.statusCode).toBe(200);
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
            dbLength--;
        })
        test("should remove user from database", async () => {
            const response = await request(app).delete(`/users/${createdIDs[1]}`)
            expect(response.body.length).toBe(dbLength - 1);
        })
    })
    describe("given incorrect input", () => {
        test("should respond with a 404 status code", async () => {
            const response = await request(app).delete(`/users/797979797799977977979797`)
            expect(response.statusCode).toBe(404);
        })
        test("should specify json as the content type in the http header", async () => {
            const response = await request(app).delete(`/users/797979797799977977979797`)
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        })
        test("should return a correct error message", async () => {
            const response = await request(app).delete(`/users/797979797799977977979797`)
            expect(response.body).toEqual({"error": "User not found"});
        })
    })
})