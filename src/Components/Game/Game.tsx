import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { sound } from "../../assets";
import { useSelector, useDispatch } from "react-redux";
import { TEXT, points } from "../../Shared/Constants";
import { incrementTotalAmount, ballDropping, decrementTotalAmount } from "../../store/index";
import "./Game.css";
import { toast } from "react-toastify";

export default function Game() {
  const rows = useSelector((state: any) => state.game.rows);
  const betAmount = useSelector((state: any) => state.game.amount);
  const totalAmount = useSelector((state: any) => state.game.total);
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const ballCount = useRef<number>(0);
  const dispatch = useDispatch();
  const [boxLabels, setBoxLabels] = useState<{ x: number; multiplier: number }[]>([]);

  const audio = new Audio(sound.bonus1);
  const audio2 = new Audio(sound.balldropped);

  const getRandomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1) + min);

  const dropBall = () => {
    audio2.currentTime = 0;
    audio2.play();

    const engine = engineRef.current;
    if (!engine) return;
    if (betAmount > totalAmount) {
      toast.error("Bet amount higher than total amount");
      return;
    }
    ballCount.current = ballCount.current + 1;
    dispatch(decrementTotalAmount(betAmount));
    dispatch(ballDropping(true));
    const pegRadius = 8 - (rows - 8) * 0.6;
    const minX = 40 + pegRadius;
    const maxX = 760 - pegRadius;
    const availableWidth = 720;
    const spacingX = Math.max(30, Math.min(70, availableWidth / (rows + 2)));
    const totalWidth = (2) * spacingX;
    const startX = (800 - totalWidth) / 2;
    let x = startX
    const startat = Math.max(minX, Math.min(maxX, x));
    x = startX + 2 * spacingX;
    const endat = Math.max(minX, Math.min(maxX, x));


    const n = getRandomInt(startat, endat);
    const ballRadius = 14 - (rows - 8) * 0.6;

    const ball = Matter.Bodies.circle(n, 10, ballRadius, {
      restitution: 0.6,
      friction: 1,
      render: { fillStyle: "#c95555" },
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
      engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false,
        background: "transparent",
      },
    });
    renderRef.current = render;

    const canvasHeight = 600;
    const reservedBottomSpace = 120;
    const availableHeight = canvasHeight - reservedBottomSpace;
    const spacingY = Math.min(80, availableHeight / rows);

    const availableWidth = 800 - 80;
    const spacingX = Math.max(30, Math.min(70, availableWidth / (rows + 2)));
    const pegRadius = 8 - (rows - 8) * 0.6;

    const pegs: Matter.Body[] = [];
    const boxMultipliers = points[rows - 8];

    let startpat = 0;
    let endpat = 0;

    for (let r = 0; r < rows; r++) {
      const pegCount = r + 3;
      const totalWidth = (pegCount - 1) * spacingX;
      const startX = (800 - totalWidth) / 2;

      const minX = 40 + pegRadius;
      const maxX = 760 - pegRadius;

      for (let col = 0; col < pegCount; col++) {
        let x = startX + col * spacingX;
        x = Math.max(minX, Math.min(maxX, x));
        const y = 60 + r * spacingY;

        if (r + 1 === rows && col === 0) startpat = x;
        if (r + 1 === rows && col + 1 === pegCount) endpat = x + pegRadius;

        const peg = Bodies.circle(x, y, pegRadius, {
          isStatic: true,
          friction: 0.4,
          render: { fillStyle: "white" },
        });
        pegs.push(peg);
      }
    }

    const leftWall = Bodies.rectangle(startpat - 20 - pegRadius, 300, 40, 600, {
      isStatic: true,
      render: { fillStyle: "#0E212E" },
    });
    const rightWall = Bodies.rectangle(endpat + 20, 300, 40, 600, {
      isStatic: true,
      render: { fillStyle: "#0E212E" },
    });

    const pointBoxes: Matter.Body[] = [];
    const labels: { x: number; multiplier: number }[] = [];

    const totalAvailableWidth = endpat - startpat - pegRadius;
    const gapSize = pegRadius;
    const boxWidth = (totalAvailableWidth - gapSize * rows) / (rows + 1);

    let currentX = startpat;
    for (let i = 0; i < rows + 1; i++) {
      const multiplier = boxMultipliers[i];
      const centerX = currentX + boxWidth / 2;


      let fillColor = "#d68d06";
      if (multiplier >= 5) fillColor = "#d32f2f";
      else if (multiplier >= 2) fillColor = "#f44336";
      else if (multiplier > 1) fillColor = "#fb8c00";
      else if (multiplier === 1) fillColor = "#fdd835";
      else if (multiplier < 1) fillColor = "#fbc02d";

      const box = Bodies.rectangle(centerX, 550, boxWidth, 30, {
        isStatic: true,
        render: {
          fillStyle: fillColor,
          lineWidth: 4,
        },
        label: `box${i}`,
      });

      (box as any).multiplier = multiplier;
      pointBoxes.push(box);
      labels.push({ x: centerX, multiplier });

      currentX += boxWidth + gapSize;
    }
    setBoxLabels(labels);

    Composite.add(engine.world, [...pointBoxes, leftWall, rightWall, ...pegs]);

    const removedBalls = new Set();
    Events.on(engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        const [bodyA, bodyB] = [pair.bodyA, pair.bodyB];
        const isBallA = bodyA.label === "ball";
        const isBallB = bodyB.label === "ball";
        const isBoxA = bodyA.label.startsWith("box");
        const isBoxB = bodyB.label.startsWith("box");

        if ((isBallA && isBoxB) || (isBallB && isBoxA)) {
          const ball = isBallA ? bodyA : bodyB;
          const box = isBoxA ? bodyA : bodyB;

          if (removedBalls.has(ball.id)) return;
          removedBalls.add(ball.id);

          const multiplier = (box as any).multiplier;
          const result = (betAmount * multiplier).toFixed(2);
          dispatch(incrementTotalAmount(Number(result)));
          ballCount.current -= 1;
          if (ballCount.current === 0) dispatch(ballDropping(false));
          Composite.remove(engine.world, ball);

          audio.currentTime = 0;
          audio.play();
        }
      });
    });

    Events.on(engine, "beforeUpdate", () => {
      Matter.Composite.allBodies(engine.world).forEach((body) => {
        if (body.label === "ball" && body.position.y < 300) {
          if (Math.random() < 0.1) {
            const dx = 400 - body.position.x;
            const biasStrength = 0.000007;
            Matter.Body.applyForce(body, body.position, {
              x: dx * biasStrength,

              y: 0,
            });
          }
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
  }, [rows, betAmount]);

  return (
    <div style={{ position: "relative" }}>
      <div ref={sceneRef} className="plinko-board" style={{ width: 800, height: 600 }} />
      {boxLabels.map((label) => (
        <div
          key={`pointBox${label.x}`}
          className="box-label"
          style={{
            left: `${label.x}px`,
          }}
        >
          {label.multiplier}x
        </div>
      ))}
      <div className="btn">
        <button className="bet-button" onClick={dropBall}>
          {TEXT.DROP_BALL}
        </button>
      </div>
    </div>
  );
}
