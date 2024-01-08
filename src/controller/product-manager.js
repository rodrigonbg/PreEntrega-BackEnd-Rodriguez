const fs = require("fs");

module.exports = class ProductManager {
    static IdProduct = 0; //pertenece a la calse, asi que guarda el ultimo id usado

    constructor (path) {
        this.path = path;
        this.products = []
    }

    async addProduct(Objeto){
        //Desestructuro el objeto para hacer las validaciones.
        let {title, description, price, thumbnail, code, status = true, stock} = Objeto;

        //valido campos no vacios y que code no se repita
        if(!title || !description || !price || !thumbnail || !code || !stock){
            console.log('Deben completarse todos los campos.\n');
            return;
        }else if (this.products.some(prod => prod.code === code)){
            console.log('El código debe ser único.\n');
            return;
        }else{
            const newProduct ={
                id : ++ProductManager.IdProduct,
                title: title,
                description: description,
                price: price,
                thumbnail: thumbnail,
                code: code,
                status: status,
                stock: stock
            }

            //Agrego el objeto al array
            console.log(this.products)
            //await this.products.push(newProduct);

            //Guardo el array de productos en un archivo JSON
            //await this.setProducts(this.products)
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
            const arrayProductos = await fs.promises.readFile(this.path, 'utf-8')
                .then(data => JSON.parse(data))
                .catch(err => console.log (`Ocurrió un error durante la lectura del archivo: (${err})`))
            return arrayProductos
        }else{
            console.log(`No se encontró el archivo en la ruta especificada (${this.path})`)
        }
    }

    async readProductsbyId(id) {
        if (fs.existsSync(this.path)){
            const producto = await fs.promises.readFile(this.path, 'utf-8')
                .then(data => JSON.parse(data))
                .then(res => res.find(item => item.id == +id))
            return producto
        }else{
            console.log(`No se encontró el archivo en la ruta especificada (${this.path})`)
        }
    }

    async setProducts(arrayProducts){
        await fs.promises.writeFile(this.path, JSON.stringify(arrayProducts, null, 2))
            .catch(err => console.log(`Ocurrió un error al guardar los productos: ${err}`))
    }

    async deleteProduct(id){
        try {
            //traigo los productos
            const productos = await this.readProducts()

            //Guardo el indice del producto a eliminar
            const index = await productos.findIndex(item => item.id == id)
  
            if (index !== -1){
                //Elimino el producto y lo guardo en el array de la clase
                await productos.splice(index, 1); 
                this.products = productos

                //Guardo el array de productos sin el eliminado en el archivo JSON
                await this.setProducts(this.products)
                    .then(()=> console.log(`producto con id: ${id} borrado`))
            }else{
                console.log(`No se encontró un producto con el id: ${id}`)
            }

        } catch (error) {
            console.log(`Error al eliminar el producto: ${error}`)
        }
    }

    async updateProduct(id, updatedProd){
        try{
            //Desestructuro el producto actualizado y creo un nuevo objeto para agregarlo al array de productos.
            let {title, description, price, thumbnail, code, status=true, stock} = updatedProd;
            const updatedProduct = {
                id : id,
                title: title,
                description: description,
                price: price,
                thumbnail: thumbnail,
                code: code,
                status : status,
                stock: stock
            }

            //traigo la lista de productos del arvhivo JSON
            const updatedProducts = await this.readProducts()
    
            //Busco el index del elemento con el id y lo sobreescribo en el array
            const index = await updatedProducts.findIndex((item)=> item.id == id)    
            updatedProducts[index] = updatedProduct
    
            
            //actiualizo el array de la clase
            this.products = updatedProducts;
    
            //Guardo el array de productos actualizdo en un archivo JSON
            await this.setProducts(this.products)

        }catch(err){
            console.log(`Error al actualizar el producto: ${err}`)
        }
    }
}

