import { useEffect, useRef ,useState} from "react";
import Matter from 'matter-js';
import { useSelector } from 'react-redux';
import './Game.css';

export default function Game() {
  const rows = useSelector((state: any) => state.game.rows);
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const [fall,setFall]=useState<boolean>(true);

  const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  useEffect(() => {
    console.log(rows)
    const {
      Engine,
      Render,
      Runner,
      Composite,
      Bodies,
    } = Matter;

    const engine = Engine.create();
    engineRef.current = engine;

    const render = Render.create({
      element: sceneRef.current!,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false,
        background: 'transparent',
      },
    });

    renderRef.current = render;

    const n = getRandomInt(300, 500);
    const ball = Bodies.circle(n, 0, 18, {
      isStatic:fall,
      restitution: 0.9,
      friction: 0.001,
      render: { fillStyle: "#e8b31d" }
    });

    const ground = Bodies.rectangle(400, 610, 800, 40, {
      isStatic: true,
      render: { fillStyle: "#060a19" },
    });

    const leftWall = Bodies.rectangle(0, 300, 40, 600, {
      isStatic: true,
      render: { fillStyle: "#060a19" },
    });

    const rightWall = Bodies.rectangle(800, 300, 40, 600, {
      isStatic: true,
      render: { fillStyle: "#060a19" },
    });

    const pegs: Matter.Body[] = [];
    for (let r = 0; r < rows; r++) {
      const pegCount = r + 3;
      const spacingX = 70;
      const spacingY = 70;

      const totalWidth = (pegCount - 1) * spacingX;

      const startX = (800 - totalWidth) / 2;

      for (let col = 0; col < pegCount; col++) {
        const x = startX + col * spacingX-(5*rows);
        const y = 50 + r * spacingY -(5*rows) ;

        const peg = Bodies.circle(x, y, 10-(0.5*rows), {
          isStatic: true,
          render: { fillStyle: "white" },
        });
        pegs.push(peg);
      }
    }

    Composite.add(engine.world, [ball, ground, leftWall, rightWall, ...pegs]);
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
  }, [fall,rows]);
  return (
    <div className="plinko-board">
      <div
        ref={sceneRef}
        style={{
          width: "800px",
          height: "600px",
          margin: "0 auto",
        }}
      />
      <button className="bet-button" onClick={()=>setFall(false)}>Bet</button>
      <button className="bet-button" onClick={()=>setFall(true)}>Reset</button>

    </div>
  );
}


