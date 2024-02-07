import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import moment from 'moment';


const DayInfo = ({id, state, data:{buyPrice, sellPrice, sellCash, sellCard, goodsCount}})=>{
    //console.log({id, state, data:{buyPrice, sellPrice, sellCash, sellCard, goodsCount}})
    if(state == "success"){
        return <article>
            <div className='header'>День: {id + 1}, продано {goodsCount} товарів.</div>
            <div>Надійшло на картку: {sellCard} грн., готівка: {sellCash} грн.</div>
            <div>Різниця закупівлі({sellPrice}) - продажу({buyPrice}) = {sellPrice - buyPrice} грн.</div>
        </article>
    }
    else{
        return <article>
            <div className='header'>День: {id + 1}, інформація відсутня!</div>
        </article>
    }
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ModalWindow({open, handleClose, info, day}) {
    const {buyPrice, sellPrice, sellCash, sellCard, goodsCount} = info.total;
    return (
        <div>
        <Modal
            open={open}
        >
            <Box sx={style} className="man-info">
                <div className="total">
                    <article>
                        <div className='header'>За {moment(day).format("MM.YYYY")} продано {goodsCount} товарів.</div>
                        <div>Надійшло на картку: {sellCard} грн., готівка: {sellCash} грн.</div>
                        <div>Різниця продажу({sellPrice}) - закупівлі({buyPrice}) = {sellPrice - buyPrice} грн.</div>
                    </article>
                    <div className='btn-right'>
                        <Button variant='contained' color='success' onClick={handleClose}>Закрити</Button>
                    </div>
                </div>
                <div className='days'>
                {
                    info.days.map((d, num)=><DayInfo id={num} state={d.state} data={d.data}/>)
                }
                </div>
            </Box>
        </Modal>
        </div>
    );
}