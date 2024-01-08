const fs = require("fs");

module.exports = class CartManager {
    constructor (path) {
        this.path = path;
        this.cart = []
    }

    async addProduct(id, cantidad=1){
        //Para agregar un producto al carrito, le paso directamente el id del prod y la cantidad que por defecto es 1
        //Si el id ya está carrito, actualizo la acantidad. De lo contrario lo agrego.

        //Busco si el elemento ya está en el carrito
        const index = await this.cart.findIndex((item)=> item.id == id)

        if (index != -1){
            //Codigo para actualizar
            this.updateAmountProduct(id, this.cart[index].quantity + cantidad)
        }else{
            //Código para agregar
            
            const newProduct ={
                id : id,
                quantity: cantidad
            }
            //Agrego el objeto al array
            this.cart.push(newProduct);
    
            //Guardo el array de productos del carrito en un archivo JSON
            await this.setProducts(this.cart)
        }
    }
/*   
    -------------METODOS USADOS PARA MOSTRAR LOS ReadProducts POR CONSOLA--------------

    async getProducts() {
        //traigo los productos con el metodo redProducts y los muestro por consola.
        const products = await this.readProducts();
        console.log('ARRAY DE PRODUCTOS --------------------------------');
        console.log(products);
        console.log('\n')
    }

    async getProductsById (id){
        //
        const prod = await this.readProductsbyId(id)

        if (prod === undefined){
            console.log(`No se encontro un producto con el ID ${id}.\n`);
        }else{
            console.log(`PRODUCTO CON ID ${id} ----------------------------`);
            console.log(prod); 
            console.log('\n')
        }
    }
*/     
    async readProducts () {
        if (fs.existsSync(this.path)){
            const arrayProductosCarrito = await fs.promises.readFile(this.path, 'utf-8')
                .then(data => JSON.parse(data))
                .catch(err => console.log (`Ocurrió un error durante la lectura del archivo de productos del carrito: (${err})`))
            return arrayProductosCarrito
        }else{
            console.log(`No se encontró el archivo del Carrito en la ruta especificada (${this.path})`)
        }
    }

    async readProductsbyId(id) {
        if (fs.existsSync(this.path)){
            const productoCarrito = await fs.promises.readFile(this.path, 'utf-8')
                .then(data => JSON.parse(data))
                .then(res => res.find(item => item.id == +id))
            return productoCarrito
        }else{
            console.log(`No se encontró el archivo del carrito en la ruta especificada (${this.path})`)
        }
    }

    async setProducts(arrayProducts){
        await fs.promises.writeFile(this.path, JSON.stringify(arrayProducts, null, 2))
            .catch(err => console.log(`Ocurrió un error al guardar los productos: ${err}`))
    }

    async deleteProduct(id){
        try {
            //traigo los productos
            const updatedCart = await this.readProducts()

            //Guardo el indice del producto a eliminar
            const index = await updatedCart.findIndex(item => item.id == id)
  
            if (index !== -1){
                //Elimino el producto y lo guardo en el array de la clase
                await updatedCart.splice(index, 1); 
                this.cart = updatedCart

                //Guardo el array de productos sin el eliminado en el archivo JSON
                await this.setProducts(this.cart)
                    .then(()=> console.log(`producto con id: ${id} borrado del carrito`))
            }else{
                console.log(`No se encontró un producto con el id: ${id} en el carrito`)
            }

        } catch (error) {
            console.log(`Error al eliminar el producto del carrito. Error: ${error}`)
        }
    }

    async updateAmountProduct(id, nuevaCantidad){
        try{
            //Traigo la lista de productos del carrito
            const updatedCart = await this.readProducts()

            //Busco el index del elemento con el id
            const index = await updatedCart.findIndex((item)=> item.id == id)    
            updatedCart[index].quantity = nuevaCantidad

            //actiualizo el array de la clase
            this.cart = updatedCart;
    
            //Guardo el array de productos actualizdo en un archivo JSON
            await this.setProducts(this.cart)

        }catch(err){
            console.log(`Error al actualizar la cantidad del producto en el carrito: ${err}`)
        }
    }
}