import { useSelector } from 'react-redux';
import './Game.css';

export default function Game() {
  const rows = useSelector((state:any) => state.game.rows);

  return (
    <div className="plinko-board">
      {[...Array(rows)].map((_, rowIndex) => (
        <div key={"row"+rowIndex} className="plinko-row">
          {[...Array(rowIndex + 3)].map((_, pegIndex) => (
            <div key={"dot"+pegIndex} className="dot"></div>
          ))}
        </div>
      ))}
      <div className="slots">
        {[...Array(rows + 1)].map((_, i) => (
          <div key={"shots"+i} className="slot">{0.5+i}x</div>
        ))}
      </div>
      <button className="bet-button">Bet</button>
    </div>
  );
}
