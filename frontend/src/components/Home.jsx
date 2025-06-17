import React from 'react'
import MetaData from "./layout/MetaData";
import ProductItem from './product/ProductItem';
import Loader from './layout/Loader';

import { useGetProductsQuery } from "../redux/api/productsApi";

const Home = () => {
    
    
    const { data, isLoading  } = useGetProductsQuery();
    console.log(data)
    

     if (isLoading) return <Loader />;
    
    return (
    <>
      <MetaData title="Buy Best Product Online" />
      <div className='row'>
        <div className="col-6 col-md-12">
            <h1 id="products_heading" className='text-secondary'>Latest Products</h1>
           <section id='products' className='mt-5'>
             <div className="row">
                {
                  data?.products?.map((product) => (
                  <ProductItem product={product} />
                  ))
                }
             </div>
           </section>
        </div>
      </div>
    </>
    )
}

export default Home