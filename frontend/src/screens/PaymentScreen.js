import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Form, Button, Col} from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from "../components/CheckoutSteps";
import {savePaymentMethod} from '../actions/cartActions';

const PaymentScreen = ({history}) => {

    const cart = useSelector(state => state.cart);
    const {shippingAddress} = cart;

    if (!shippingAddress) {
        history.push("/shipping");
    }

    const [paymentMethod, setPaymentMethod] = useState('PayPal');

    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        history.push("/placeorder");
    }

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3 />
            <h1>Payment Method</h1>
            <form onSubmit={submitHandler}>

                <Form.Group>
                    <Form.Label as="legend">Select Method</Form.Label>
                    <Col>
                        <Form.Check 
                            type="radio" 
                            label="PayPal or Credit Card" 
                            id="Paypal"
                            name="paymentMethod"
                            value="PayPal"
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            checked>
                        </Form.Check>
                    </Col>
                </Form.Group>
                <Button type="submit" variant="primary">Continue</Button>

            </form>
        </FormContainer>
    )
}

export default PaymentScreen
