// Creamos constantes para esta visualización.
const LINK = "https://gist.githubusercontent.com/Hernan4444/a61e71b1ce1befeda0d005500bb42b51/raw/225fc163ae07a92f776bca88bc4541d799e0069b/herramientas.json"

const WIDTH = 800;
const HEIGHT = 600;
const MARGIN = {
    top: 70,
    bottom: 70,
    right: 30,
    left: 70,
};

const HEIGHTVIS = HEIGHT - MARGIN.top - MARGIN.bottom;
const WIDTHVIS = WIDTH - MARGIN.right - MARGIN.left;

const svg = d3.select("#vis")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);

const contenedorEjeY = svg
    .append("g")
    .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`);

const contenedorEjeX = svg
    .append("g")
    .attr("transform", `translate(${MARGIN.left}, ${HEIGHTVIS + MARGIN.top})`);

const contenedorVis = svg
    .append("g")
    .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`);

d3.json(LINK).then(datos => {

    // EJE Y
    const escalaY = d3
        .scaleLinear()
        .domain([0, d3.max(datos, (d) => d.trabajando) * 1.1])
        .range([HEIGHTVIS, 0]);
    const ejeY = d3.axisLeft(escalaY);
    contenedorEjeY.call(ejeY)

    // EJE X
    const escalaX = d3
        .scaleLinear()
        .domain([0, d3.max(datos, (d) => d.desean) * 1.1])
        .range([0, WIDTHVIS]);
    const ejeX = d3.axisBottom(escalaX);
    contenedorEjeX.call(ejeX);

    // Escala color
    const myColor = d3.scaleOrdinal().domain(datos.map(d => d.categoria)).range(d3.schemeSet3);

    // Agregamos círculos
    contenedorVis
        .selectAll("circle")
        .data(datos)
        .join("circle")
        .attr("fill", d => myColor(d.categoria))
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .attr("r", 8)
        .attr("cx", (d) => escalaX(d.desean))
        .attr("cy", (d) => escalaY(d.trabajando));

    // Agregamos nombre ejes
    svg.append("text")
        .attr("x", 480)
        .attr("y", HEIGHT - 30)
        .text("Personas que desean utilizar esta herramienta")

    svg.append("text")
        .attr("x", 30)
        .attr("y", 50)
        .text("Personas que utilizan actualmente esta herramienta")
})