import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { useSelector } from "react-redux";
import "./Game.css";

export default function Game() {
  const rows = useSelector((state: any) => state.game.rows);
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const [score, setScore] = useState<number>(0);

  const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const dropBall = () => {
    const engine = engineRef.current;
    if (!engine) return;

    const n = getRandomInt(200, 600);
    const ballRadius = 12 - (rows - 8) * 0.4;  
    const ball = Matter.Bodies.circle(n, 0, ballRadius, {
      restitution: 1,
      friction: 1,
      render: { fillStyle: "#e8b31d" },
      label: "ball",
    });
    Matter.Composite.add(engine.world, ball);
  };

  useEffect(() => {
    const { Engine, Render, Runner, Composite, Bodies, Events } = Matter;
    const engine = Engine.create();
    engineRef.current = engine;

    const render = Render.create({
      element: sceneRef.current!,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false,
        background: "transparent",
      },
    });
    renderRef.current = render;

     const leftWall = Bodies.rectangle(0, 300, 40, 600, {
      isStatic: true,
      render: { fillStyle: "#060a19" },
    });
    const rightWall = Bodies.rectangle(800, 300, 40, 600, {
      isStatic: true,
      render: { fillStyle: "#060a19" },
    });

     
const canvasHeight = 600;
const reservedBottomSpace = 120;
const availableHeight = canvasHeight - reservedBottomSpace;
const spacingY = Math.min(80, availableHeight / rows);

 const availableWidth = 800 - 80;  
const spacingX = Math.max(30, Math.min(70, availableWidth / (rows + 2)));  
const pegRadius = 8 - (rows - 8) * 0.6;

const pegs: Matter.Body[] = [];

for (let r = 0; r < rows; r++) {
  const pegCount = r + 3;
  const totalWidth = (pegCount - 1) * spacingX;
  const startX = (800 - totalWidth) / 2;

  // Ensure pegs stay within walls
  const minX = 40 + pegRadius; // Left wall + peg radius
  const maxX = 760 - pegRadius; // Right wall - peg radius

  for (let col = 0; col < pegCount; col++) {
    let x = startX + col * spacingX;
    // Clamp x position between minX and maxX
    x = Math.max(minX, Math.min(maxX, x));
    const y = 60 + r * spacingY;

    const peg = Bodies.circle(x, y, pegRadius, {
      isStatic: true,
      friction: 1,
      render: { fillStyle: "white" },
    });
    pegs.push(peg);
  }
}

    // Point boxes
    const pointBoxes: Matter.Body[] = [];
    let startX = 0;
    const boxWidth = 800 / (rows + 1);

    for (let i = 0; i < rows + 1; i++) {
      const box = Bodies.rectangle(startX + boxWidth / 2, 590, boxWidth, 100, {
        isStatic: true,
        render: {
          fillStyle: "#70857b",
          strokeStyle: "#e91e63",
          lineWidth: 4,
        },
        label: `box${i}`,
      });
      pointBoxes.push(box);
      startX += boxWidth;
    }

    Composite.add(engine.world, [...pointBoxes, leftWall, rightWall, ...pegs]);

    Events.on(engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        const labels = [pair.bodyA.label, pair.bodyB.label];

        if (labels.includes("ball") && labels.some((l) => l.startsWith("box"))) {
          const boxLabel = labels.find((l) => l.startsWith("box"));
          console.log("Ball hit box:", boxLabel);
          setScore((prevScore) => prevScore + 1);
          const ballBody = pair.bodyA.label === "ball" ? pair.bodyA : pair.bodyB;
          Composite.remove(engine.world, ballBody);
        }
      });
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);
    (engineRef.current as any).runner = runner;

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Composite.clear(engine.world, false);
      Engine.clear(engine);
      if (render.canvas.parentNode) {
        render.canvas.parentNode.removeChild(render.canvas);
      }
      render.textures = {};
    };
  }, [rows]);

  return (
    <div>
      <div ref={sceneRef} className="plinko-board" />
      <div className="btn">
        <button className="bet-button" onClick={dropBall}>
          Drop Ball
        </button>
        <button>Score: {score}</button>
      </div>
    </div>
  );
}
