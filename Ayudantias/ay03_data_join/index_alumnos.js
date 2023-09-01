// 0) Espacio para definir nuestras constantes, contenedores y referencias a SVG
const WIDTH = 800;
const HEIGHT = 450;

const margins = {
    top: 50,
    bottom: 60,
    left: 130,
    right: 30
}

let widthVis = WIDTH - margins.left - margins.right;
let heightVis = HEIGHT - margins.top - margins.bottom;

const svg = d3.select("#visualizacion")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);


const contenedorEjeYPaises = svg.append("g")
    .attr("transform", `translate(${margins.left}, ${margins.top})`);

const contenedorBarras = svg.append("g")
    .attr("transform", `translate(${margins.left},${margins.top})`);

const VeranoG = contenedorBarras.append("g")
    .attr("id", "VeranoG")
    .attr("transform", `translate(${widthVis / 2}, 0)`);

const invernoG = contenedorBarras.append("g")
    .attr("id", "inviernoG");

// 2) Definir una función para manejar los datos
const manejarDatos = (datos, categoria) => {
    top10 = datos.slice(0, 10);

    console.log("top10", top10);
    console.log("categoria", categoria);



}
// 3) Definir la función para generar la visualización

// 1) Lectura y Parseo de datos

d3.csv('Medallero Olimpico.csv', d => ({
    pais: d.Pais,
    Verano: {
        Oro: +d.V_Oro,
        Plata: +d.V_Plata,
        Bronce: +d.V_Bronce,
        Total: +d.V_Total
    },
    Invierno: {
        Oro: +d.I_Oro,
        Plata: +d.I_Plata,
        Bronce: +d.I_Bronce,
        Total: +d.I_Total
    }
}))
    .then(d => {
        let ordenados = d.sort((a, b) => b.Verano["Total"] - a.Verano["Total"]);

        manejarDatos(ordenados, "Total");
        const seleccion = document.getElementById("seleccion");
        seleccion.addEventListener("change", () => {
            const categoria = seleccion.selectedOptions[0].value;
            const ordenados = d.sort((a, b) => b.Verano[categoria] - a.Verano[categoria]);
            manejarDatos(ordenados, categoria)
        });

        const boton = document.getElementById("boton");
        boton.addEventListener("click", () => {
            // desordenar lista aleatoriamente
            const datosDesordenados = d.sort((a, b) => Math.random() - 0.5).slice(0, 5);
            const categoria = seleccion.selectedOptions[0].value;
            manejarDatos(datosDesordenados, categoria);
        });
    })
    .catch(error => console.log(error));









