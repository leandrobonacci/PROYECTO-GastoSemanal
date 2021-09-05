//variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');
let cantidadTotal;




//eventos
eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    formulario.addEventListener('submit', agregarGasto);
}






//clases

class Presupuesto {
constructor(presupuesto){
    this.presupuesto = Number(presupuesto); //number convierto a numero;
    this.restante = Number(presupuesto);
    this.gastos = [];
}
nuevoGasto(gasto) {
    this.gastos = [...this.gastos, gasto];
   this.calcularRestante();
}
calcularRestante(){
    const gastado = this.gastos.reduce((total, gasto )=> total + gasto.cantidad, 0);
    this.restante = this.presupuesto - gastado;
}
limpiarHTML(){

    while(gastoListado.firstChild){
        gastoListado.removeChild(gastoListado.firstChild);
    }
}
eliminarGasto(id){
    
    this.gastos = this.gastos.filter (gasto=>gasto.id !== id);
    this.calcularRestante();

}
}
class UI {

insertarPresupuesto  ( cantidad ){

const {presupuesto, restante} = cantidad;
document.querySelector('#total').textContent = presupuesto;
document.querySelector('#restante').textContent = restante;
}
imprimirAlerta(mensaje, tipo){
const divMensaje = document.createElement('div');
divMensaje.classList.add('text-center', 'alert');
if(tipo === 'error'){
    divMensaje.classList.add('alert-danger');

}
else{
    divMensaje.classList.add('alert-success');
}
divMensaje.textContent = mensaje;

document.querySelector('.primario').insertBefore(divMensaje, formulario);

setTimeout(()=>{

    divMensaje.remove();
    
}, 3000);




}
actualizarRestante(restante){
    
    document.querySelector('#restante').textContent = restante;

    }

mostrarGastos(gastos){
    //iteramos
    presupuesto.limpiarHTML();

    gastos.forEach(gasto =>{
        const {cantidad, nombre, id} = gasto;
     
      
        // CREAMOS EL LI
       const nuevoGasto = document.createElement('li');
       nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
       nuevoGasto.dataset.id = id;
        


        // agregamos el html del gasto
    nuevoGasto.innerHTML = `${nombre} <span class ="badge badge-primary badge-pill">$ ${cantidad} </span>`
     


        //agregamos un btn al html

     const btnBorrar = document.createElement('button');
     btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
     btnBorrar.innerHTML = 'Borrar &times;';
     btnBorrar.onclick = ()=> {
         eliminarGasto(id);
     }
     nuevoGasto.appendChild(btnBorrar);
     gastoListado.appendChild(nuevoGasto);
     
    })

    }

    comprobarPresupuesto(presupuestObj){
        const {presupuesto, restante} = presupuestObj; //PRESUPUESTOBJ = PRESUPUESTO, SE LO PASE AL LLAMARLO SE LE PONE
                                                       //  CUALQUIER VARIABLE Y ASI EXTRAIGO EL CONTENIDO DEL OBJETO
        const restanteDiv = document.querySelector('.restante');
        //COMPROBAR 25%
        if((presupuesto / 4) > restante){
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        }
        else if((presupuesto / 2)> restante){
        restanteDiv.classList.remove('alert-success', 'alert-warning');
        restanteDiv.classList.add('alert-warning');
        }
        else{
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }
    }



}
//instanciar globalmente
const ui = new UI();
let presupuesto;

//funciones


function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto?');

    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario<=0){
        window.location.reload();
    }
    // Presupuesto valido luego de poner el presupuesto afuera para lograr obtener los datos fuera de la funcion

    presupuesto = new Presupuesto(presupuestoUsuario);
    
    ui.insertarPresupuesto(presupuesto);
}



function agregarGasto(e){
    e.preventDefault();
    //leer datos formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);
    //validamos
    if(nombre === '' || cantidad === ''){
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;
    }
        else if (cantidad <=0 || isNaN(cantidad) ) {
            ui.imprimirAlerta('Cantidad no valida', 'error');
            return;
        }
       //generar objeto con gasto

       const gasto = {nombre, cantidad, id: Date.now() };

       presupuesto.nuevoGasto(gasto); // esta dentro de la clase presupuesto

       ui.imprimirAlerta('Gasto agregado', '')

       ///imprimir gastos
       const {gastos, restante} = presupuesto; //pasamos solo los gastos osea (nombre cantidad e id)
       ui.mostrarGastos(gastos);
       ui.actualizarRestante(restante);
       ui.comprobarPresupuesto(presupuesto);    
       formulario.reset(); //reseteamos lo escrito
       

    }

    function eliminarGasto(id){
        //elimina del objeto
        presupuesto.eliminarGasto(id);
        //elimina del html
        const{gastos, restante} = presupuesto;
        ui.mostrarGastos(gastos);
        ui.actualizarRestante(restante);
        ui.comprobarPresupuesto(presupuesto); 
    }
    



