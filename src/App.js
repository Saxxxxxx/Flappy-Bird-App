import styled from "styled-components";
import { useEffect, useState } from "react";

const BIRD_SIZE = 20;
const GAME_WIDTH = 500;
const GAME_HEIGHT = 500;
const GRAVITY = 6;
const JUMP_HEIGHT = 100;
const OBSTACLE_WIDTH = 40;
const OBSTACLE_GAP = 200;

function App() {
  const [birdPosition, setBirdPosition] = useState(250);
  const [gameState, setGameState] = useState(false);
  const [obstacleHeight, setObstacleHeight] = useState(200);
  const [obstacleLeft, setObstacleLeft] = useState(GAME_WIDTH - OBSTACLE_WIDTH);
  const [score, setScore] = useState(-2);
  const bottomObstacleHeight = GAME_HEIGHT - OBSTACLE_GAP - obstacleHeight;
  useEffect(() => {
    let timeid;
    if (gameState && birdPosition < GAME_HEIGHT - BIRD_SIZE) {
      timeid = setInterval(() => {
        setBirdPosition((birdPosition) => birdPosition + GRAVITY);
      }, 24);
    }
    return () => {
      clearInterval(timeid);
    };
  }, [birdPosition, gameState]);
  useEffect(() => {
    let obstacleId;
    if (gameState && obstacleLeft >= -OBSTACLE_WIDTH) {
      obstacleId = setInterval(() => {
        setObstacleLeft((obstacleLeft) => obstacleLeft - 5);
      }, 24);
      return () => {
        clearInterval(obstacleId);
      };
    } else {
      setObstacleLeft(GAME_WIDTH - OBSTACLE_WIDTH);
      setObstacleHeight(
        Math.floor(Math.random() * (GAME_HEIGHT - OBSTACLE_GAP))
      );
      setScore((score) => score + 1);
    }
  }, [gameState, obstacleLeft]);
  useEffect(() => {
    const hasCollisionTop = birdPosition >= 0 && birdPosition < obstacleHeight;
    const hasCollisionBot =
      birdPosition <= 500 && birdPosition >= 500 - bottomObstacleHeight;
    if (
      obstacleLeft >= 0 &&
      obstacleLeft <= OBSTACLE_WIDTH &&
      (hasCollisionBot || hasCollisionTop)
    ) {
      setGameState(false);
      setScore(score - 2);
    }
  }, [birdPosition, obstacleHeight, bottomObstacleHeight, obstacleLeft]);
  const handleClick = () => {
    let newBirdPosition = birdPosition - JUMP_HEIGHT;
    if (!gameState) {
      setGameState(true);
      setScore(0);
      setBirdPosition(250);
    }
    if (newBirdPosition > 0) {
      setBirdPosition(newBirdPosition);
    }
  };
  return (
    <Div onClick={handleClick}>
      <GameBox height={GAME_HEIGHT} width={GAME_WIDTH}>
        <Obstacle
          top={0}
          width={OBSTACLE_WIDTH}
          height={obstacleHeight}
          left={obstacleLeft}
        />
        <Obstacle
          top={GAME_HEIGHT - (obstacleHeight + bottomObstacleHeight)}
          width={OBSTACLE_WIDTH}
          height={bottomObstacleHeight}
          left={obstacleLeft}
        />
        <Bird size={BIRD_SIZE} top={birdPosition} />
      </GameBox>
      <span>{score}</span>
    </Div>
  );
}

export default App;

const Bird = styled.div`
  position: absolute;
  background-color: yellow;
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  top: ${(props) => props.top}px;
  border-radius: 50%;
`;

const Div = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  & span {
    color: white;
    font-size: 24px;
    position: absolute;
  }
`;

const GameBox = styled.div`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  background-color: #add8e6;
  overflow: hidden;
`;

const Obstacle = styled.div`
  position: relative;
  top: ${(props) => props.top}px;
  background-color: green;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  left: ${(props) => props.left}px;
`;
