"use client";
import { useState } from "react";
import { Box, Button, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

const SummerBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  padding: theme.spacing(2),
  background: 'linear-gradient(to right, #1fa2ff, #12d8fa, #a6ffcb)', 
}));

const ChatBox = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 600,
  border: '1px solid #ccc',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  overflowY: 'auto',
  maxHeight: '60vh',
  background: 'rgba(255, 255, 255, 0.8)', 
}));

const MessageBubble = styled(Box)(({ theme, role }) => ({
  backgroundColor: role === "user" ? "#e0f7fa" : "#b2ebf2",
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  alignSelf: role === "user" ? "flex-end" : "flex-start",
  boxShadow: `0 4px 6px rgba(0, 0, 0, 0.1)`,
}));

const SummerTextField = styled(TextField)(({ theme }) => ({
  marginRight: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  background: 'rgba(255, 255, 255, 0.9)', 
}));

const SummerButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#7e57c2', 
  color: '#fff',
  '&:hover': {
    backgroundColor: '#6a1b9a', 
  },
}));





export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi there! I'm your personal travel assistant. How can I help you plan your summer vacation?",
    },
  ]);
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    if (message.length === 0) {
      return;
    }
    const newMessages = [...messages, { role: "user", content: message }];
    setMessages([...newMessages, { role: "assistant", content: "" }]);
    setMessage("");
  
    try {
      const response = await fetch("/api/groq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessages),
      });
  
      if (!response.ok) {
        throw new Error("There was an error fetching the response");
      }
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const text = decoder.decode(value, { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((messages) => [
        ...messages,
        {
          role: "assistant",
          content:
            "I'm sorry, but I encountered an error in trying to fetch a response. Please try again later.",
        },
      ]);
    }
  };
  

  return (
    <SummerBox>
      <ChatBox>
        {messages.map((message, index) => (
          <MessageBubble
            key={index}
            role={message.role}
          >
            {message.content}
          </MessageBubble>
        ))}
      </ChatBox>
      <Box sx={{ display: 'flex', width: '100%', maxWidth: 600 }}>
        <SummerTextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <SummerButton
          variant="contained"
          onClick={sendMessage}
        >
          Send
        </SummerButton>
      </Box>
    </SummerBox>
  );
}