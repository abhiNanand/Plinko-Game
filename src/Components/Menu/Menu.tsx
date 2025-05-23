import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateAmount, updateRows } from '../../store';
import './Menu.css';
export default function Menu() {

    const [amount, setAmount] = useState<number | string>(0);
    const dispatch = useDispatch();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = (e.target.value).trim();
        setAmount((value === '') ? '' : Number(value));
        dispatch(updateAmount((value === '') ? 0 : Number(value)))
    }
    const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        if ((e.target.value).trim() == '') { setAmount(0); dispatch(updateAmount(0)) }
        else {
            setAmount(Number(e.target.value));
            dispatch(updateAmount((Number(e.target.value))))
        }
    }
    return (
        <div className="menu-container">
            <label htmlFor="amount">Bet Amount</label>
            <input id="amount" type="number" min="0" value={amount} onChange={handleChange} onBlur={handleBlur} />
            <label htmlFor="rows">Rows</label>
            <select id="rows" onChange={(e)=>dispatch(updateRows(Number(e.target.value)))}>
                {[...Array(9)].map((_, i) => (<option key={8 + i} >{8 + i}</option>))}
            </select>
            
        </div>
    );
}