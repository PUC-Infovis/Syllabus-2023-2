# Visualización estática
https://i.imgur.com/R5D0eF7.jpeg

## Principio de expresividad
Se cumple parcialmente:
* Falla porque usa un color por enfermedad, al tener tantas enfermedades, el color pierde la posibilidad de servir de identidad, por lo que la enfermedad, que es categórico nominal llega a ser representado con un atributo de magnitud
* Se cumple en el ordenar el top de las causas de muerte al usar la posición (canal magnitud) para el ranking (que es categórico ordinal)

## Principios de efectividad
Falla ya que lo más importante (Las 5 causas de muerte) no es representado por un canal tan perceptivo al usar colores para tantos tipos de muerte

## Criterios de percepción
* Discriminabilidad: Falla porque se usan colores similares para algunas enfermedades
* Separabilidad: Falla porque hay interferencia entre posición y color: Es difícil saber la enfermedad mas cercana al centro de un país (uno tiende a irse para las enfermedades adyacentes)

## Principios de diseño
### Principios de diseño relacionado con expresividad:
* Data-ink ratio: Falla porque en vez de usar un solo color para enfermedad usa una gradiente de color (es decir, un rango de colores)
### Principios de diseño relacionado con efectividad:
* Lograble en blanco y negro: No es lograble en blanco y negro (Ver imagen vis_estatica_blanco_negro.jpg)
### Principios de diseño relacionado con HCI:
No aplica, ya que es una visualización estática
### Principios de diseño relacionado a diseño gráfico:
* Cumple composición asegurando un correcto alineamiento en los extremos y de proximidad en los textos


# Visualización interactiva
https://flowingdata.com/2019/03/06/women-men-timeuse/

## Principio de expresividad
Se cumple:
* Se cumple la persona (identidad) que es representado por un círculo (categórico)
* Se cumple la actividad (identidad) que se codifica como posición (posición en un sector, por lo que hace de categórico)

## Principios de efectividad
Lo más importante se evidencia en el título "A day in life", que indica que es lo que se hace durante el día. Aquello se codifica como posición en el tiempo, lo que no es efectivo porque se usa una animación.

## Criterios de percepción
* Agrupación: Se cumple bien al agruparse los círculos alrededor de la actividad que representan
* Accuracy: Baja un poco por tener que moverse la persona de un clúster a otro

## Principios de diseño
### Principios de diseño relacionado con expresividad:
* Lie-factor: Hay porque la cantidad de personas se ve en el espacio bidimensional que usan. Además, hay lie-factor en los valores, ya que los porcentajes pueden ser inconsistentes con la cantidad de puntos (ver archivo de vis_interactiva_incoherencia_valores.jpg)
* Lograble en blanco y negro: Se cumple parcialmente, al ponerlo en escala de grises, se diferencian ambos colores por muy poco. Lo anterior es más evidente cuando son pocos puntos ya que solo cuando hay muchos se nota la diferencia
### Principios de diseño relacionado con HCI:
* Los ojos le gana a la memoria: No se cumple ya que se ve un momento del día a la vez
* Overview first, details on demand: No se cumple, ya que solo se puede ver un momento del día a la vez
### Principios de diseño relacionado a diseño gráfico:
* Composición: Se cumple al usar la proximidad de los círculos a una tarea para indicar que representa que se está haciendo esa tarea

# Visualización adicional
fuente: https://www.ine.gob.cl/docs/default-source/encuesta-anual-de-electricidad-gas-y-agua/publicaciones/anuarios/anuario-1999-2002.pdf (pag. 39)

## Principio de expresividad
Se cumple al usar un canal de magnitud (área entre un arco a un centro del círculo) para representar una cantidad (cantidad de personas haciendo una actividad)

## Principios de efectividad
Falla ya que lo más importante (el crecimiento anual) se representa mediante comparación entre los crecimientos anuales en vez de enfatizar el crecimiento anual individual

## Criterios de percepción
* Discriminabilidad: Se evidencia en los dos años que se usan colores similares, ya que es dificil notar qué tan diferente es el canal para valores distintos
* Accuracy: Falla porque es difícil comparar los valores similares en el gráfico de torta

## Principios de diseño
### Principios de diseño relacionado a diseño gráfico:
* Autocontención: Falla ya que no se entiende si el crecimiento anual está en porcentaje u otra unidad
