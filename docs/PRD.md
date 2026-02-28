# PRD – Aplicación de Nutrición Deportiva y Entrenamiento Personalizado

## 1\. Visión del Producto
Crear una aplicación tipo calculadora inteligente de nutrición y entrenamiento que, a partir de datos básicos del usuario, genere:
*   Calorías diarias personalizadas
*   Dietas adaptadas al objetivo
*   Rutinas de entrenamiento personalizadas
*   Recomendaciones claras, simples y seguras
La aplicación estará orientada a usuarios principiantes e intermedios, con lenguaje accesible y explicaciones sencillas, **sin sustituir la asesoría médica, nutricional o profesional**.
* * *
## 2\. Objetivo del Sistema
Diseñar la lógica y funcionalidades de una aplicación que permita:
*   Calcular requerimientos calóricos diarios con base científica
*   Ajustar calorías según el objetivo corporal
*   Generar dietas diarias estructuradas
*   Crear rutinas de entrenamiento personalizadas
*   Adaptar todas las recomendaciones a los datos del usuario
*   Hacer seguimiento del progreso y sugerir ajustes progresivos y seguros
* * *
## 3\. Usuarios Objetivo
*   Personas que desean mejorar su composición corporal
*   Principiantes en nutrición y entrenamiento
*   Usuarios sin acceso constante a un nutricionista o entrenador
*   Personas que buscan una guía clara, automatizada y educativa
* * *
## 4\. Datos de Entrada del Usuario
### 4.1 Datos Obligatorios
La aplicación debe solicitar obligatoriamente:
*   Edad (años)
*   Género (masculino / femenino)
*   Altura (cm)
*   Peso (kg)
*   Nivel de actividad física:
    *   Sedentario
    *   Ligero
    *   Moderado
    *   Alto
*   Días de entrenamiento por semana (1–7)
*   Objetivo principal:
    *   Mantener peso
    *   Bajar grasa corporal
    *   Subir masa muscular
### 4.2 Datos Opcionales
*   Preferencias alimenticias:
    *   Omnívoro
    *   Vegetariano
    *   Vegano
*   Restricciones alimentarias comunes (checklist)
*   Perfil de salud y condición física:
    *   Estado de salud general
    *   Lesiones previas o actuales
    *   Limitaciones de movilidad
    *   Restricciones médicas relevantes
> Nota: la app **no realiza diagnósticos médicos** ni interpreta clínicamente la información ingresada.
* * *
## 5\. Cálculos Nutricionales (Funcionalidad Clave)
### 5.1 Cálculo del Gasto Calórico
La app debe calcular el Gasto Calórico Total Diario (TDEE) usando la fórmula Mifflin-St Jeor:
**Hombre:**
BMR = (10 × peso) + (6.25 × altura) − (5 × edad) + 5
**Mujer:**
BMR = (10 × peso) + (6.25 × altura) − (5 × edad) − 161
El BMR se multiplica por un factor de actividad según el nivel del usuario.
* * *
### 5.2 Ajuste Calórico según Objetivo
*   Mantener peso: TDEE sin ajustes
*   Bajar grasa:
    *   Déficit calórico del 15–25%
*   Subir masa muscular:
    *   Superávit calórico del 10–20%
Se aplican **límites de seguridad** para evitar recomendaciones extremas.
* * *
### 5.3 Distribución de Macronutrientes
Las calorías se distribuyen en:
*   Proteínas
*   Carbohidratos
*   Grasas
Ajustes según objetivo:
*   Mayor proteína en pérdida de grasa
*   Mayor carbohidrato en ganancia muscular
*   Distribución equilibrada en mantenimiento
* * *
## 6\. Generación de Dietas
### 6.1 Estructura de la Dieta
Para cada usuario, la app debe generar una dieta diaria con:
*   Desayuno
*   Comida
*   Cena
*   Snacks (1–2)
Cada comida debe incluir:
*   Alimentos comunes y accesibles
*   Cantidades aproximadas
*   Calorías por comida
*   Macronutrientes por comida
* * *
### 6.2 Variantes
*   Mínimo 2 variantes de menú por objetivo
*   Adaptadas a preferencias alimenticias cuando aplique
* * *
## 7\. Generación de Rutinas de Entrenamiento
### 7.1 Criterios de Generación
Las rutinas se generan considerando un perfil integral del usuario:
*   Objetivo principal
*   Días disponibles para entrenar
*   Nivel de experiencia:
    *   Principiante (por defecto)
    *   Intermedio
    *   Avanzado
*   Perfil de salud y condición física:
    *   Lesiones
    *   Limitaciones de movilidad
    *   Restricciones médicas relevantes
* * *
### 7.2 Contenido de la Rutina
Cada rutina debe incluir:
*   Tipo de entrenamiento:
    *   Fuerza
    *   Cardio
    *   HIIT
    *   Híbrido
*   Ejercicios específicos
*   Series y repeticiones
*   Duración estimada por sesión
*   Recomendaciones de descanso
* * *
## 8\. Funcionalidades Adicionales Obligatorias
### 8.1 Seguimiento de Progreso
*   Registro de peso corporal
*   Historial semanal
*   Indicadores simples de evolución
* * *
### 8.2 Ajustes Inteligentes
*   Recomendaciones automáticas para:
    *   Ajustar calorías cada 2–4 semanas
    *   Modificar entrenamiento si no hay progreso
*   Cambios progresivos y conservadores
* * *
### 8.3 Recordatorios Inteligentes
*   Hidratación diaria
*   Consumo de proteína
*   Días de entrenamiento
* * *
### 8.4 Modo Principiante
*   Explicaciones simples de términos técnicos
*   Tips prácticos y educativos
* * *
### 8.5 Recomendaciones de Suplementos (Opcional)
*   Proteína en polvo
*   Creatina
*   Multivitamínicos
Siempre indicados como **no obligatorios** y sin carácter médico.
* * *
### 8.6 Advertencia de Salud
Mensaje visible y permanente:
> “Esta aplicación no sustituye la asesoría médica, nutricional ni profesional. Consulte a un especialista antes de realizar cambios importantes en su dieta o entrenamiento.”
* * *
## 9\. Reglas de Seguridad del Sistema
La aplicación debe:
*   Evitar recomendaciones calóricas extremas
*   Limitar entrenamientos de alta intensidad en usuarios con lesiones declaradas
*   Mostrar advertencias adicionales ante condiciones de riesgo
*   Priorizar la seguridad y la adherencia sobre resultados rápidos
* * *
## 10\. Cumplimiento Legal y Responsabilidad
*   Consentimiento explícito del usuario al iniciar
*   Cumplimiento de la Ley 1581 de 2012 (protección de datos personales)
*   Tratamiento adecuado de datos sensibles
*   Posibilidad de eliminación de datos por parte del usuario
*   Limitación de responsabilidad del desarrollador
* * *
## 11\. Formato de Salida
La información se mostrará mediante:
*   Títulos claros
*   Listas y tablas
*   Lenguaje sencillo y educativo
* * *
## 12\. Métricas de Éxito
*   Usuarios que completan el onboarding
*   Retención a 7 y 30 días
*   Uso del seguimiento de progreso
*   Ajustes de calorías realizados
* * *
## 13\. Alcance Inicial (MVP)
Incluye:
*   Cálculo calórico completo
*   Generación de dietas básicas
*   Rutinas personalizadas simples
*   Seguimiento de peso
*   Recordatorios básicos
Funciones avanzadas se incorporarán en versiones futuras.