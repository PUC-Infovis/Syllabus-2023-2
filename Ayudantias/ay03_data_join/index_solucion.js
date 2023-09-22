// 0) Espacio para definir nuestras constantes, contenedores y referencias a SVG
const WIDTH = 800;
const HEIGHT = 450;

const margins = {
    top: 50,
    bottom: 60,
    left: 130,
    right: 30
}
// Definimos el espacio que tenemos para la visualización, tanto el ancoh como el alto
let widthVis = WIDTH - margins.left - margins.right;
let heightVis = HEIGHT - margins.top - margins.bottom;

// Encontramos en el archivo html el contenedor SVG que va a contener la visualización
const svg = d3.select("#visualizacion")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);

// Agregamos los distintos contenedores para los ejes y las barras
const contenedorEjeYPaises = svg.append("g")
    .attr("transform", `translate(${margins.left}, ${margins.top})`);

const contenedorBarras = svg.append("g")
    .attr("transform", `translate(${margins.left},${margins.top})`);

// Importante notar como este eje lo trasladamos a la mitad de la visualización 
//para contener las barras que ubicamos a la derecha
const VeranoG = contenedorBarras.append("g")
    .attr("id", "VeranoG")
    .attr("transform", `translate(${widthVis / 2}, 0)`);

const invernoG = contenedorBarras.append("g")
    .attr("id", "inviernoG");

// 2) Definir una función para manejar los datos
const manejarDatos = (datos, categoria) => {
    //Seleccionamos una fraccion de los datos para que quepan en la visualizacion de buena manera
    top10 = datos.slice(0, 10);
    // Creamos la escala para el eje y tomando como dominion los nombres de los paises
    // de esta manera cada barra se posiciona en el lugar correcto y asociamos cada pais con su posicion
    const escalaY = d3.scaleBand()
        .domain(top10.map(d => d.pais))
        .range([0, heightVis])
        .paddingInner(0.1)
        .paddingOuter(0.3);

    const ejeY = d3.axisLeft(escalaY);
    contenedorEjeYPaises.call(ejeY);
    // creamos la escala para el eje x tomando como dominio los valores de la categoria seleccionada
    const escalaXVerano = d3.scaleLinear()
        .domain([0, d3.max(top10, d => d.Verano[categoria]) * 1.1])
        .range([0, widthVis / 2]);

    // Esta es la parte importante donde hacemos el data join para las barras de categoria verano
    VeranoG.selectAll(".pais")  // selecionamos todo lo que tenga la clase pais
        .data(top10, d => d.pais)  // le decimos a d3 que utilice el nombre del pais como identificador para cada dato... 
        .join(
            // primero definimos el enter, cada dato nuevo para d3 utiliza esta función, 
            //  se decide si es nuevo o no segun el identificador que le pasamos antes (en este caso el nombre de cada país)
            enter => {
                // usamos la constante para modificar el mismo "g" por cada dato
                const pais = enter.append("g").attr("class", "pais");
                // agregamos un rectangulo para cada uno
                pais.append("rect").attr("x", 0)
                    .attr("y", d => escalaY(d.pais))
                    .attr("width", d => escalaXVerano(d.Verano[categoria])) //usando la escala para el largo del dato
                    .attr("height", escalaY.bandwidth()) // esto es una constante de la escala que nos da el alto de cada barra
                    .attr("fill", "#7A6C5D") // escogemos un color arbitrario
                    .attr("opacity", 1);

                // agregamos un texto para cada uno con el valor de la categoria seleccionada
                pais.append("text")
                    .attr("x", d => escalaXVerano(d.Verano[categoria]) + 20) // +20 lo deja mas a la derecha para que no quede tan pegado al final de la barra
                    .attr("y", d => escalaY(d.pais) + escalaY.bandwidth() / 2) // lo posicionamos de manera que quede en la mitad de la barra
                    .text(d => d.Verano[categoria]) // dejamos como texto el valor del dato
                    .attr("font-size", 10)
                    .attr("fill", "black");

                return pais

            },
            // luego definimos el update, cada dato que ya existia en el svg utiliza esta función
            // tenemos que modificar el mismo "g" que ya existia y actualizar los valores por si cambiamos el tipo de medallas que queremos ver
            update => {
                // modificamos el rectangulo para cada uno y volvemos a setear los valores para que se actualizcen
                update.select("rect")
                    .attr("y", d => escalaY(d.pais))
                    .attr("width", d => escalaXVerano(d.Verano[categoria]))
                    .attr("height", escalaY.bandwidth())
                    .attr("opacity", 0.5); // la unica modificación que hacemos para notar algun cambio es el de la opacidad

                // asi como cambiamos el valor del ancho tambein tenemos que cambiar el valor del texto
                update.select("text")
                    .text(d => d.Verano[categoria])
                    .attr("x", d => escalaXVerano(d.Verano[categoria]) + 20)
                    .attr("y", d => escalaY(d.pais) + escalaY.bandwidth() / 2)

                // Es muy importante que al final de cada update retornemos el mismo elemento que recibimos
                return update
            },
            // por ultimo definimos el exit, cada dato que ya no existe en el svg utiliza esta función
            exit => {
                // lo unico que hacemos es remover el elemento del svg
                return exit.remove();
            }
        )

        // hacemos lo mismo para la categoria de invierno pero en el otro contenedor
    const escalaXInvierno = d3.scaleLinear()
        .domain([0, d3.max(top10, d => d.Invierno[categoria]) * 3])
        .range([0, widthVis / 2]);



    invernoG.selectAll("rect")
        .data(top10)
        .join("rect")
        .attr("x", d => widthVis / 2 - escalaXInvierno(d.Invierno[categoria])) // cambiamos la posicion en x para que quede a la izquierda
        .attr("y", d => escalaY(d.pais))
        .attr("width", d => escalaXInvierno(d.Invierno[categoria]))
        .attr("height", escalaY.bandwidth())
        .attr("fill", "#C17C74");

    invernoG.selectAll("text")
        .data(top10)
        .join("text")
        .attr("x", d => widthVis / 2 - escalaXInvierno(d.Invierno[categoria]) - 20)
        .attr("y", d => escalaY(d.pais) + escalaY.bandwidth() / 2)
        .text(d => d.Invierno[categoria])
        .attr("font-size", 10)
        .attr("fill", "black");
}

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
        // conectamos los botones con las funciones que definimos antes para actualizar los datos cada vez que se cambia la categoria
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









