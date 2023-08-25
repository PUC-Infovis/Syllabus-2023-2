dataURL = "https://gist.githubusercontent.com/Hernan4444/0851721fc908bf57c77c96ced416f332/raw/21efbe0f6424e453daebfc3b38e90984ad043989/datos.json";
// dataPATH = "datos.json";
let parsed = [];

console.log("window.innerWidth:", window.innerWidth);
console.log("window.innerHeight:", window.innerHeight);

const WIDTH = 1300;
const HEIGHT = 600;
const SVG = d3.select("#vis").append("svg").attr("width", WIDTH).attr("height", HEIGHT);
SVG.attr('transform', 'translate(300,100)')
// OTRA FORMA DE AGREGAR EL SVG
// const SVG = d3.select("body")    
//   .append("svg")
//   .attr("width", WIDTH)
//   .attr("height", HEIGHT);

const margins = [200, 10, 50, 40]; //ZQUIERDA, DERECHA, ARRIBA, ABAJO



// Función para leer y preprocesar los datos

function preprocessingBarchartDATASET(ruta) {
    // Cargamos el JSON
    d3.json(ruta).then(data => {
        // parsed = JSON.parse(JSON.stringify(data));
        // console.log(respuestas_arr);
        // scatterplot(respuestas_arr);

        // Vamos a pasar por cada dato y lo vamos a "parsear"
        let dicc = data.map(item => ({
            index: +item.index,
            rank: +item.rank,
            name: item.repo_name,
            stars: +item.stars,
        }));
        // Ordenamos la lista según su rank
        let dicc_sorted = dicc.sort((a, b) => a.rank - b.rank);

        // Tomamos los primeros 10 datos
        let slice = dicc_sorted.slice(0, 10);

        // Llamamos a nuestra función que genera la visualización
        barplot(slice);
    })
}

function barplot(data) {
    // Ver los datos
    console.log(data);

    //<<<<SETEAR LA VISUALIZACION>>>>

    // MINIMO Y MAXIMO DE LOS DATOS PARA EL EJE X SEGUN EL 
    // ATRIBUTO "Stars"
    let max_stars = d3.max(data, (d) => d.stars);
    // let min_stars = d3.min(data, (d) => d.stars);

    //  ESCALAS Y EJES
    let escala_horizontal = d3.scaleLinear()
        .domain([0, max_stars + 2500])
        .range([margins[0], WIDTH - margins[1]]);

    let escala_vertical = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([margins[2], HEIGHT - margins[3]])
        .paddingInner(0.3);

    let ejeX = d3.axisBottom(escala_horizontal);
    let ejeY = d3.axisLeft(escala_vertical);

    // Creamos nuestro primer RECT que será el fondo
    SVG.append('rect')
        .attr('x', 0) // Definimos atributo X
        .attr('y', 0) // Definimos atributo X
        .attr('width', WIDTH) // Definimos atributo "ancho"
        .attr('height', HEIGHT) // Definimos atributo "largo"
        .attr('fill', ' #99ddee') // Definimos el relleno
        .attr('stroke', 'black'); // Definimos el color del borde

    //Agregamos el eje X. Para esto usamos call y d3.axisBottom(escala_horizontal)
    SVG
        .append("g")
        .attr('id', "ejeX") // Le damos un ID
        .attr("transform", `translate(0,${HEIGHT - margins[3]})`) // Trasladamos el G
        .call(ejeX); // Usamos call para crear el eje

    //Agregamos el eje Y. Para esto usamos call y d3.axisLeft(escala_vertical)
    SVG
        .append("g")
        .attr('id', "ejeY") // Le damos un ID
        .attr("transform", `translate(${margins[0]},0)`) // Trasladamos el G
        .call(ejeY); // Usamos call para crear el eje

    //Seleccionamos nuestro Eje X y luego cada línea (los ticks)
    SVG.select("#ejeX")
        .selectAll("line")
        .attr('y2', - (HEIGHT - margins[3] - margins[2])) // Definimos el punto de fin de la línea
        .attr('stroke', 'black') // Definimos el color de la línea
        .attr('stroke-width', 1.5) // Definimos en ancho de la línea
        .attr('stroke-dasharray', '5,5') // Extra: definimos que será punteada
        .attr('opacity', 0.5); // Hacemos un poco opaca la línea del eje

    // Extra
    // Se pueden esconder los labels del eje y.
    // d3.select("#ejeY").selectAll("text").attr('opacity', 0)  

    // Seleccionamos nuestroEjeY y luego cada texto (los labels)
    d3.select("#ejeY")
        .selectAll("text")
        .attr('font-size', 17) // Le cambiamos su tamaño
        .attr('font-weight', 'bold') // Lo hacemos más negro
        .attr('font-family', 'monospace'); //Hacemos que sea mono espaciado, es decir, cada letra usa el mismo espacio

    // Bonus
    // Tambien se puede asignar una clase para aplicar el estilo en css
    // d3.select("#ejeY").selectAll("text").attr('class', 'labelsY');  

    //<<<<GRAFICAR DATOS>>>>

    //BARRAS
    // Creamos un G, le damos el id "barsG"
    let barsG = SVG.append('g').attr('id', 'barsG');

    // Usamos la variable "barsG" que tiene nuestro G y aplicamos data-join
    barsG
        .selectAll('rect') // Buscamos cada rect
        .data(data)  // Aplicamos data-join entre los rect y los datos
        .join('rect') // Creamos un rect para cada dato del conjunto "ENTER"
        .attr('x', margins[0]) // Definimos el x de nuestras barras
        .attr('y', d => escala_vertical(d.name)) // Definimos el Y de nuestras barras
        .attr('width', d => escala_horizontal(d.stars) - margins[0]) // Definimos el ancho
        .attr('height', escala_vertical.bandwidth()) // Definimos el largo constante
        // .attr('fill', '#2E3132') // Color constante
        .attr('fill', d => {
            // O bien, usamos una function-arrow para
            // aplicar un color distinto a la barra con mayor cantidad de estrellas
            if (d.stars == max_stars) {
                return '#FFD700'
            } else {
                return '#2E3132'
            }
        })
        .attr('stroke', 'black') // Definimos un borde negro a cada barra
        .attr('stroke-width', 2.5) // Definimos el ancho del borde
        .attr('transform', 'translate(2.8,0)'); // Trasladamos un poquito nuestras barras a la derecha
}

// Llamamos a nuestra función encargada de procesar los datos
preprocessingBarchartDATASET(dataURL);