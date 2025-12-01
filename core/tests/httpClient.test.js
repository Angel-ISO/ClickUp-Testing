import createHttpClient from "../httpClient.js";
import result from "../result.js";

describe("HTTP Client", () => {
  const baseUrl = "https://api.example.com";
  const token = "test-token-123";

  it("creates a client with standard HTTP methods", () => {
    const client = createHttpClient(baseUrl, token);
    expect(typeof client.get).toBe("function");
    expect(typeof client.post).toBe("function");
    expect(typeof client.put).toBe("function");
    expect(typeof client.delete).toBe("function");
  });

  it("uses the result wrapper for responses", async () => {
    const client = createHttpClient(baseUrl, token);
    const res = await client.get("/nonexistent-endpoint");

    expect(typeof res).toBe("object");
    expect(res).toHaveProperty("success");
    expect(typeof res.success).toBe("boolean");
    expect(res).toHaveProperty("isOk");
    expect(res).toHaveProperty("isError");
    expect(typeof res.isOk).toBe("function");
    expect(typeof res.isError).toBe("function");

    if (res.success) {
      const ok = result.ok(res.value);
      expect(ok.success).toBe(true);
      expect(ok.isOk()).toBe(true);
    } else {
      const err = result.error(res.error || "unknown");
      expect(err.success).toBe(false);
      expect(err.isError()).toBe(true);
    }
  });
});
