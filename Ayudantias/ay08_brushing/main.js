// Definimos constantes para las tres visualizaciones

const WIDTH = 900;
const HEIGHT = 400;

const margin = {
    top: 30,
    bottom: 30,
    right: 30,
    left: 100,
};

const WIDTHVIS = WIDTH - margin.right - margin.left
const HEIGHTVIS = HEIGHT - margin.top - margin.bottom

const SVG = d3
    .select("#scatterPlot")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);

const contenedorEjeX = SVG
    .append("g")
    .attr("transform", `translate(${margin.left}, ${HEIGHTVIS + margin.bottom})`)

const contenedorEjeY = SVG
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

const contenedorPuntos = SVG
    .append("g")
    .attr("transform", `translate(${margin.left} ${margin.top})`);

const contenedorBrush = SVG
    .append("g")
    .attr("transform", `translate(${margin.left} ${margin.top})`);

const WIDTH2 = 700;
const HEIGHT2 = 700;

const margin2 = {
    top: 30,
    bottom: 320,
    right: 30,
    left: 150,
};

const WIDTHVIS2 = WIDTH2 - margin2.right - margin2.left
const HEIGHTVIS2 = HEIGHT2 - margin2.top - margin2.bottom

const SVG2 = d3
    .select("#barChart")
    .attr("width", WIDTH2)
    .attr("height", HEIGHT2);

const contenedorEjeX2 = SVG2
    .append("g")
    .attr("transform", `translate(${margin2.left}, ${HEIGHTVIS2 + margin.top})`)

const contenedorEjeY2 = SVG2
    .append("g")
    .attr("transform", `translate(${margin2.left}, ${margin2.top})`)

const contenedorRectangulos = SVG2
    .append("g")
    .attr("transform", `translate(${margin2.left} ${margin2.top})`);

const WIDTH3 = 600;
const HEIGHT3 = 600;

const margin3 = {
    top: 200,
    bottom: 50,
    right: 30,
    left: 300,
};

const WIDTHVIS3 = WIDTH3 - margin3.right - margin3.left
const HEIGHTVIS3 = HEIGHT3 - margin3.top - margin3.bottom

const SVG3 = d3
    .select("#pieChart")
    .attr("width", WIDTH3)
    .attr("height", HEIGHT3);

const contenedorTorta = SVG3
    .append("g")
    .attr("transform", `translate(${margin3.left} ${margin3.top})`);

// Definimos nuestro scatterplot

function scatterPlot(data) {
    console.log(data);

    // Calculamos los mínimos y máximos, además de fijar las escalas
    // Multiplicamos el mínimo por 0.9 para tener un poco de 
    // espacio entre el eje y el valor mínimo. 
    // Hacemos lo mismo con el máximo, donde ahí multiplicamos por 1.1
    const minBudget = d3.min(data, (d) => d.budget) * 0.9
    const minWorldSales = d3.min(data, (d) => d.worldSales) * 0.9

    const maxBudget = d3.max(data, (d) => d.budget) * 1.1
    const maxWorldSales = d3.max(data, (d) => d.worldSales) * 1.1

    const escalaBudget = d3
        .scaleLinear()
        .domain([minBudget, maxBudget])
        .range([0, WIDTHVIS])

    const escalaSales = d3
        .scaleLinear()
        .domain([minWorldSales, maxWorldSales])
        .range([HEIGHTVIS, 0])

    // Creamos los ejes según nuestras escalas

    const ejeX = d3.axisBottom(escalaBudget);
    const ejeY = d3.axisLeft(escalaSales);

    // Agregamos los ejes a sus contenedores

    contenedorEjeX.call(ejeX);
    contenedorEjeY.call(ejeY);

    // Agregamos los puntos a la visualización

    const puntos = contenedorPuntos
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("r", 2)
        .attr("cx", d => escalaBudget(d.budget))
        .attr("cy", d => escalaSales(d.worldSales))

    // Creamos la función que manejará el brush. Esta recibe un evento que tiene los siguientes atributos: 
    // target: comportamiento del brush
    // type: "start", "brush" o "end" dependiendo del modo de brush que se eligió
    // selection: la selección actual del brush. Una matriz si es brush o una lista si es brushX o brushY
    // sourceEvent: el input event, como por ejemplo mousemove o touchmove
    // mode: "drag", "space", "handle" o "center", es decir el modo de brush (si se arrastró o se movió)

    const brushed = (evento) => {
        console.log(evento)
        if (evento.type == "end" && evento.selection == null) {
            // Bonus: se desactivó el brush
            puntos
                .attr("fill", "black")
                .attr("opacity", 1)
                .attr("r", 2);
            return;
        }

        // Obtenemos los valores que corresponden a los límites de la selección para poder filtrar los datos
        // que hemos seleccionado
        const seleccion = evento.selection;

        const budgetMin = escalaBudget.invert(seleccion[0][0]);
        const salesMax = escalaSales.invert(seleccion[0][1]);

        const budgetMax = escalaBudget.invert(seleccion[1][0]);
        const salesMin = escalaSales.invert(seleccion[1][1]);

        const filtro = (d) => {
            return (budgetMin <= d.budget) && (d.budget <= budgetMax) && (salesMin <= d.worldSales) && (d.worldSales <= salesMax)
        }

        // Obtenemos las ventas de cada estudio. Recorremos todos nuestros datos y si cumplen con el filtro
        // se revisa si están en la lista, si no están, se crea. En caso de que esté, se le suma a sus ventas actuales

        let categoryDictionary = [];

        for (let i = 0; i < data.length; i++) {
            if (filtro(data[i])) {
                const estudio = data[i].distributor;
                let indiceEstudio = categoryDictionary.findIndex(item => item.estudio == estudio);

                if (indiceEstudio == -1) {
                    categoryDictionary.push({
                        "estudio": estudio,
                        "sales": data[i].worldSales
                    })
                } else {
                    categoryDictionary[indiceEstudio].sales += data[i].worldSales;
                }
            }
        }

        // Filtramos los 12 estudios con más ventas

        categoryDictionary.sort((a, b) => b.sales - a.sales)
        categoryDictionary = categoryDictionary.slice(0, 12);

        // Si el evento es brush, modificamos el gráfico de torta y pintamos los puntos verdes
        // Si el evento es end, modificamos el gráfico de barra y pintamos los puntos naranjos

        if (evento.type == "brush") {
            puntos
                .attr("fill", (d) => (filtro(d) ? "green" : "black"))
                .attr("r", (d) => (filtro(d) ? 5 : 3));

            pieChart(categoryDictionary);
        } else if (evento.type == "end") {
            puntos
                .attr("fill", (d) => (filtro(d) ? "orange" : "gray"))
                .attr("opacity", (d) => (filtro(d) ? 1 : 0.2))
                .attr("r", (d) => (filtro(d) ? 5 : 3));

            barChart(categoryDictionary);
        }
    }

    // Podemos utilizar brushX para crear un brush solo en el eje X. La matriz que se devuelva
    // en el evento, va a tener una lista simple de dos valores, uno indicando el extremo izquierdo
    // y otro el derecho. De forma análoga con brushY

    const brush = d3.brush()
        .extent([
            [0, 0],
            [WIDTHVIS, HEIGHTVIS]
        ])
        .on("brush", brushed)
        .on("end", brushed);

    contenedorBrush.call(brush);
}

function barChart(categoryDictionary) {
    //console.log(categoryDictionary)

    // Definimos las escalas para realizar el gráfico de barras

    const escalaEstudios = d3
        .scaleBand()
        .domain(d3.map(categoryDictionary, d => d.estudio))
        .range([0, WIDTHVIS2])
        .align(0.5)

    const minSales = d3.min(categoryDictionary, d => d.sales)
    const maxSales = d3.max(categoryDictionary, d => d.sales)

    const escalaSales = d3
        .scaleLinear()
        .domain([0, maxSales])
        .range([HEIGHTVIS2, 0])

    const escalaAltura = d3
        .scaleLinear()
        .domain([0, maxSales])
        .range([0, HEIGHTVIS2])

    // Definimos los ejes con las escalas definidas

    const ejeX = d3.axisBottom(escalaEstudios);
    const ejeY = d3.axisLeft(escalaSales);

    // Asignamos los ejes a sus contenedores

    contenedorEjeX2.call(ejeX);
    contenedorEjeY2.call(ejeY);

    // Rotamos los nombres de los estudios porque son muy largos

    contenedorEjeX2
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

    // Definimos un ancho para los rectángulos

    const anchoRectangulo = 20
    const anchoDeBanda = escalaEstudios.bandwidth()

    // Creamos el gráfico de barras

    const rectangulos = contenedorRectangulos
        .selectAll("rect")
        .data(categoryDictionary)
        .join("rect")
        .attr("x", d => escalaEstudios(d.estudio) + (anchoDeBanda / 2) - (anchoRectangulo / 2))
        .attr("y", d => escalaSales(d.sales))
        .attr("height", d => escalaAltura(d.sales))
        .attr("width", anchoRectangulo)
        .attr("fill", "blue")
}

function pieChart(categoryDictionary) {
    //console.log(categoryDictionary)

    // d3.pie() es una función que nos permite transformar nuestros datos en un arreglo de
    // objetos que contienen los ángulos de inicio y término para cada ítem

    const pie = d3.pie().value(d => d.sales);
    const data = pie(categoryDictionary);

    // console.log(data)

    // Una vez que tenemos los datos formateados de la manera correcta con d3.pie(), tenemos que generar una función
    // que nos codifique estos ángulos, para lo cual existe d3.arc()

    const arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(HEIGHTVIS3 / 2)

    // Definimos una escala de colores para cada estudio

    const scaleColor = d3
        .scaleOrdinal()
        .domain(d3.map(categoryDictionary, d => d.estudio))
        .range(d3.schemePaired)

    // Creamos el gráfico de torta

    contenedorTorta
        .selectAll("path")
        .data(data)
        .join("path")
        .attr("d", arcGenerator)
        .attr("fill", d => scaleColor(d.data.estudio))
        .append("title")
        .text(d => d.data.estudio)
}

function parseFunction(d) {
    let data = {
        "title": d.Title,
        "movieInfo": d["Movie Info"],
        "year": d.Year,
        "distributor": d.Distributor,
        "budget": +d["Budget (in $)"],
        "domesticOpening": +d["Domestic Opening (in $)"],
        "domesticSales": +d["Domestic Sales (in $)"],
        "internationalSales": +d["International Sales (in $)"],
        "worldSales": +d["World Wide Sales (in $)"],
        "releaseDate": d["Release Date"],
        "genre": d["Genre"].replaceAll("'", "").slice(1, -1).split(",").map(item => item.trim()),
        "runningTime": d["Running Time"],
        "license": d["License"]
    }

    return data;
}

d3.csv("Highest Holywood Grossing Movies.csv", parseFunction).then(data => {
    // Filtramos para quedarnos solo con datos que tengan presupuesto y ventas
    scatterPlot(data.filter(d => d.budget > 0 && d.worldSales > 0));
})