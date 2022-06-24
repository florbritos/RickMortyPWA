const botonComprobar = document.getElementById('comprobarLetra');
const inputLetra = document.getElementById('letra');
const divAdivinar = document.getElementById('juegoadivinar');
const spanOportunidades = document.getElementById('chances');
const divResultado = document.getElementById('resultadoAdivinador');
const divJuegoNuevo = document.getElementById('juegoNuevo');
const divPistas = document.getElementById('pistas');
const spanLetrasUsadas = document.getElementById('letrasUsadas');
//let imgAdivinar = document.getElementById('fotoAdivinar');





let listaPalabras;
let arrayPalabra;
let arrayAdivinar = [];
let chances=8;
let idAlAzar;

function inicializarJuego(){

    if(localStorage.principales){
        //debugger;
        arrayprincipales = JSON.parse(localStorage.principales);
        idAlAzar = Math.floor(Math.random()* 6);
        console.log('este es el id al azar', idAlAzar);
        listaPalabras= arrayprincipales[idAlAzar].name;
        arrayPalabra = listaPalabras.toLocaleLowerCase().split('');
        console.log('este es el arrayPalabra', arrayPalabra);
     
     //debugger;
     divPistas.innerHTML=`
        <div class="card mb-3" style="max-width: 500px;">
            <div class="row g-0">
                <div class="col-md-7">
                <img src="imagenes/pregunta.png" class="img-fluid rounded-start" alt="imagen con signo de pregunta" id="fotoAdivinar">
                </div>
                <div class="col-md-5">
                <div class="card-body">
                    <h5 id="tituloAdivinar" class="card-title">????</h5>
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
   //debugger;

    

    for (let l=0; l<arrayPalabra.length; l++){

        if(arrayPalabra[l]==' '){
            arrayAdivinar.push('</br>');
            l++;
        } 

        arrayAdivinar.push('_');

    }

     for(let u=0; u<arrayAdivinar.length; u++){
        //debugger;
         divAdivinar.innerHTML+=`${arrayAdivinar[u]} `;
    }

    spanOportunidades.innerHTML=`${chances}`;
    console.log('este es el array a adivinar', arrayAdivinar);
}

botonComprobar.addEventListener('click', (e)=>{
    let letra = inputLetra.value.toLocaleLowerCase();

    if(chances>0 && letra !==''){
        
        inputLetra.value='';
        //letrasUsadas.push(letra);
        spanLetrasUsadas.innerHTML+=`${letra} `;
        

        console.log('letra recibida', letra);
        //let indexLetra = arrayPalabra.indexOf(letra);
        let indexLetra=[];

        arrayPalabra.forEach((l, index) => { l == letra ? indexLetra.push({ l, index }): ''});
        console.log(indexLetra);

        
        if(indexLetra.length==0){
            console.log('no esta');
            chances--;
            spanOportunidades.innerHTML=`${chances}`;
            if(chances==0){
                //debugger;
                console.log('perdiste');
                divResultado.innerHTML=`<p class="fw-bold h3 p-3">Perdiste :( </p>`;
                botonComprobar.disabled =true;
                divJuegoNuevo.setAttribute('style','display: block;' );
                console.log(arrayprincipales[idAlAzar].image);
                console.log(arrayprincipales[idAlAzar].name);
                let img = document.getElementById('fotoAdivinar');
                img.src=`${arrayprincipales[idAlAzar].image}`;
                img.alt= `${arrayprincipales[idAlAzar].name}`;
                let titulo = document.getElementById('tituloAdivinar');
                titulo.innerHTML=`${arrayprincipales[idAlAzar].name}`;
                return;
            }

        }else{
            console.log('si esta');
            for(let j=0; j<indexLetra.length; j++){
                arrayAdivinar[indexLetra[j].index]=indexLetra[j].l;
            }
            // arrayAdivinar[indexLetra]=letra;
            console.log('asi va quedando', arrayAdivinar)
            mostrarLetras(arrayAdivinar);
        }
        console.log('estas son las chances que tenes todavia', chances);
    }else{
        console.log('las chances se acabaron o hay espacios');
    }

    

    
});

function mostrarLetras(arrayAdivinar){

    divAdivinar.innerHTML='';
    for(let i=0; i<arrayAdivinar.length; i++){
        divAdivinar.innerHTML+=`${arrayAdivinar[i]} `;
    }

    let indexGuion = arrayAdivinar.indexOf('_');
    if(indexGuion==-1){
        divResultado.innerHTML=`<p class="fw-bold h3 p-3">Ganaste!</p>`;
        botonComprobar.disabled =true;
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