import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TEXT, points } from '../../Shared/Constants';
import { updateBetAmount, updateRows, updatePointsIndex } from '../../store';
import { image } from '../../assets';
import './Menu.css';

export default function Menu() {
    const [amount, setAmount] = useState<number | string>(0);
    const dispatch = useDispatch();

    const totalAmount = useSelector((state: any) => state.game.total);
    const rows = useSelector((state: any) => state.game.rows);
    const isBallDropping = useSelector((state: any) => state.game.ballDropped);
    const pointsIndex = useSelector((state: any) => state.game.pointsIndex);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        if (value === '') {
            setAmount('');
            return;
        }
        if (!/^\d+$/.test(value)) return;
        const cleaned = value.replace(/^0+/, '') || '0';
        setAmount(cleaned);
    };

    const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '' || Number(value) < 0) {
            setAmount(0);
            dispatch(updateBetAmount(0));
        } else {
            setAmount(Number(value));
            dispatch(updateBetAmount(Number(value)));
        }
    };

    return (
        <div className="menu-container">
            <label htmlFor="total-amount">{TEXT.TOTAL_AMOUNT}</label>
            <div className="amount-input">
                <input id="total-amount" type="text" disabled value={`₹ ${totalAmount}`} />
                <img src={image.rupeeIcon} height="18px" width="18px" alt="rupeeIcon" />
            </div>

            <label htmlFor="amount">{TEXT.BET_AMOUNT}</label>
            <input
                id="amount"
                type="number"
                min="0"
                value={amount}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isBallDropping}
                onKeyDown={(e) => {
                    if (['e', 'E', '+', '-'].includes(e.key)) {
                        e.preventDefault();
                    }
                }}
            />

            <label htmlFor="rows">{TEXT.ROWS}</label>
            <select
                id="rows"
                onChange={(e) => {
                    const newRows = Number(e.target.value);
                    dispatch(updateRows(newRows));
                    dispatch(updatePointsIndex(-1));  
                }}
                disabled={isBallDropping}
                value={rows}
            >
                {[...Array(9)].map((_, i) => (
                    <option key={8 + i} value={8 + i}>
                        {8 + i}
                    </option>
                ))}
            </select>

            <label htmlFor="points">Points</label>
            <select
                id="points"
                value={pointsIndex} 
                onChange={(e) => dispatch(updatePointsIndex(Number(e.target.value)))}
                disabled={isBallDropping}
            >
                <option value={-1} >
                    Select
                </option>
                {points[rows - 8].map((value, index) => (
                    <option key={`${value}${index}`} value={index}>
                        {value}x
                    </option>
                ))}
            </select>
        </div>
    );
}
