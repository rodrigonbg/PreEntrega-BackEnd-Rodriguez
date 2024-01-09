const express = require("express");
const router = express.Router();


//product manager
const CartManager = require("../controller/cart-manager.js")
//Instancia de productManager
const manager = new CartManager("./src/models/carrito.json")
//manager.setProducts(manager.products) //Crear el arrchivo json con array vacío



//ROUTING

/* ----------------------------------------GETs----------------------------------------------- */
//GET todos los carritos
router.get("/", async (req, res)=>{
    try {
        //Cargamos el array de carritos
        const carts = await manager.readCarts();
        return res.send(carts)
    } catch (error) {
        return res.send(`Error al procesar la solicitud. ERROR ${error}`)
    }
})

//carrito por ID
router.get("/:cid", async (req, res)=>{
    try{
        //Me guardo el id del carrito
        let cid = parseInt(req.params.cid)

        //guardo el carrito con ese id
        const cart = await manager.readCartbyId(cid)

        if(cart){
            return res.send(cart)
        }else{
            return res.send(`El carrito con ID:${cid} no se encuentra.`)
        }
    }catch(error){
        return res.send(`Error al procesar la solicitud. ERROR ${error}`)
    }
})

/* ----------------------------------------POSTs----------------------------------------------- */
//Crear un nuevo carrito
router.post("/", async (req, res)=>{
    try {
        //info del producto desde el body
        let {products = []} = req.body;

        //creo el carrito (Con ID auto generado)
        const resp = await manager.addNewCart(products)
        return res.send(resp)

    } catch (error) {
        return res.send(`Error al procesar la solicitud de crear el carrito. ERROR ${error}`)
    }
})

//Agregar prod a carrito
router.post("/:cid/products/:pid", async (req, res)=>{
    try {
        //Me guardo el id del carrito
        let cid = parseInt(req.params.cid)

        //Me guardo el id del prod
        let pid = parseInt(req.params.pid)
        
        //agrego el producto al carrito
        const resp = await manager.addProductToCart(cid, pid)
        res.send(resp)

    } catch (error) {
        res.send(`Error al procesar la solicitud de agregar producto al carrito. ERROR ${error}`)
    }
})



/* ----------------------------------------PUT----------------------------------------------- */




/* ----------------------------------------DELETE----------------------------------------------- */


module.exports = router;

