import { useState } from "react";
import styled from "styled-components";

// 🔹 Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(to right, #4facfe, #00f2fe);
  color: white;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 12px;
  width: 250px;
  border: none;
  border-radius: 5px;
  margin-bottom: 15px;
  outline: none;
`;

const Button = styled.button`
  padding: 12px 25px;
  border: none;
  background: white;
  color: #333;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: #f1f1f1;
  }
`;

// 🔹 Component
function Join({ setUser }) {
  const [name, setName] = useState("");

  const handleJoin = () => {
    if (name.trim()) {
      setUser(name);
    }
  };

  return (
    <Container>
      <Title>Join Chat</Title>

      <Input
        type="text"
        placeholder="Enter your name"
        onChange={(e) => setName(e.target.value)}
      />

      <Button onClick={handleJoin}>Join</Button>
    </Container>
  );
}

export default Join;