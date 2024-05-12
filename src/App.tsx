import { createPromiseClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";

import { ElizaService } from "./gen/connectrpc/eliza/v1/eliza_connect";
import { useState } from "react";

const transport = createConnectTransport({
  baseUrl: "http://localhost:8080"
});

const client = createPromiseClient(ElizaService, transport);

export function App() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<
    {
      fromMe: boolean;
      message: string;
    }[]
  >([]);

  return (
    <>
      <ol>
        {messages.map((msg, index) => (
          <li key={index}>
            {`${msg.fromMe ? "ME:" : "ELIZA:"} ${msg.message}`}
          </li>
        ))}
      </ol>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setInputValue("");
          // Store the inputValue in the chain of messages and
          // mark this message as coming from "me"
          setMessages((prev) => [
            ...prev,
            {
              fromMe: true,
              message: inputValue,
            },
          ]);
          const response = await client.say({
            sentence: inputValue,
          });
          setMessages((prev) => [
            ...prev,
            {
              fromMe: false,
              message: response.sentence,
            },
          ]);
        }}
      >
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </>
  );
}
