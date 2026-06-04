// Third-party Libraries
import request from "supertest";
import mongoose from "mongoose";

// Internal Modules
import initTodoApp from "@/app";
import Todo from "@/models/todo.model";
import { createTestUser, bearerToken } from "../helpers/auth.helper";

const app = initTodoApp();

/** Integration tests for all /api/v1/todos endpoints. */
describe("Todo Routes", () => {
  let token: string;
  let userId: string;

  beforeEach(async () => {
    const { user, token: t } = await createTestUser();
    token = t;
    userId = user._id.toString();
  });

  // GET /api/v1/todos

  /** Tests for GET /api/v1/todos */
  describe("GET /api/v1/todos", () => {
    /** Rejects unauthenticated requests. */
    it("returns 401 when no token is provided", async () => {
      const res = await request(app).get("/api/v1/todos");
      expect(res.status).toBe(401);
    });

    /** Returns an empty array when the user has no todos yet. */
    it("returns an empty array when the user has no todos", async () => {
      const res = await request(app)
        .get("/api/v1/todos")
        .set("Authorization", bearerToken(token));

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    /** Returns only the todos that belong to the authenticated user. */
    it("returns only the authenticated user todos", async () => {
      await Todo.create({
        userId,
        title: "My Todo",
        description: "",
        done: false,
      });

      const otherId = new mongoose.Types.ObjectId();
      await Todo.create({
        userId: otherId,
        title: "Other Todo",
        description: "",
        done: false,
      });

      const res = await request(app)
        .get("/api/v1/todos")
        .set("Authorization", bearerToken(token));

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].title).toBe("My Todo");
    });
  });

  // POST /api/v1/todos

  /** Tests for POST /api/v1/todos */
  describe("POST /api/v1/todos", () => {
    /** Rejects unauthenticated requests. */
    it("returns 401 when no token is provided", async () => {
      const res = await request(app).post("/api/v1/todos").send({ title: "Test" });
      expect(res.status).toBe(401);
    });

    /** Returns validation errors when title is absent. */
    it("returns 400 when title is missing", async () => {
      const res = await request(app)
        .post("/api/v1/todos")
        .set("Authorization", bearerToken(token))
        .send({ description: "No title" });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    /** Trims whitespace-only titles and treats them as empty. */
    it("returns 400 when title is empty string", async () => {
      const res = await request(app)
        .post("/api/v1/todos")
        .set("Authorization", bearerToken(token))
        .send({ title: "   " });

      expect(res.status).toBe(400);
    });

    /** Rejects titles that exceed the 200 character limit. */
    it("returns 400 when title exceeds 200 characters", async () => {
      const res = await request(app)
        .post("/api/v1/todos")
        .set("Authorization", bearerToken(token))
        .send({ title: "a".repeat(201) });

      expect(res.status).toBe(400);
    });

    /** Creates and returns the new todo with the correct userId. */
    it("creates a todo and returns 201 with the new document", async () => {
      const res = await request(app)
        .post("/api/v1/todos")
        .set("Authorization", bearerToken(token))
        .send({ title: "Buy groceries", description: "Milk and eggs" });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe("Buy groceries");
      expect(res.body.description).toBe("Milk and eggs");
      expect(res.body.done).toBe(false);
      expect(res.body.userId).toBe(userId);
    });
  });

  // PUT /api/v1/todos/:id

  /** Tests for PUT /api/v1/todos/:id */
  describe("PUT /api/v1/todos/:id", () => {
    /** Rejects unauthenticated requests. */
    it("returns 401 when no token is provided", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/v1/todos/${id}`)
        .send({ title: "X" });
      expect(res.status).toBe(401);
    });

    /** Returns 400 when the id is not a valid MongoDB ObjectId. */
    it("returns 400 for a malformed id", async () => {
      const res = await request(app)
        .put("/api/v1/todos/not-a-valid-id")
        .set("Authorization", bearerToken(token))
        .send({ title: "X" });

      expect(res.status).toBe(400);
    });

    /** Returns 404 when no todo with that id exists. */
    it("returns 404 when the todo does not exist", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/v1/todos/${id}`)
        .set("Authorization", bearerToken(token))
        .send({ title: "Updated" });

      expect(res.status).toBe(404);
    });

    /** Updates title and description and returns the updated document. */
    it("updates and returns the todo", async () => {
      const todo = await Todo.create({
        userId,
        title: "Old title",
        description: "",
        done: false,
      });

      const res = await request(app)
        .put(`/api/v1/todos/${todo._id}`)
        .set("Authorization", bearerToken(token))
        .send({ title: "New title", description: "Updated desc" });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe("New title");
      expect(res.body.description).toBe("Updated desc");
    });

    /** Prevents a user from updating a todo that belongs to another user. */
    it("cannot update another user todo", async () => {
      const otherId = new mongoose.Types.ObjectId();
      const todo = await Todo.create({
        userId: otherId,
        title: "Not mine",
        description: "",
        done: false,
      });

      const res = await request(app)
        .put(`/api/v1/todos/${todo._id}`)
        .set("Authorization", bearerToken(token))
        .send({ title: "Hijacked" });

      expect(res.status).toBe(404);
    });
  });

  // PATCH /api/v1/todos/:id/done

  /** Tests for PATCH /api/v1/todos/:id/done */
  describe("PATCH /api/v1/todos/:id/done", () => {
    /** Rejects unauthenticated requests. */
    it("returns 401 when no token is provided", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(app).patch(`/api/v1/todos/${id}/done`);
      expect(res.status).toBe(401);
    });

    /** Returns 404 when no todo with that id exists. */
    it("returns 404 when the todo does not exist", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(app)
        .patch(`/api/v1/todos/${id}/done`)
        .set("Authorization", bearerToken(token));

      expect(res.status).toBe(404);
    });

    /** Toggles done from false to true. */
    it("toggles done from false to true", async () => {
      const todo = await Todo.create({
        userId,
        title: "Task",
        description: "",
        done: false,
      });

      const res = await request(app)
        .patch(`/api/v1/todos/${todo._id}/done`)
        .set("Authorization", bearerToken(token));

      expect(res.status).toBe(200);
      expect(res.body.done).toBe(true);
    });

    /** Toggles done from true to false. */
    it("toggles done from true to false", async () => {
      const todo = await Todo.create({
        userId,
        title: "Task",
        description: "",
        done: true,
      });

      const res = await request(app)
        .patch(`/api/v1/todos/${todo._id}/done`)
        .set("Authorization", bearerToken(token));

      expect(res.status).toBe(200);
      expect(res.body.done).toBe(false);
    });
  });

  // DELETE /api/v1/todos/:id
  
  /** Tests for DELETE /api/v1/todos/:id */
  describe("DELETE /api/v1/todos/:id", () => {
    /** Rejects unauthenticated requests. */
    it("returns 401 when no token is provided", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/api/v1/todos/${id}`);
      expect(res.status).toBe(401);
    });

    /** Returns 404 when no todo with that id exists. */
    it("returns 404 when the todo does not exist", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/v1/todos/${id}`)
        .set("Authorization", bearerToken(token));

      expect(res.status).toBe(404);
    });

    /** Deletes the todo and confirms it no longer exists in the DB. */
    it("deletes the todo and returns a confirmation message", async () => {
      const todo = await Todo.create({
        userId,
        title: "To delete",
        description: "",
        done: false,
      });

      const res = await request(app)
        .delete(`/api/v1/todos/${todo._id}`)
        .set("Authorization", bearerToken(token));

      expect(res.status).toBe(200);
      expect(res.body.message).toBeDefined();

      const deleted = await Todo.findById(todo._id);
      expect(deleted).toBeNull();
    });

    /** Prevents a user from deleting a todo that belongs to another user. */
    it("cannot delete another user todo", async () => {
      const otherId = new mongoose.Types.ObjectId();
      const todo = await Todo.create({
        userId: otherId,
        title: "Not mine",
        description: "",
        done: false,
      });

      const res = await request(app)
        .delete(`/api/v1/todos/${todo._id}`)
        .set("Authorization", bearerToken(token));

      expect(res.status).toBe(404);
    });
  });
});
