import { useState } from "react";
import styled from "styled-components";

// 🔹 Styled Components

const Container = styled.div`
  width: 400px;
  height: 500px;
  background: white;
  margin: auto;
  margin-top: 50px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  background: #4facfe;
  color: white;
  padding: 10px;
  border-radius: 10px 10px 0 0;
  text-align: center;
`;

const MessageBox = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
`;

const InputContainer = styled.div`
  display: flex;
  border-top: 1px solid #ddd;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px;
  border: none;
  outline: none;
`;

const Button = styled.button`
  padding: 12px;
  border: none;
  background: #4facfe;
  color: white;
  cursor: pointer;

  &:hover {
    background: #3a8de0;
  }
`;

// 🔹 Message Bubble

const MyMessage = styled.div`
  text-align: right;
  background: #dcf8c6;
  margin: 5px;
  padding: 8px;
  border-radius: 10px;
`;

const OtherMessage = styled.div`
  text-align: left;
  background: #eee;
  margin: 5px;
  padding: 8px;
  border-radius: 10px;
`;

// 🔹 Component

function Chat({ user }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const sendMessage = () => {
    if (text.trim()) {
      setMessages([...messages, { user, text }]);
      setText("");
    }
  };

  return (
    <Container>
      <Header>Welcome, {user}</Header>

      <MessageBox>
        {messages.map((msg, index) =>
          msg.user === user ? (
            <MyMessage key={index}>
              <strong>{msg.user}</strong>
              <p>{msg.text}</p>
            </MyMessage>
          ) : (
            <OtherMessage key={index}>
              <strong>{msg.user}</strong>
              <p>{msg.text}</p>
            </OtherMessage>
          )
        )}
      </MessageBox>

      <InputContainer>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
        />
        <Button onClick={sendMessage}>Send</Button>
      </InputContainer>
    </Container>
  );
}

export default Chat;
