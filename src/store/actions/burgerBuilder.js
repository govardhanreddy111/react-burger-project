import * as actionTypes from './actionTypes';
import axios from "../../axios-orders";

export const addIngredient = (name) =>{
    return {
        type : actionTypes.ADD_INGREDINT,
        ingredientName : name
    }
}

export const removeIngredient = (name) =>{
    return {
        type : actionTypes.REMOVE_INGREDINT,
        ingredientName : name
    }
}

export const setIngrediens = (ingredients) =>{
    return {
        type : actionTypes.SET_INGREDIENTS,
        ingredients : ingredients
    }
}
export const initIngredients = () =>{
    return dispatch =>{
        axios.get("https://burger-f622a.firebaseio.com/ingredients.json")
            .then(response =>{
                dispatch(setIngrediens(response.data))
            }).catch(error =>{
                dispatch(fetchIngredientsFailed());
        })
    }
}

export const fetchIngredientsFailed = () =>{
    return {
        type : actionTypes.FETCH_INGREDIENT_FAILED
    }
}