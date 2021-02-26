import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Link} from 'react-router-dom';
import {Carousel, Image} from 'react-bootstrap';
import Loader from './Loader';
import Message from './Message';
import {listTopProducts} from '../actions/productActions';


const ProductCarousell = () => {

    const dispatch = useDispatch();

    const productTopRated = useSelector(state => state.productTopRate);
    const {loading, error, products} = productTopRated;

    useEffect(() => {
        dispatch(listTopProducts())
    },[dispatch]);

    return loading ? <Loader /> : 
            error ? <Message variant="danger">{error}</Message> :
            (
                <Carousel pause='hover' className='bg-dark'>
                    {
                        products.map(product => {
                            return (
                                <Carousel.Item key={product._id}>
                                    <Link to={`/product/${product._id}`}>
                                        <Image src={product.image} alt={product.name} fluid />
                                        <Carousel.Caption className='caurosel-caption' >
                                            <h2>{product.name} {product.price}</h2>
                                        </Carousel.Caption>
                                    </Link>
                                </Carousel.Item>
                            )
                        })
                    }
                </Carousel>
            )

}

export default ProductCarousell