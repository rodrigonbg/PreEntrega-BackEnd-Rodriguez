const express = require("express");
const router = express.Router();


//product manager
const CartManager = require("../controller/cart-manager.js")
//Instancia de productManager
const manager = new CartManager("./src/models/carrito.json")
//manager.setProducts(manager.products) //Crear el arrchivo json con array vacío



//ROUTING

//GET todos los productos del carrito 
router.get("/carts", async (req, res)=>{
    try {
        //Cargamos el array de productos
        const cart = await manager.readProducts();
        return res.send(cart)
    } catch (error) {
        console.log(error);
        return res.send('Error al procesar la solicitud')
    }
})

//productos por ID
router.get("/carts/:pid", async (req, res)=>{
    try{
        //Me guardo el id 
        let pid = parseInt(req.params.pid)

        //guardo el prod con ese id
        const prod = await manager.readProductsbyId(pid)

        if(prod){
            return res.send(prod)
        }else{
            return res.send(`El producto con ID:${pid} no se encuentra en el carrito.`)
        }
    }catch(error){
        console.log(error);
        return res.send('Error al procesar la solicitud')
    }
})



module.exports = router;