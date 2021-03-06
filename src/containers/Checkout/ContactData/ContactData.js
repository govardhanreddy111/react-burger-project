import React,{Component} from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import {connect} from 'react-redux';
import withErrorHandler from '../../../hoc/WithErrorHandler/WithErrorHandler';
import * as actions from '../../../store/actions/index';
import { updateObject, checkValidity} from "../../../shared/utility";

class ContactData extends Component{
    state = {
        orderForm: {
            name : {
                elementType : 'input',
                elementConfig : {
                    type : 'text',
                    placeholder : 'Your Name'
                },
                value : '',
                validation : {
                    required : true
                },
                valid : false,
                touched : false
            },
            street : {
                elementType : 'input',
                elementConfig : {
                    type : 'text',
                    placeholder : 'Street'
                },
                value : '',
                validation : {
                    required : true
                },
                valid : false,
                touched : false
            },
            zipCode : {
                elementType : 'input',
                elementConfig : {
                    type : 'text',
                    placeholder : 'ZIP Code'
                },
                value : '',
                validation : {
                    required : true,
                    minLength : 6,
                    maxLength : 6,
                    isNumeric : true
                },
                valid : false,
                touched : false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation : {
                    required : true
                },
                valid : false,
                touched : false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your Email'
                },
                value: '',
                validation : {
                    required : true,
                    isEmail : true
                },
                valid : false,
                touched : false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options : [
                        {value : 'fastest',displayValue:'Fastest'},
                        {value : 'cheapest',displayValue:'Chespest'},
                    ]
                },
                value: 'fastest',
                valid : true
            },
        },
        formIsValid : false
    }
    orderHandler = (event) =>{
        event.preventDefault();
        this.setState({loading : true});
        const formData = {};
        for(let formElementIndentifier in this.state.orderForm){
            formData[formElementIndentifier] = this.state.orderForm[formElementIndentifier].value;
        }
        const order = {
            ingredients : this.props.ings,
            price : this.props.price,
            orderData : formData,
            userId: this.props.userId
        }
        this.props.onOrderBurger(order,this.props.token);
    }

    inputChangedHandler = (event,inputIdentifier) =>{

        const updatedFormElement = updateObject(this.state.orderForm[inputIdentifier],{
                value : event.target.value,
                valid : checkValidity(event.target.value,this.state.orderForm[inputIdentifier].validation),
                touched : true
        });
        const updatedOrderForm = updateObject(this.state.orderForm,{
            [inputIdentifier] : updatedFormElement
        })
        let formIsValid = true;
        for(let inputIdentifier in updatedOrderForm){
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
        }
        this.setState({orderForm : updatedOrderForm,formIsValid : formIsValid})
    }
    render(){
        const formElementsArray = [];
        for(let key in this.state.orderForm){
            formElementsArray.push({
                id : key,
                config : this.state.orderForm[key]
            })
        }
        let form = (<form onSubmit={this.orderHandler}>
                    {formElementsArray.map(formElment =>(
                        <Input
                            key={formElment.id}
                            elementType={formElment.config.elementType}
                            elementConfig={formElment.config.elementConfig}
                            value={formElment.config.value}
                            changed={(event) =>this.inputChangedHandler(event,formElment.id)}
                            invalid={!formElment.config.valid}
                            shouldValidate = {formElment.config.validation}
                            touched={formElment.config.touched} />
                    ))}
                    <Button btnType = "Success" disabled={!this.state.formIsValid}>ORDER</Button>
                    </form>);
        if(this.props.loading){
            form = <Spinner/>;
        }
        return(
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        )
    }
}
const mapStateToProps = state =>{
    return {
        ings : state.burgerBuilder.ingredients,
        price : state.burgerBuilder.totalPrice,
        loading : state.order.loading,
        token : state.auth.token,
        userId : state.auth.userId
    }
}

const mapDispathToProps = dispatch =>{
    return {
        onOrderBurger : (orderData,token) => dispatch(actions.purchaseBurger(orderData,token))
    }
}
export default connect(mapStateToProps,mapDispathToProps) (withErrorHandler(ContactData,axios));