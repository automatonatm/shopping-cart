import React, {useState} from 'react';
import {useQuery} from "react-query";
import {LinearProgress, Drawer, Badge} from "@mui/material";
import Grid from "@mui/material/Grid";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';



import Item from './item/Item'

//Styles

import {Wrapper, StyledButton} from './App.styles'
import Cart from "./cart/Cart";

export type CartItemType = {
    id: number,
    category: string,
    description: string,
    image: string,
    price: number,
    title: string,
    amount: number
}


const getProducts = async (): Promise<CartItemType[]> => await (await fetch('https://fakestoreapi.com/products')).json()


const App = () =>  {

    const [cartOpen, setCartOpen] = useState(false)

    const [cartItems, setCartItem] = useState([] as CartItemType[])

    const {data, isLoading, error} = useQuery<CartItemType[]>(
        'products',
        getProducts
    )

    const totalItems = (items: CartItemType[]): number => {
        return items.reduce((a: number, item) => a + item.amount, 0)
    }

    const handleAddToCart = (clickedItem: CartItemType): void => {
        setCartItem(prevState => {
            const isItemInCart = prevState.find(item => item.id === clickedItem.id)
            if(isItemInCart) {
                return prevState.map(item => (
                    item.id === clickedItem.id ? {...item, amount: item.amount+ 1} : item
                ))
            }
            return  [...prevState, {...clickedItem, amount:  1}]
        })
    }

    const handleRemoveFromCart = (id: number) => {
        setCartItem(prevState => (
            prevState.reduce((acc, item) => {
                if(item.id === id) {
                    if(item.amount === 1) return  acc
                    return [...acc, {...item, amount: item.amount - 1}]
                }else  {
                    return [...acc, item]
                }
            }, [] as CartItemType[])
        ))
    }

    if(isLoading) return <LinearProgress />;
    if(error) return <div>Something went wrong</div>;

  return (
    <Wrapper>
        <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
            <Cart cartItems={cartItems} addToCart={handleAddToCart} removeFromCart={handleRemoveFromCart} />
        </Drawer>

        <StyledButton onClick={() => setCartOpen(true)}>
            <Badge badgeContent={totalItems(cartItems)} color="error">
                <AddShoppingCartIcon/>
            </Badge>
        </StyledButton>
        <Grid container spacing={3}>
          {
              data?.map(item => (
                  <Grid item key={item.id} xs={12} sm={4}>
                      <Item item={item} handleAddToCart={handleAddToCart} key={item.id}/>
                  </Grid>

              ))
          }
        </Grid>
    </Wrapper>
  );
}

export default App;
