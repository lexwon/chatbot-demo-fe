import { useState } from "react";
import { Flex } from "./components";
import { useFetch } from "./hooks";
import "./App.css";

function App() {
  return (
    <>
      <div className="text-center">
        <h1>Chatbot Demo</h1>
        <h2>
          This is a demo chatbot built using{" "}
          <a href="https://create-react-app.dev/">create-react-app</a> and{" "}
          <a href="https://tailwindcss.com/">tailwindcss</a>
        </h2>
        <p>Enter your message into the chatbox to being chatting</p>
      </div>
      <div className="flex justify-center">
        <Chatbot />
      </div>
    </>
  );
}

const MessageTypes = {
  prompt: "prompt",
  response: "response",
};

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const { loading, error, postData } = useFetch();
  const sendPrompt = async () => {
    if (prompt) {
      await postData({
        url: "http://localhost:8000/api/chat",
        body: JSON.stringify({ message: prompt }),
      }).then((data) => {
        setPrompt("");
        setMessages([
          ...messages,
          { text: prompt, type: MessageTypes.prompt },
          { text: data.response, type: MessageTypes.response },
        ]);
      });
    }
  };

  if (loading) {
    return <h1>Loading ....</h1>;
  }

  if (error) {
    return <h1>There was an error communicating to the Chatbot</h1>;
  }

  return (
    <Flex className="basis-1/3 flex-col">
      <div className="bg-slate-100 border-solid border-black rounded">
        {messages.map((message) => (
          <>
            {message.type === MessageTypes.prompt && (
              <Prompt text={message.text} />
            )}
            {message.type === MessageTypes.response && (
              <Response text={message.text} />
            )}
          </>
        ))}
      </div>
      <Flex className="py-3 flex-row justify-center">
        <input
          aria-label="chatbox input"
          className="border-solid border-black border rounded px-3"
          value={prompt}
          onChange={(value) => {
            setPrompt(value.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              sendPrompt();
            }
          }}
          autoFocus
        />
        <button
          aria-label="send"
          className="ml-3 px-3 text-white rounded-full bg-green-500"
          onClick={sendPrompt}
        >
          Send
        </button>
      </Flex>
    </Flex>
  );
}

function Prompt({ text }) {
  return (
    <Flex className="justify-end pr-3 py-3">
      <span className="bg-green-500 rounded-l rounded-tr px-3 py-1">{text}</span>
    </Flex>
  );
}

function Response({ text }) {
  return (
    <Flex className="justify-start pl-3 py-3">
      <span className="bg-gray-300 rounded-r rounded-tl px-3 py-1">{text}</span>
    </Flex>
  );
}

export default App;
