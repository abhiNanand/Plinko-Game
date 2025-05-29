import {  useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
 
import { updateBetAmount, updateRows } from '../../store';
import { image } from '../../assets';
import './Menu.css';
export default function Menu() {

     const [amount, setAmount] = useState<number | string>(0);
    const dispatch = useDispatch();
    const totalAmount = useSelector((state: any) => state.game.total);
    const isBallDropping=useSelector((state:any)=>state.game.ballDropped);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = (e.target.value.replace(/^0+/, '')).trim();
        setAmount((value === '') ? '' : Number(value));
        dispatch(updateBetAmount((value === '') ? 0 : Number(value)))
    }
    const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        if ((e.target.value).trim() == '' || Number(e.target.value) < 0) { setAmount(0); dispatch(updateBetAmount(0)) }
        else {
            if (Number(e.target.value) > totalAmount) {
                setAmount(totalAmount);
                return;
            }
            let value = e.target.value;
            setAmount(Number(value));
            dispatch(updateBetAmount((Number(value))))
        }
    }

 

    return (
      
   
         <div className="menu-container">
           
            <label htmlFor="total-amount">Total Amount</label>
            <div className="amount-input">
                <input id="total-amount" type="text" disabled value={`₹ ${totalAmount}`} />
                <img src={image.rupeeIcon} height="18px" width="18px" alt="rupeeIcon" />
            </div>
            <label htmlFor="amount">Bet Amount</label>
            <input id="amount" type="number" min="0" value={amount} onChange={handleChange} onBlur={handleBlur} disabled={isBallDropping}/>
            <label htmlFor="rows">Rows</label>
            <select id="rows" onChange={(e) => dispatch(updateRows(Number(e.target.value)))} disabled={isBallDropping}>
                {[...Array(9)].map((_, i) => (<option key={8 + i} >{8 + i}</option>))}
            </select>
            
        </div>
  
       
    );
}