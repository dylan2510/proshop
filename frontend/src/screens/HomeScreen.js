import React, {useEffect} from 'react';
import {Helmet} from 'react-helmet';

// components
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousell from '../components/ProductCarousell';

// redux libraries
import {useDispatch, useSelector} from 'react-redux';
import {listProducts} from '../actions/productActions';

// style
import Product from '../components/Product';
import {Row, Col} from 'react-bootstrap';


const HomeScreen = ({match}) => {

    const keyword = match.params.keyword;

    // pagination
    const pageNumber = match.params.pageNumber || 1

    const dispatch = useDispatch();

    // access state from store reducer
    const productList = useSelector(state => state.productList);
    const {loading, error, products, page, pages} = productList;

    useEffect(() => {
        // dispatch action
        dispatch(listProducts(keyword, pageNumber));
    }, [dispatch, keyword, pageNumber]);

    return (
        <>
            <Helmet>
                <title>Welcome to Dylan's Proshop | Home</title>
                <meta name="description" content="e-commerce shop at cheap prices"></meta>
                <meta name="keywords" content="e-commerce, shop, cheap prices, electronics, dylan"></meta>
            </Helmet>
            {!keyword && <ProductCarousell />}
            <h1>Lastest Products</h1>
            {
                loading ? ( <Loader /> ) : 
                error ? ( <Message variant="danger">{error}</Message> ) :
                (
                    <>
                    <Row>
                    {
                        products.map(product => {
                            return (
                                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                    <Product product={product} />
                                </Col>
                            )
                        })
                    }
                    </Row>
                    <Paginate 
                        pages={pages} 
                        page={page} 
                        keyword={keyword ? keyword : ""} 
                    />
                    </>
                )
            }
        </>
    )
}

export default HomeScreen
