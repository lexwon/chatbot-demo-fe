import { useState } from "react";
import { Flex } from "./components";
import { useFetch } from "./hooks";
import "./App.css";

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">Demo Chatbot</header> */}
      <Chatbot />
    </div>
  );
}

const MessageTypes = {
  prompt: "prompt",
  response: "response",
};

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const { loading, error, fetchData } = useFetch();

  if (loading) {
    return <h1>Loading ....</h1>;
  }

  if (error) {
    return <h1>There was an error communicating to the Chatbot</h1>;
  }

  return (
    <Flex flexDirection="column">
      <div>
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
      <Flex flexDirection="row">
        <input
          value={prompt}
          onChange={(value) => {
            setPrompt(value.target.value);
          }}
        />
        <button
          onClick={async () => {            
            await fetchData(
              new Request("http://localhost:8000/api/chat", {
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: prompt }),
                method: "POST",
              })
            ).then((data) => {
              setMessages([
                ...messages,
                { text: prompt, type: MessageTypes.prompt },
                { text: data.response, type: MessageTypes.response },
              ]);              
            });
          }}
        >
          Send
        </button>
      </Flex>
    </Flex>
  );
}

function Prompt({ text }) {
  return (
    <Flex justifyContent="flex-end">
      <span>{text}</span>
    </Flex>
  );
}

function Response({ text }) {
  return (
    <Flex justifyContent="flex-start">
      <span>{text}</span>
    </Flex>
  );
}

export default App;
