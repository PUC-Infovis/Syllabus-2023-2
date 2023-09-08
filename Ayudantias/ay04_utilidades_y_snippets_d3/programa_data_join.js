// Creamos constantes para esta visualización.
const WIDTH = 1100;
const HEIGHTSVG1 = 400;
const HEIGHTSVG2 = 800;
const HEIGHT = HEIGHTSVG1 + HEIGHTSVG2
const MARGIN = {
  top: 70,
  bottom: 70,
  right: 30,
  left: 70, // se agranda este margen para asegurar que se vean los números
};

const HEIGHTVIS = HEIGHTSVG1 - MARGIN.top - MARGIN.bottom;
const WIDTHVIS = WIDTH - MARGIN.right - MARGIN.left;

const HEIGHTVIS2 = HEIGHTSVG2 - MARGIN.top - MARGIN.bottom;

// Creamos un SVG en body junto con su tamaño ya definido.
const svg_barras = d3.select("body")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHTSVG1)

// Creamos el título de la segunda visualización
d3.select("body")
  .append("h2")
  .text("Datos de cada accidente")

// creamos SVG de la segunda visualización
const svg_glifos = d3.select("body")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHTSVG2)


// Creamos un contenedor específico para cada eje, y para cada visualización.
const contenedorEjeY = svg_barras
  .append("g")
  .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)

const contenedorEjeX = svg_barras
  .append("g")
  .attr("transform", `translate(${MARGIN.left}, ${HEIGHTVIS + MARGIN.top})`)

const contenedorVis = svg_barras
  .append("g")
  .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)

const contenedorVis2 = svg_glifos
  .append("g")
  .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)


// El código que carga el gráfico de barras es una función modificada del código en el
// material del curso

/** Función para cargar los datos e instanciar la primera visualización
 * Dentro de esta función se llama la creación/modificación de la segunda visualización
 * @param datos Información de cada accidente en particular
 */
function joinDeDatos(datos) {
  // Hacemos un log de los datos por si los queremos ver en consola
  console.log(datos)

  // Agrupamos los datos por mes
  const datos_agrupados = d3.groups(datos, d => d.mes)
  // Notar que cada grupo es un arreglo de tamaño 2
  // El primer elemento es el valor con el que se agrupó (en este caso el mes)
  // EL segundo elemento son los elementos del grupo (en este caso cada accidente
  // de cierto mes).
  console.log(datos_agrupados)

  // Obtenemos los rangos de los datos. En este caso solo necesitamos el máximo.
  const maximaFrecuencia = d3.max(datos_agrupados, d => d[1].length);
  console.log("maxima frecuencia " + maximaFrecuencia)

  // Definimos una escala lineal para determinar la altura.
  // Mapea un número entre 0 y maximaFrecuencia a un rango entre 0 y HEIGHTVIS
  // Así nos aseguramos que el número mapeado esté en los rangos de nuestro contenedor.
  const escalaAltura = d3.scaleLinear()
    .domain([0, maximaFrecuencia])
    .range([0, HEIGHTVIS]);

  // Definimos una escala lineal para determinar la posición en el eje Y.
  // Mapea un número entre 0 y maximaFrecuencia a un rango entre HEIGHTVIS y 0.
  // Así nos aseguramos que el número mapeado esté en los rangos de nuestro contenedor.
  const escalaY = d3.scaleLinear()
    .domain([0, maximaFrecuencia])
    .range([HEIGHTVIS, 0]);

  // Creamos un eje izquierdo con D3 y le damos nuestra escala línea
  // para que sepa qué valores incluir en el eje.
  const ejeY = d3.axisLeft(escalaY);

  // Agregamos al SVG el eje. La función call se encarga de indicarle al
  // objeto ejeY a qué selección de la visualización debe vincular sus 
  // datos para agregar el eje.
  // Luego personalizamos las líneas del eje.
  contenedorEjeY.transition()
    .duration(500)
    .call(ejeY)
    .selectAll("line")
    .attr("x1", WIDTHVIS)
    .attr("stroke-dasharray", "5")
    .attr("opacity", 0.5);

  // Definimos una escala de datos categóricos para determinar la posición en el eje X.
  // Esta escala genera una banda por cada cateoría. 
  // Esta escala determinará la posición y ancho de cada banda en función del dominio y rango.
  // Mapea cada categoría a una banda específica.
  let meses_ordenados = datos_agrupados.map(d => d[0]).sort((a, b) => a - b)
  const escalaX = d3.scaleBand()
    .domain(meses_ordenados)
    .range([0, WIDTHVIS])
    .padding(0.5);

  // Creamos un eje inferior con D3 y le damos nuestra escala línea
  // para que sepa qué valores incluir en el eje.
  const ejeX = d3.axisBottom(escalaX);

  // Agregamos al SVG el eje. La función call se encarga de indicarle al
  // objeto ejeX a qué selección de la visualización debe vincular sus 
  // datos para agregar el eje.
  // Luego personalizamos el texto de dicho eje.
  contenedorEjeX.transition()
    .duration(500)
    .call(ejeX)
    .selectAll("text")
    .attr("font-size", 20);

  // Vinculamos los datos con cada elemento rect con el comando join.
  // Usamos el enter para personalizar nuestros rect cuando se crean.
  // Los creamos con largo 0 pero ya posicionados donde corresponde.
  const rectangulos = contenedorVis
    .selectAll("rect")
    .data(datos_agrupados)
    .join(enter => enter
      .append("rect")
      .attr("fill", "orange")
      .attr("y", HEIGHTVIS)
      .attr("height", 0)
      .attr("width", escalaX.bandwidth())
      .attr("x", (d) => escalaX(d[0]))
      .style("cursor", "pointer")
      .transition("enter")
      .duration(500)
      .attr("width", escalaX.bandwidth())
      .attr("height", (d) => escalaAltura(d[1].length))
      .attr("x", (d) => escalaX(d[0]))
      .attr("y", (d) => escalaY(d[1].length))
      ,
      update => update,
      exit => exit
    )


  // Al hacer click sobre el gráfico de barra,
  // mostramos los datos del mes seleccionado
  rectangulos.on("click", (_, d) => {
    // Le pasamos solo los accidentes del mes a la segunda visualización
    cargarVis2(d[1])
  })
}

/** Función para generar la segunda visualización
 * Crea glifos con update, join, exit, Posee eventos de mouseenter y mouseleave
 * @param datos Información de cada accidente en particular
 */
function cargarVis2(datos) {
  // Definimos el ángulo del la fracción del círculo que tiene la visualización
  // es el ángulo de las "piernas" del glifo.
  const angulo_final_arco = -Math.PI / 1.8

  // Usamos el ángulo para instanciar el arco
  // el rango entre inner y outer radius corresponde al
  // "ancho" del arco, es decir, donde empiezan y terminan sus extremos.
  const arc = d3.arc()
    .innerRadius(35)
    .outerRadius(40)
    .startAngle(-angulo_final_arco)
    .endAngle(angulo_final_arco)

  // Usamos una constante para determinar cuántos elementos
  // hay por fila en la visualización
  const N = 7

  // Creamos la visualización 2
  contenedorVis2
    .selectAll("g.glifo")
    // Usamos que el id de cada dato permita diferenciar entre cada dato
    .data(datos, d => d.id)
    .join(
      enter => {
        // Creamos un <g> para dejar todos los elementos de la visualización
        // esto nos permite ordenar todos los elementos dentro del <g> con
        // los mismos valores para cada elemento, sin importar si pertenecen
        // a un <g> distinto
        const glifo = enter.append("g")
          .attr("class", "glifo")
          .style("opacity", 1)
          .attr("transform", (_, i) => {
            // Ubicamos cada elemento en forma de grilla
            // Definimos la posición en X usando el módulo
            let x = (i % N) * 150;
            // Definimos la posición en Y usando la división entera
            let y = Math.floor(i / N) * 150;
            // Retornamos el translate que traslada cada <g> a
            // la posición que le corresponda
            return `translate(${x + 30}, ${y + 20})`;
          })

        // Agregamos al <g> las "pernas" del glifo (el arco)
        glifo
          .append("path")
          // usamos el transform para ubicarlo más abajo
          .attr("transform", `translate(0,40)`)
          // inicia con opacidad
          .attr("opacity", 0)
          // Definimos el color
          .attr("fill", d => {
            /* Lo siguiente equivale al siguiente código
              if (d.alumbrado == 1){
                return "DCC"
              }else if (d.alumbrado == 1){
                return "FF0"
              }else{
                // No retornamos, por lo que queda sin fill,
                // es decir, queda con color negro que es el por defecto
              }
            */
            switch (d.alumbrado) {
              case 1: return "#DCC"
              case 2: return "#FF0"
            }
          })
          // Llamamos a que se forme el arco
          .attr("d", arc())
          // Creamos la transición
          .transition("enter_arc")
          // Definimos la duración de la transición
          .duration(4000)
          // (opcional) Definimos cómo es la transición de los valores
          .ease(d3.easeBounce)
          // Definimos los valores a cambiar. Ya que se instancia con opacity 0,
          // la transición va desde opacity 0 a opacity 1
          .attr("opacity", 1)

        // Creamos un <g> para los cuadrados dentro del <g> del glifo
        const glifo_rectas = glifo.append("g")
          .attr("class", "rectas")

        // Rotamos el <g> de los cuadrados para hacer la ubicación de
        // cada cuadrado de adentro más simple
        glifo_rectas
          .attr("transform", `scale(0) rotate(225)`)
          // usamos transición con el rotate y scale
          .transition("enter_glifo")
          .ease(d3.easeElastic)
          .duration(1000)
          // el scale es implícito aquí (por default es 1)
          .attr("transform", `rotate(45)`)

        // Agregamos los cuadrados verdes al glifo
        // es un solo cuadrado, solo que es tapado por los
        // cuadrados azules y rojos.
        // Notar que gracias a que están en el <g> de rectas, al
        // aparecer rotarán
        glifo_rectas
          .append("rect")
          .attr("class", "rect_costados")
          // El color es un rojo mas fuerte si la luz ambiente es 2
          // que en el dataset corresponde a que sea de día.
          // el color es en formato RGB, al escribir #ABC, 
          // A es el Rojo, B es el Verde (Green) y C es el azul (Blue)
          .attr("fill", d => (d.luz_ambiente == 2 ? "#0F0" : "#080"))
          // Notar que usamos el operador ternario. Este funciona de la siguiente forma:
          // (operacion_a_evaluar ? hacer_si_verdadero : hacer_si_falso)
          .attr("y", -30)
          .attr("height", 60)
          .attr("width", 60)
          .attr("x", -30)

        // Agregamos el cuadrado rojo de cada glifo
        glifo_rectas
          .append("rect")
          .attr("class", "rect_dia")
          .attr("fill", d => d.luz_ambiente == 1 ? "#F00" : "#800")
          .attr("y", -30)
          .attr("height", 30)
          .attr("width", 30)
          .attr("x", -30)

        // Agregamos el cuadrado azul de cada glido
        glifo_rectas
          .append("rect")
          .attr("class", "rect_noche")
          .attr("fill", d => d.luz_ambiente == 3 ? "#00F" : "#008")
          .attr("y", 0)
          .attr("height", 30)
          .attr("width", 30)
          .attr("x", 0)

        // Agregamos el texto
        glifo.append("text")
          .style("opacity", 0)
          // Definimos de donde parte el texto en Y
          .attr("dominant-baseline", "top")
          // Definimos de donde parte el texto en X
          .attr("text-anchor", "middle")
          // El texto es el id del dato
          .text(d => d.id)
          .attr("y", 65)
          .style("opacity", 0)
          .transition("enter_text")
          .duration(1000)
          .style("opacity", 1)

        // Eventos
        // mouseenter es lo que ocurre cuuando entra el mouse.
        // Al llamarlo desde el glifo, se activa por glifo.
        // el parámetro 'd' es el dato del glifo con el que se hizo
        // el mouseenter
        glifo
          .on("mouseenter", (_, d) => {
            // Usamos el contenedor de los glifos
            contenedorVis2
              // seleccionamos cada glifo
              .selectAll("g.glifo")
              // nos quedamos con el glifo al cual el mouse entró
              .filter(dato => dato.id == d.id)
              .transition("escoder_glifo")
              .duration(300)
              // Escondemos el glido
              .style("opacity", 0.1)
          })
          // Al salir del mouse, dejamos el glifo como estaba antes
          .on("mouseleave", (_, d) => {
            contenedorVis2
              .selectAll("g.glifo")
              .filter(dato => dato.id == d.id)
              .transition("aparecer_glifo")
              .duration(500)
              .style("opacity", 1)
          })
        return glifo
      },
      update => update, // no usamos el update en esta visualización
      exit => {
        // Le cambiamos la clase para que luego el selectAll("g.glifo") no pesque estos 
        // G que deseamos eliminar
        exit.attr("class", "delete")

        // Hacemos una transición en el exit
        exit
          .transition("exit_glifo")
          .duration(500)
          .style("opacity", 0)
          .attr("transform", (_, i) => {
            let x = (i % N) * 150;
            let y = Math.floor(i / N) * 150;
            return `translate(${x + 30}, ${y + 20}) scale(5)`;
          })
        // Luego, eliminamos los elementos de la visualización  
        exit.transition("eliminar").delay(500).remove();

        // Finalmente retornamos exit
        return exit
      }
    )
}


function parseoCaracteristicas(d) {
  // Casteamos a Int, porque todo valor en SVG viene como string
  lum = parseInt(d.lum);
  // Retornamos los valores que nos son de interés para
  // la visualización
  return {
    id: parseInt(d.Num_Acc),
    mes: parseInt(d.mois),
    // Dejamos el d.lum para ver cómo se ve
    // cuando se hacen operaciones sobre el valor
    lum: d.lum,
    // Separamos dia de noche de atardecer/amanecer
    // si es de noche el valor es 3 o más, así que los dejamos en 3
    luz_ambiente: Math.min(lum, 3),
    // Dejamos guardado las condiciones de luz de la noche por separado
    // solo en la noche se guarda el alumbrado, así que nos quedamos con esos casos.
    // Notar que en el dataset el valor '3' es sin alumbrado, usaremos ese valor
    // para los datos que no son de noche
    alumbrado: lum > 3 ? lum - 3 : 0,
  }
}
////////////////////////////////////////////
////                                    ////
////          CODIGO A EJECUTAR         ////
////                                    ////
////////////////////////////////////////////

function runCode() {
  // Cargamos el csv 
  const BASE_URL = "./";
  const URL = BASE_URL + "caracteristics.csv"
  const LINK = "https://gist.githubusercontent.com/Hernan4444/d80ae2bfbb0eac5cf737dab6ce23ac57/raw/16712ed9132fc39ba57e95138e2ecfa3d9362748/caracteristics.csv"

  // Si usamos URL se requiere hacer "python3 -m http.server" o usar Live Server 
  // Podemos usar LINK para no necesitar Live Server
  d3.csv(LINK, parseoCaracteristicas).then(datos => {
    datosFinales = datos;
    joinDeDatos(datos);
  }).catch(error => {
    console.log("UPS hubo un error: " + error)
  })
}

runCode();