import styled from "styled-components";

export const Button = styled.button`
  background-color: transparent;
  text-transform: uppercase;
  height: 44px;
  display: flex;
  align-items: center;
  width: 150px;
  cursor: pointer;
  padding: 0;
  gap: 30px;
  border: 2px solid
    ${(props) => (props.provider === "twitch" ? "#6441A4" : "#4285F4")};
  font-weight: 700;
`;
