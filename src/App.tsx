import { ToastContainer } from 'react-toastify';
import './App.css';
import Menu from './Components/Menu/Menu';
import Game from './Components/Game/Game'
export default function App() {
  return (
    <div className="plinko-container">
      <div className="header">
      <h1>Plinko</h1>
      </div>
      <div className="game">
        <Menu />
        <Game />
      </div>
      <ToastContainer
            position='top-right'
            autoClose={2500}
            limit = {5}
            />
    </div>

  );
}

 
