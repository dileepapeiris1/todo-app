// Third-party Libraries
import request from "supertest";
import { OAuth2Client } from "google-auth-library";

// Internal Modules
import initTodoApp from "@/app";

jest.mock("google-auth-library");

const mockVerifyIdToken = jest.fn();
OAuth2Client.prototype.verifyIdToken = mockVerifyIdToken;

const app = initTodoApp();

/** Integration tests for POST /api/v1/auth/google */
describe("Auth Routes — POST /api/v1/auth/google", () => {
  beforeEach(() => {
    mockVerifyIdToken.mockReset();
  });

  /** Returns 400 when no credential is sent in the request body. */
  it("returns 400 when credential is missing", async () => {
    const res = await request(app).post("/api/v1/auth/google").send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBeDefined();
  });

  /** Returns 401 when Google rejects the token. */
  it("returns 401 when Google token verification fails", async () => {
    mockVerifyIdToken.mockRejectedValueOnce(new Error("Token expired"));

    const res = await request(app)
      .post("/api/v1/auth/google")
      .send({ credential: "invalid-token" });

    expect(res.status).toBe(401);
    expect(res.body.message).toContain("Google token verification failed");
  });

  /** Returns 401 when the verified token has no sub field. */
  it("returns 401 when the token payload has no sub", async () => {
    mockVerifyIdToken.mockResolvedValueOnce({
      getPayload: () => ({ email: "test@example.com", name: "Test" }),
    });

    const res = await request(app)
      .post("/api/v1/auth/google")
      .send({ credential: "valid-token-no-sub" });

    expect(res.status).toBe(401);
  });

  /** Creates a new user on first sign-in and returns a JWT. */
  it("creates a new user and returns a JWT on first sign-in", async () => {
    mockVerifyIdToken.mockResolvedValueOnce({
      getPayload: () => ({
        sub: "google-user-id-123",
        email: "newuser@example.com",
        name: "New User",
      }),
    });

    const res = await request(app)
      .post("/api/v1/auth/google")
      .send({ credential: "valid-token" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe("newuser@example.com");
    expect(res.body.user.name).toBe("New User");
    expect(res.body.user.id).toBeDefined();
  });

  /** Returns the same user id on repeated sign-ins — no duplicate user is created. */
  it("returns the same user id on subsequent sign-ins — no duplicate created", async () => {
    const googlePayload = {
      getPayload: () => ({
        sub: "google-user-id-456",
        email: "existing@example.com",
        name: "Existing User",
      }),
    };

    mockVerifyIdToken
      .mockResolvedValueOnce(googlePayload)
      .mockResolvedValueOnce(googlePayload);

    const firstRes = await request(app)
      .post("/api/v1/auth/google")
      .send({ credential: "token" });
    const secondRes = await request(app)
      .post("/api/v1/auth/google")
      .send({ credential: "token" });

    expect(firstRes.status).toBe(200);
    expect(secondRes.status).toBe(200);
    expect(firstRes.body.user.id).toBe(secondRes.body.user.id);
  });
});
