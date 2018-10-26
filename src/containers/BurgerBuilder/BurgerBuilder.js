import React, {Component} from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
import {connect} from 'react-redux';
import * as burgerBuilderActions from '../../store/actions/index';
import burgerBuilderReducer from "../../store/reducers/burgerBuilder";
import * as action from '../../store/actions/index';


class BurgerBuilder extends Component{
    /*constructor(props){
        super(props);
    }*/
    state = {
        purchasing : false,
    }

    componentDidMount (){
        this.props.onInitIngredients();
    }
    updatePurchaseState(ingredients){
        const sum = Object.keys(ingredients).map(igKey =>{
            return ingredients[igKey]
        }).reduce((sum,el) =>{
            return sum + el;
        },0);
        return sum > 0;
    }

    purchaseHandler = () =>{
        if(this.props.isAuthenticated){
            this.setState({purchasing : true});
        }else{
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push('/auth');
        }

    };

    purchaseCancelOrder = () =>{
        this.setState({purchasing : false});
    };

    purchaseContinueHandler = () =>{
        this.props.onInitPurchase();
        this.props.history.push({pathname : '/checkout'});
    }
    render(){
        const disableInfo = {
            ...this.props.ings
        };
        for(let key in disableInfo){
            disableInfo[key] = disableInfo[key] <= 0
        }
        let orderSummary = null;
        let burger = this.props.error ? <p>Ingredients can't be loaded</p> :<Spinner/>;
        if(this.props.ings){
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved = {this.props.onIngredientRemoved}
                        disabled={disableInfo}
                        purchasable={ this.updatePurchaseState(this.props.ings)}
                        ordered ={this.purchaseHandler}
                        isAuth={this.props.isAuthenticated}
                        price = {this.props.price}
                    />c
                </Aux>
            );
            orderSummary =  <OrderSummary
                ingredients={this.props.ings}
                purchseCanceled={this.purchaseCancelOrder}
                purchaseContinue={this.purchaseContinueHandler}
                price={this.props.price.toFixed(2)}
            />
        }

        return(
          <Aux>
              <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelOrder}>
                  {orderSummary}
              </Modal>
              {burger}
          </Aux>
        );
    }
}
const mapStateToProps = state =>{
    return{
        ings : state.burgerBuilder.ingredients,
        price : state.burgerBuilder.totalPrice,
        error : state.burgerBuilder.error,
        isAuthenticated : state.auth.token !== null
    };
}
const mapDispatchToProps = dispatch =>{
    return{
        onIngredientAdded : (ingName) => dispatch(burgerBuilderActions.addIngredient(ingName)),
        onIngredientRemoved : (ingName) => dispatch(burgerBuilderActions.removeIngredient(ingName)),
        onInitIngredients : () => dispatch(burgerBuilderActions.initIngredients()),
        onInitPurchase : () => dispatch(burgerBuilderActions.purchaseInit()),
        onSetAuthRedirectPath : (path) => dispatch(action.setAuthRedirectPath(path))
    }
}

export default connect(mapStateToProps,mapDispatchToProps) (withErrorHandler(BurgerBuilder,axios));