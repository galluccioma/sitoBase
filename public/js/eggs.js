//Cambio titolo 

let prevTitle = document.title;
document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === 'visible') {
        document.title = "Pronto a lanciare la tua idea? 🌞";
        setTimeout(function () {
            document.title = prevTitle;
        }, 1000);
    } else {
        document.title = "Ci dispiace che te ne vada ⛅";
    }
});