import React from 'react'
import { useLocation } from 'react-router-dom'

const ViewProuct = () => {
          const location = useLocation();
          console.log(location.state.product)
          const { productName, price, qty, imageUrl } = location.state.product
          return (
                    <>
                              <h5> Product Name:{productName}</h5>
                              <h5> Product Price:{price}</h5>
                              <h5> Product Qty:{qty}</h5>
                              <img src={imageUrl} alt="" />
                    </>
          )
}

export default ViewProuct