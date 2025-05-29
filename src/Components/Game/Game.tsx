import { useEffect, useRef } from "react";
import Matter from "matter-js";
import { sound } from "../../assets";
import { useSelector, useDispatch } from "react-redux";
import { incrementTotalAmount, decrementTotalAmont,ballDropping } from '../../store/index';
import "./Game.css";
import { toast } from "react-toastify";

export default function Game() {
  const rows = useSelector((state: any) => state.game.rows);
  const isBallDropping=useSelector((state:any)=>state.game.ballDropped);
  const betAmount = useSelector((state: any) => state.game.amount);
  const totalAmount = useSelector((state: any) => state.game.total)
  const betAmountRef = useRef(betAmount);
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
   const dispatch = useDispatch();

   const audio=new Audio(sound.bonus1);
   const audio2=new Audio(sound.balldropped);
  const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const dropBall = () => {
    audio2.play();

    if (betAmount > totalAmount) {
      toast.error("Bet amount higher than total amount");
      console.log("error")
      return;
    }   
    const engine = engineRef.current;
    if (!engine) return;
    if(betAmount!=0)
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
    const ballRadius = 14 - (rows - 8) * 0.4;

    const ball = Matter.Bodies.circle(n, 0, ballRadius, {
      restitution: 0.8,
      friction: 1,
      render: { fillStyle: "#e8b31d" },
      label: "ball",
    });
    Matter.Composite.add(engine.world, ball);
  };

  useEffect(() => {
    betAmountRef.current = betAmount;
  }, [betAmount])

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
      render: { fillStyle: "#0E212E" },
    });
    const rightWall = Bodies.rectangle(800, 300, 40, 600, {
      isStatic: true,
      render: { fillStyle: "#0E212E" },
    });


    const canvasHeight = 600;
    const reservedBottomSpace = 120;
    const availableHeight = canvasHeight - reservedBottomSpace;
    const spacingY = Math.min(80, availableHeight / rows);

    const availableWidth = 800 - 80;
    const spacingX = Math.max(30, Math.min(70, availableWidth / (rows + 2)));
    const pegRadius = 8 - (rows - 8) * 0.6;

    const pegs: Matter.Body[] = [];
    const boxMultipliers = [1, 1.5, 0.5, 2, 0.2, 1.2, 1.8, 0.4, 0.75];

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

        const peg = Bodies.circle(x, y, pegRadius, {
          isStatic: true,
          friction: 0.4,
          render: { fillStyle: "white" },
        });
        pegs.push(peg);
      }
    }

    const pointBoxes: Matter.Body[] = [];
    let startX = 0;
    const boxWidth = 800 / (rows + 1);

    for (let i = 0; i < rows + 1; i++) {
      const multiplier = boxMultipliers[i % boxMultipliers.length];
      const box = Bodies.rectangle(startX + boxWidth / 2, 550, boxWidth, 30, {
        isStatic: true,
        render: {
          fillStyle: "#b3350e",
          lineWidth: 4,
        },
        label: `box${i}`,
      });
      (box as any).multiplier = multiplier;
      pointBoxes.push(box);
      startX += boxWidth;
    }
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
          if (removedBalls.has(ball.id))
            return;
          removedBalls.add(ball.id);
          const multiplier = (box as any).multiplier;
          console.log(multiplier, betAmountRef.current, multiplier * betAmountRef.current);
          const winAmount = betAmountRef.current * multiplier;
          if (betAmountRef.current < winAmount) {
            dispatch(incrementTotalAmount(winAmount - betAmountRef.current));
          }
          else if (betAmountRef.current > winAmount) {
            dispatch(decrementTotalAmont(betAmountRef.current - winAmount));
          }
          dispatch(ballDropping(false));
          Composite.remove(engine.world, ball);
          audio.play();
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
        <button className="bet-button" onClick={dropBall} disabled={isBallDropping}>
          Drop Ball
        </button>
      </div>
    </div>
  );
}
