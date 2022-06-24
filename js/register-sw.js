// Chequeo si el browser soporta Service Worker
if ('serviceWorker' in navigator){
    navigator.serviceWorker.register("../sw.js").then((message)=>{
        console.log('ServiceWorker está funcionando correctamente');
    });
} else {
    console.log('ServiceWorker no es soportado.');
}