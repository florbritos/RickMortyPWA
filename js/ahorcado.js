const botonComprobar = document.getElementById('comprobarLetra');
const inputLetra = document.getElementById('letra');
const divAdivinar = document.getElementById('juegoadivinar');
const spanOportunidades = document.getElementById('chances');
const divResultado = document.getElementById('resultadoAdivinador');
const divJuegoNuevo = document.getElementById('juegoNuevo');
const divPistas = document.getElementById('pistas');
const spanLetrasUsadas = document.getElementById('letrasUsadas');
const divFormAdivinar = document.getElementById('formAdivinar');

let listaPalabras;
let arrayPalabra;
let arrayAdivinar = [];
let chances=8;
let idAlAzar;

function inicializarJuego(){

    if(localStorage.principales){
        arrayprincipales = JSON.parse(localStorage.principales);
        idAlAzar = Math.floor(Math.random()* 5);
        listaPalabras= arrayprincipales[idAlAzar].name;
        arrayPalabra = listaPalabras.toLocaleLowerCase().split('');
       
     divPistas.innerHTML=`
        <div class="card mb-3" style="max-width: 500px;">
            <div class="row g-0 align-items-center">
                <div class="col-md-7">
                <img src="imagenes/pregunta.png" class="img-fluid rounded-start" alt="imagen con signo de pregunta" id="fotoAdivinar">
                </div>
                <div class="col-md-5">
                <div class="card-body">
                    <h5 id="tituloAdivinar" class="card-title">Nombre: ????</h5>
                    <p class="card-text">Especie: ${arrayprincipales[idAlAzar].species}</p>
                    <p class="card-text">Sexo: ${arrayprincipales[idAlAzar].gender}</p>
                </div>
                </div>
            </div>
        </div>
     `;
    }
    empezarJuego();
}



function empezarJuego(){ 

    for (let l=0; l<arrayPalabra.length; l++){

        if(arrayPalabra[l]==' '){
            arrayAdivinar.push('</br>');
            l++;
        } 
        arrayAdivinar.push('_');
    }

     for(let u=0; u<arrayAdivinar.length; u++){
         divAdivinar.innerHTML+=`${arrayAdivinar[u]} `;
    }

    spanOportunidades.innerHTML=`${chances}`;
    console.log('este es el array a adivinar', arrayAdivinar);
}

botonComprobar.addEventListener('click', (e)=>{
    let letra = inputLetra.value.toLocaleLowerCase();

    if(chances>0 && letra !==''){
        
        inputLetra.value='';
        spanLetrasUsadas.innerHTML+=`${letra} `;
        
        console.log('letra recibida', letra);
        let indexLetra=[];

        arrayPalabra.forEach((l, index) => { l == letra ? indexLetra.push({ l, index }): ''});
        console.log(indexLetra);

        
        if(indexLetra.length==0){
            console.log('no esta');
            chances--;
            spanOportunidades.innerHTML=`${chances}`;
            if(chances==0){

                divResultado.innerHTML=`<p class="fw-bold p-3 text-uppercase rojo"> Perdiste :( </p>`;
                botonComprobar.disabled =true;
                divJuegoNuevo.setAttribute('style','display: block;' );
                console.log(arrayprincipales[idAlAzar].image);
                console.log(arrayprincipales[idAlAzar].name);
                let img = document.getElementById('fotoAdivinar');
                img.src=`${arrayprincipales[idAlAzar].image}`;
                img.alt= `${arrayprincipales[idAlAzar].name}`;
                let titulo = document.getElementById('tituloAdivinar');
                titulo.innerHTML=`${arrayprincipales[idAlAzar].name}`;
                divFormAdivinar.setAttribute('style','display:none;');
                return;
            }

        }else{
            console.log('si esta');
            for(let j=0; j<indexLetra.length; j++){
                arrayAdivinar[indexLetra[j].index]=indexLetra[j].l;
            }
            mostrarLetras(arrayAdivinar);
        }
    }
    
});

function mostrarLetras(arrayAdivinar){

    divAdivinar.innerHTML='';
    for(let i=0; i<arrayAdivinar.length; i++){
        divAdivinar.innerHTML+=`${arrayAdivinar[i]} `;
    }

    let indexGuion = arrayAdivinar.indexOf('_');
    if(indexGuion==-1){
        divResultado.innerHTML=`<p class="fw-bold p-3 text-uppercase verde">Ganaste!</p>`;
        botonComprobar.disabled =true;
        divFormAdivinar.setAttribute('style','display:none;');
        divJuegoNuevo.setAttribute('style','display: block;' );
        let img = document.getElementById('fotoAdivinar');
        img.src=`${arrayprincipales[idAlAzar].image}`;
        img.alt= `${arrayprincipales[idAlAzar].name}`;
        let titulo = document.getElementById('tituloAdivinar');
        titulo.innerHTML=`${arrayprincipales[idAlAzar].name}`;
    }

}

function nuevoJuego(){
    //debugger;
    botonComprobar.disabled=false;
    divAdivinar.innerHTML='';
    spanOportunidades.innerHTML='';
    divResultado.innerHTML='';
    divJuegoNuevo.setAttribute('style','display: none;' );
    arrayAdivinar=[];
    chances=8;
    spanLetrasUsadas.innerHTML='';
    divFormAdivinar.setAttribute('style','display:block;')
    inicializarJuego();
}

inicializarJuego();

window.addEventListener('offline', event => {
    console.log('Se ha perdido la conexión con Internet.');
    alert('No hay conexión con Internet. El sitio está trabajando de forma Offline.', 'danger')
})

window.addEventListener('online', event => {
    console.log('Se ha recuperado la conexión con Internet');
    alert('Se ha recuperado la conexión con Internet. El sitio está trabajando de forma Online.', 'success')
})

if (!navigator.onLine){
    console.log('Se ha perdido la conexión con Internet.');
}