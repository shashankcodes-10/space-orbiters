import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./db/pool.js", () => ({
  pool: {
    query: vi.fn(),
  },
}));

const { pool } = await import("./db/pool.js");
const { app } = await import("./server.js");

describe("Space Orbiters API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /", () => {
    it("returns API information", async () => {
      const response = await request(app).get("/");

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Space Orbiters API");
      expect(response.body.status).toBe("running");
      expect(response.body.endpoints).toContain("/api/health");
      expect(response.body.endpoints).toContain("/api/planets");
      expect(response.body.endpoints).toContain("/api/users");
      expect(response.body.endpoints).toContain("/api/messages");
      expect(response.body.endpoints).toContain("/api/launches");
    });
  });

  describe("GET /api/health", () => {
    it("returns healthy database status", async () => {
      pool.query.mockResolvedValueOnce({
        rows: [
          {
            time: "2026-01-01T00:00:00.000Z",
          },
        ],
      });

      const response = await request(app).get("/api/health");

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("ok");
      expect(response.body.database).toBe("connected");
      expect(response.body.time).toBe("2026-01-01T00:00:00.000Z");
    });

    it("returns an error when the database is unavailable", async () => {
      pool.query.mockRejectedValueOnce(new Error("Database unavailable"));

      const response = await request(app).get("/api/health");

      expect(response.status).toBe(503);
      expect(response.body.status).toBe("error");
      expect(response.body.database).toBe("disconnected");
    });
  });

  describe("GET /api/planets", () => {
    it("returns planets", async () => {
      pool.query.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            name: "Earth",
            description: "Our home planet",
            created_at: "2026-01-01T00:00:00.000Z",
          },
          {
            id: 2,
            name: "Mars",
            description: "The red planet",
            created_at: "2026-01-01T00:00:00.000Z",
          },
        ],
      });

      const response = await request(app).get("/api/planets");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBe("Earth");
      expect(response.body[1].name).toBe("Mars");
    });

    it("returns an error when fetching planets fails", async () => {
      pool.query.mockRejectedValueOnce(new Error("Database error"));

      const response = await request(app).get("/api/planets");

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Failed to fetch planets");
    });
  });

  describe("GET /api/users", () => {
    it("returns users", async () => {
      pool.query.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            username: "testuser",
            email: "test@example.com",
            created_at: "2026-01-01T00:00:00.000Z",
          },
        ],
      });

      const response = await request(app).get("/api/users");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].username).toBe("testuser");
      expect(response.body[0].email).toBe("test@example.com");
    });

    it("returns an error when fetching users fails", async () => {
      pool.query.mockRejectedValueOnce(new Error("Database error"));

      const response = await request(app).get("/api/users");

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Failed to fetch users");
    });
  });

  describe("GET /api/messages", () => {
    it("returns messages", async () => {
      pool.query.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            message: "Hello from Space Orbiters",
            created_at: "2026-01-01T00:00:00.000Z",
            username: "testuser",
          },
        ],
      });

      const response = await request(app).get("/api/messages");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].message).toBe("Hello from Space Orbiters");
      expect(response.body[0].username).toBe("testuser");
    });

    it("returns an error when fetching messages fails", async () => {
      pool.query.mockRejectedValueOnce(new Error("Database error"));

      const response = await request(app).get("/api/messages");

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Failed to fetch messages");
    });
  });

  describe("GET /api/launches", () => {
    it("returns launches from the Space Devs API", async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce({
          results: [
            {
              id: "launch-1",
              name: "Test Space Launch",
            },
          ],
        }),
      });

      const response = await request(app).get("/api/launches");

      expect(response.status).toBe(200);
      expect(response.body.launches).toHaveLength(1);
      expect(response.body.launches[0].name).toBe("Test Space Launch");

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("returns an error when the launch API fails", async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const response = await request(app).get("/api/launches");

      expect(response.status).toBe(502);
      expect(response.body.error).toBe("Failed to fetch launch data");
    });
  });
});