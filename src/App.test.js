import { render, screen } from "@testing-library/react";
import App from "./App";

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
});
