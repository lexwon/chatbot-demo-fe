import { render, screen } from "@testing-library/react";
import App from "./App";
import userEvent from "@testing-library/user-event";

describe("Demo Chatbot tests", () => {
  test("renders the chatbot page", async () => {
    render(<App />);

    expect(
      await screen.findByRole("heading", { name: "Chatbot Demo" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "This is a demo chatbot built using create-react-app and tailwindcss",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Enter your message into the chatbox to being chatting")
    );
    expect(
      screen.getByRole("textbox", {
        name: "chatbox input",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "send",
      })
    ).toBeInTheDocument();
  });

  test("handles a chat prompt", async () => {
    // there are conflicts between jsdom, create-react-app and MSW (which I would prefer for mocking)
    // use jest for now for simplicity
    const fetchSpy = jest.spyOn(global, "fetch").mockImplementation((req) => {
      if (req.url === "http://localhost:8000/api/chat") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ response: "this is a mock message" }),
        });
      }
      return Promise.reject(new Error("URL not mocked"));
    });

    render(<App />);
    const chatInput = await screen.findByRole("textbox", {
      name: "chatbox input",
    });

    userEvent.type(chatInput, "this is a prompt");
    userEvent.click(screen.getByRole("button", { name: "send" }));

    expect(
      await screen.findByRole("heading", { name: "Loading ...." })
    ).toBeInTheDocument();

    expect(
      await screen.findByText("this is a mock message")
    ).toBeInTheDocument();
    expect(screen.getByText("this is a prompt")).toBeInTheDocument();

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "http://localhost:8000/api/chat",
        method: "POST",
        _bodyText: '{"message":"this is a prompt"}',
        headers: expect.objectContaining({
          map: {
            "content-type": "application/json",
          },
        }),
      }),
      {}
    );
    fetchSpy.mockRestore();
  });

  test("handles an error calling the backend", async () => {
    const fetchSpy = jest.spyOn(global, "fetch").mockImplementation(() => {
      // return Promise.reject(new Error("URL not mocked"));
      return Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: "this is a mock error" }),
      });
    });

    render(<App />);
    const chatInput = await screen.findByRole("textbox", {
      name: "chatbox input",
    });

    userEvent.type(chatInput, "this is a prompt");
    userEvent.click(screen.getByRole("button", { name: "send" }));

    expect(
      await screen.findByText("There was an error communicating to the Chatbot")
    ).toBeInTheDocument();
    fetchSpy.mockRestore();
  });
});
