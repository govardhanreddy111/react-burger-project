import React from 'react';
import classes from './Order.css';
const order = (props) => {
    const ingredients = [];
    for(let i in props.ingredients){
        ingredients.push(
            {
                name : i,amount : props.ingredients[i]
            }
            );
    }
    const ingredientOutput = ingredients.map(ig =>{
        return <span
            style={{textTransform : 'capitalize',
                    display : 'inline-block',
            margin : '0 8px',
            padding : "10px",
            border : '1px solid #ccc'}}
                key={ig.key}>{ig.name} ({ig.amount})</span>
    })
    return (
        <div className={classes.Order}>
           ingredients :  {ingredientOutput}
            <p>Price : <strong>USD {parseFloat(props.price).toFixed(2)}</strong></p>
        </div>
    );
};

export default order;