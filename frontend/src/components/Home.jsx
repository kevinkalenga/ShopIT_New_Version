import React, {useEffect} from 'react'
import MetaData from "./layout/MetaData";
import ProductItem from './product/ProductItem';
import Loader from './layout/Loader';
import toast from 'react-hot-toast';

import { useGetProductsQuery } from "../redux/api/productsApi";

const Home = () => {
    
    
    const { data, isLoading, error, isError} = useGetProductsQuery();
    console.log(data)
    
     useEffect(() => {
        if (isError) {
            toast.error(error?.data?.message || "Erreur lors du chargement des produits");
        }
    }, [isError]);

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