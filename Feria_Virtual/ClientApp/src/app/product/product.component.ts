import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/shared/utils.service'

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  private utilsService: UtilsService = new UtilsService();
  updating: boolean = false;
  categories = [];
  modesSale = ["Kilogramo", "Paquete", "Caja"];
  products = [{
    name:"Papa",
    availability:10,
    price:1000,
    image:"image",
    category:"Verdura",
    saleMode:"Kilogramo"
  }];
  actualProduct;

  constructor() { }

  ngOnInit() {
    this.utilsService.configureContextMenu();
  }

  /**
   * Metodo para almacenar un nuevo producto
   */
  saveProduct() {
    let name = (document.getElementById("productName") as HTMLInputElement);
    let availability = (document.getElementById("availability") as HTMLInputElement);
    let price = (document.getElementById("price") as HTMLInputElement);
    //(document.getElementById("productImage") as HTMLInputElement).value = this.actualProduct.image;
    let category = document.getElementById("categoryDropdown");
    let saleMode = document.getElementById("saleModeDropdown");

    if (name.value == '' || availability.value == '' || price.value == '') {
      this.utilsService.showInfoModal("Error", "Por favor complete todos los campos.", "saveMsjLabel", "msjText", 'saveMsj');
    } else {
      let availabilityN = Number(availability.value);
      let priceN = Number(price.value);

      var product = {
        name:name.value, availability:availabilityN, 
        price:priceN, image:'image', category:category.textContent, 
        saleMode:saleMode.textContent}

      if (this.updating) {
        this.utilsService.showInfoModal("Exito", "Producto actualizado correctamente.", "saveMsjLabel", "msjText", 'saveMsj');
        let indexProduct = this.products.indexOf(this.actualProduct);
        this.products[indexProduct] = product;
        this.updating = false;
      } else {
        this.utilsService.showInfoModal("Exito", "Nuevo producto guardado correctamente.", "saveMsjLabel", "msjText", 'saveMsj');
        this.products.push(product);
      }
      this.utilsService.cleanField([name, availability, price], [category, saleMode], ["Categoria", "Modo de venta"]);
    }
  }

  /**
   * Metodo para actualizar un producto seleccionado
   */
  updateProduct() {
    this.updating = true;
    (document.getElementById("productName") as HTMLInputElement).value = this.actualProduct.name;
    (document.getElementById("availability") as HTMLInputElement).value = this.actualProduct.availability;
    (document.getElementById("price") as HTMLInputElement).value = this.actualProduct.price;
    //(document.getElementById("productImage") as HTMLInputElement).value = this.actualProduct.image;
    document.getElementById("categoryDropdown").textContent = this.actualProduct.category;
    document.getElementById("saleModeDropdown").textContent = this.actualProduct.saleMode;
  }

  /**
   * Metodo para eliminar un producto
   */
  deleteProduct() {
    document.getElementById('optionMsj').style.setProperty('display', 'none');
    const index = this.products.indexOf(this.actualProduct, 0);
    this.products.splice(index, 1);
  }

  /**
   * Metodo para obtener las categorias almacenadas
   */
  getCategories():void {
    //get categories saved
  }

  /**
   * Metodo para colocar la categoria seleccionada
   * @param category Categoria seleccionada
   */
  setCategory(category: string):void {
    document.getElementById("categoryDropdown").textContent = category;
  }

  /**
   * Metodo para colocar el modo de venta seleccionado
   * @param saleMode Modo de venta seleccionado
   */
  setSaleMode(saleMode: string):void {
    document.getElementById("saleModeDropdown").textContent = saleMode;
  }

  /**
   *Metodo que se llama cuando se presiona click derecho en el item de la tabla
   * @param event Evento de click derecho
   * @param product Producto seleccionado
   */
  onProducerClick(event:any, product:any): boolean {
    this.utilsService.showContextMenu(event);
    this.actualProduct = product;
    return false;
  }

  /**
   * Metodo para mostrar al usuario un modal para tomar una decision de si o no
   */
  askUser() {
    this.utilsService.showInfoModal("Eliminar", "Esta seguro que desea eliminar el producto: " + this.actualProduct.name,
    "optionMsjLabel", "optionText", "optionMsj");
  }

   /**
   * Metodo para cerrar un modal
   * @param id Id del modal a cerrar
   */
  closeModal(id: string): void {
    document.getElementById(id).style.setProperty('display', 'none');
  }

}
