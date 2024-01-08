const express = require("express");
const router = express.Router();


//product manager
const ProductManager = require("../controller/product-manager.js")
//Instancia de productManager
const manager = new ProductManager("./src/models/productos.json")
//manager.setProducts(manager.products)  //Crear el arrchivo json con array vacío



//ROUTING

/* ----------------------------------------GETs----------------------------------------------- */
//Productos por querys
router.get("/", async (req, res)=>{
    try {
        //Cargamos el array de productos
        const arrayProductos = await manager.readProducts();

        //Guardamos el query
        let limit = parseInt(req.query.limit);

        //Si hay limite, filtaramos el array, de lo contrario mostramos todos los elementos
        if(limit){
            const arrayConLimite = arrayProductos.slice(0, limit)
            return res.send(arrayConLimite)
        }else{
            return res.send(arrayProductos)
        }
    } catch (error) {
        console.log(error);
        return res.send('Error al procesar la solicitud')
    }
})

//productos por ID
router.get("/:pid", async (req, res)=>{
    try{
        //Me guardo el id 
        let pid = parseInt(req.params.pid)

        //guardo el prod con ese id
        const prod = await manager.readProductsbyId(pid)

        if(prod){
            return res.send(prod)
        }else{
            return res.send("ID del producto incorrecto.")
        }
    }catch(error){
        console.log(error);
        return res.send('Error al procesar la solicitud')
    }
})


/* ----------------------------------------POST----------------------------------------------- */
router.post("/", async (req, res)=>{
    try {
        //info del producto desde el body
        let {title, description, price, thumbnail, code, status=true, stock} = req.body;

        const newProduct ={
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            status: status,
            stock: stock
        }

        //agrego el producto (Con ID auto generado)
        await manager.addProduct(newProduct)
        return res.send('Producto agregado')
    } catch (error) {
        console.log(error);
        return res.send('Error al procesar la solicitud')
    }
})


/* ----------------------------------------PUT----------------------------------------------- */
router.put("/:pid", async (req, res)=>{
    try {
        //Me guardo el id 
        let pid = parseInt(req.params.pid)

        //info del producto desde el body
        let {title, description, price, thumbnail, code, status=true, stock} = req.body;

        const newProduct ={
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            status,
            stock: stock
        }

        //actualizo el producto (sin actualizar ID)
        await manager.updateProduct(pid, newProduct)
        return res.send('Producto actualizado')
    } catch (error) {
        console.log(error);
        return res.send('Error al actualizar el producto')
    }
})


/* ----------------------------------------DELETE----------------------------------------------- */
router.delete("/:pid", async (req, res)=>{
    try {
        //Me guardo el id 
        let pid = parseInt(req.params.pid)
        await manager.deleteProduct(pid)
        return res.send(`Producto de id ${pid} borrado con exito!!`)

    }catch(error){
        console.log(error);
        return res.send('Error al eliminar el producto')
    }
})



module.exports = router;