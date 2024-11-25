import { setupServer } from 'msw/node'
import { http, HttpResponse } from "msw";

export const handlers = [
    http.get("http://localhost:8000/api/health", () => {
      return HttpResponse.json({
        status: "healthy",
      });
    }),
    http.post("http://localhost:8000/api/chat", () => {
      return HttpResponse.json({
          response: "this is a mock response",
        });
    })
  ];

export const server = setupServer(...handlers);
