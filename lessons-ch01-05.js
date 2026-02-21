// ─── LESSONS DATA: Chapters 1-5 ───
window.ALL_LESSONS = [];

(function() {
const chunk = [

// ══════════════════════════════════════════════════════
// CHAPTER 1: Getting Started
// ══════════════════════════════════════════════════════
{
  id: "1.1",
  chapter: "1. Primeros Pasos",
  title: "1.1 Instalación",
  explanation: `<p>Para comenzar a programar en Rust, necesitas instalar el compilador y las herramientas asociadas. La forma recomendada es usar <strong>rustup</strong>, el instalador oficial que gestiona las versiones de Rust y sus componentes.</p>
<p>Rustup te permite cambiar entre versiones stable, beta y nightly fácilmente. También instala <code>cargo</code>, el gestor de paquetes y sistema de compilación de Rust, que usarás constantemente.</p>
<p>Una vez instalado, puedes verificar tu instalación con <code>rustc --version</code>. Si ves un número de versión, ¡estás listo para empezar!</p>`,
  code: `// Verificar la instalación de Rust
// En tu terminal ejecutarías:
// $ rustc --version
// $ cargo --version

fn main() {
    // Si puedes compilar esto, Rust está instalado correctamente
    println!("¡Rust está instalado y funcionando!");
    println!("Versión del compilador: verifícala con rustc --version");

    let herramientas = vec!["rustc", "cargo", "rustup"];
    for h in &herramientas {
        println!("Herramienta disponible: {}", h);
    }
}`,
  challenge: "Modifica el programa para que imprima tu nombre y la fecha de hoy. Agrega una variable con tu sistema operativo e imprímela también."
},
{
  id: "1.2",
  chapter: "1. Primeros Pasos",
  title: "1.2 Hello, World!",
  explanation: `<p>El programa "Hello, World!" es el primer paso tradicional en cualquier lenguaje de programación. En Rust, todo programa comienza con la función <code>fn main()</code>, que es el punto de entrada.</p>
<p>La macro <code>println!</code> se usa para imprimir texto en la consola. Nota el signo de exclamación: indica que es una macro, no una función regular. Las macros son una característica poderosa de Rust.</p>
<p>Los archivos de Rust tienen la extensión <code>.rs</code>. Puedes compilar un archivo con <code>rustc archivo.rs</code> y luego ejecutar el binario resultante.</p>`,
  code: `fn main() {
    // println! es una macro que imprime texto
    println!("¡Hola, Mundo!");

    // Puedes usar formato con llaves {}
    let nombre = "Rustacean";
    println!("¡Hola, {}!", nombre);

    // También puedes usar argumentos posicionales
    println!("{0} dice: ¡Hola {1}! {1} dice: ¡Hola {0}!",
             "Alice", "Bob");

    // Y argumentos nombrados
    println!("{lenguaje} es genial", lenguaje = "Rust");
}`,
  challenge: "Crea un programa que imprima un arte ASCII simple (un triángulo o una casa) usando múltiples llamadas a println!."
},
{
  id: "1.3",
  chapter: "1. Primeros Pasos",
  title: "1.3 Hello, Cargo!",
  explanation: `<p><strong>Cargo</strong> es el sistema de compilación y gestor de paquetes de Rust. La mayoría de los proyectos Rust usan Cargo porque facilita la compilación, gestión de dependencias y mucho más.</p>
<p>Puedes crear un nuevo proyecto con <code>cargo new nombre_proyecto</code>. Esto genera una estructura de directorios con un archivo <code>Cargo.toml</code> (configuración del proyecto) y un directorio <code>src/</code> con <code>main.rs</code>.</p>
<p>Los comandos principales son: <code>cargo build</code> para compilar, <code>cargo run</code> para compilar y ejecutar, y <code>cargo check</code> para verificar sin generar binario (más rápido).</p>`,
  code: `// Archivo: src/main.rs (creado por cargo new)
// Cargo.toml contiene la configuración del proyecto

fn main() {
    // cargo build   -> compila el proyecto
    // cargo run     -> compila y ejecuta
    // cargo check   -> verifica sin compilar (más rápido)
    // cargo build --release -> compilación optimizada

    println!("¡Proyecto creado con Cargo!");

    // Cargo.toml ejemplo:
    // [package]
    // name = "mi_proyecto"
    // version = "0.1.0"
    // edition = "2021"
    //
    // [dependencies]
    // # aquí van las dependencias externas

    let comandos = [
        ("cargo new", "Crear proyecto"),
        ("cargo build", "Compilar"),
        ("cargo run", "Compilar y ejecutar"),
        ("cargo check", "Verificar código"),
        ("cargo test", "Ejecutar tests"),
    ];

    for (cmd, desc) in &comandos {
        println!("{}: {}", cmd, desc);
    }
}`,
  challenge: "Agrega un vector con al menos 3 dependencias populares de Rust (serde, tokio, rand) e imprime una descripción de cada una."
},

// ══════════════════════════════════════════════════════
// CHAPTER 2: Guessing Game
// ══════════════════════════════════════════════════════
{
  id: "2.1",
  chapter: "2. Juego de Adivinanzas",
  title: "2.1 Juego de Adivinanzas",
  explanation: `<p>El juego de adivinanzas es un proyecto clásico que introduce varios conceptos fundamentales de Rust: variables, entrada del usuario, comparaciones y bucles. El programa genera un número secreto y el jugador debe adivinarlo.</p>
<p>Este proyecto usa la crate <code>rand</code> para generar números aleatorios, mostrando cómo agregar dependencias externas. También introduce el manejo de entrada/salida con <code>std::io</code>.</p>
<p>Conceptos clave incluyen: <code>let mut</code> para variables mutables, <code>match</code> para manejar diferentes resultados, y el tipo <code>Result</code> para manejo de errores con <code>expect()</code>.</p>`,
  code: `use std::io;
use std::cmp::Ordering;

fn main() {
    println!("=== Juego de Adivinanzas ===");

    // En un proyecto real usarías: rand::thread_rng().gen_range(1..=100)
    let numero_secreto = 42; // Simulamos el número aleatorio

    let intentos = vec!["75", "25", "42"]; // Simulamos entrada

    for (i, intento) in intentos.iter().enumerate() {
        println!("\\nIntento {}: {}", i + 1, intento);

        let intento: u32 = match intento.trim().parse() {
            Ok(num) => num,
            Err(_) => {
                println!("¡Por favor ingresa un número!");
                continue;
            }
        };

        match intento.cmp(&numero_secreto) {
            Ordering::Less => println!("¡Muy pequeño!"),
            Ordering::Greater => println!("¡Muy grande!"),
            Ordering::Equal => {
                println!("🎉 ¡Correcto! Lo adivinaste.");
                break;
            }
        }
    }
}`,
  challenge: "Modifica el juego para que cuente el número de intentos y muestre un mensaje diferente según cuántos intentos tomó (menos de 3: excelente, 3-5: bien, más de 5: sigue practicando)."
},

// ══════════════════════════════════════════════════════
// CHAPTER 3: Common Programming Concepts
// ══════════════════════════════════════════════════════
{
  id: "3.1",
  chapter: "3. Conceptos Comunes",
  title: "3.1 Variables y Mutabilidad",
  explanation: `<p>En Rust, las variables son <strong>inmutables por defecto</strong>. Esto es una decisión de diseño que promueve la seguridad y la concurrencia. Si intentas cambiar una variable inmutable, el compilador te dará un error.</p>
<p>Para hacer una variable mutable, usas la palabra clave <code>mut</code>. Las constantes (<code>const</code>) son siempre inmutables y deben tener su tipo anotado. Se pueden declarar en cualquier ámbito, incluyendo el global.</p>
<p>El <strong>shadowing</strong> te permite reusar un nombre de variable con <code>let</code>. A diferencia de <code>mut</code>, el shadowing crea una nueva variable, lo que permite cambiar el tipo del valor.</p>`,
  code: `fn main() {
    // Variables inmutables por defecto
    let x = 5;
    println!("x = {}", x);
    // x = 6; // ¡Error! No se puede mutar

    // Variables mutables con mut
    let mut y = 10;
    println!("y = {}", y);
    y = 20; // OK, es mutable
    println!("y ahora = {}", y);

    // Constantes (siempre inmutables, tipo requerido)
    const MAX_PUNTOS: u32 = 100_000;
    println!("Máximo: {}", MAX_PUNTOS);

    // Shadowing: reusar nombre con let
    let espacios = "   ";
    let espacios = espacios.len(); // Cambió de &str a usize
    println!("Cantidad de espacios: {}", espacios);

    // Shadowing vs mut
    let z = 5;
    let z = z + 1; // shadowing: nueva variable
    let z = z * 2;
    println!("z = {}", z); // 12
}`,
  challenge: "Crea un programa que demuestre la diferencia entre shadowing y mutabilidad. Usa shadowing para convertir una cadena a su longitud, y una variable mutable para un contador que incremente en un bucle."
},
{
  id: "3.2",
  chapter: "3. Conceptos Comunes",
  title: "3.2 Tipos de Datos",
  explanation: `<p>Rust es un lenguaje de <strong>tipado estático</strong>: el compilador debe conocer el tipo de cada variable en tiempo de compilación. Los tipos escalares incluyen enteros (i8 a i128, u8 a u128), flotantes (f32, f64), booleanos (bool) y caracteres (char).</p>
<p>Los tipos compuestos agrupan múltiples valores: las <strong>tuplas</strong> tienen longitud fija y pueden contener tipos diferentes, mientras que los <strong>arrays</strong> tienen longitud fija y todos sus elementos son del mismo tipo.</p>
<p>La inferencia de tipos en Rust es poderosa: el compilador puede deducir el tipo en la mayoría de los casos. Cuando hay ambigüedad, debes anotar el tipo explícitamente.</p>`,
  code: `fn main() {
    // Enteros
    let entero: i32 = -42;
    let sin_signo: u64 = 1_000_000;
    let byte: u8 = 255;
    println!("Enteros: {}, {}, {}", entero, sin_signo, byte);

    // Flotantes
    let pi: f64 = 3.14159;
    let e: f32 = 2.718;
    println!("Flotantes: {}, {}", pi, e);

    // Booleano y caracter
    let activo: bool = true;
    let emoji: char = '🦀';
    println!("Bool: {}, Char: {}", activo, emoji);

    // Tuplas
    let tupla: (i32, f64, char) = (500, 6.4, 'z');
    let (x, y, z) = tupla; // Desestructurar
    println!("Tupla: {}, {}, {}", x, y, z);
    println!("Acceso directo: {}", tupla.0);

    // Arrays (longitud fija, mismo tipo)
    let meses = ["Ene", "Feb", "Mar", "Abr", "May"];
    let ceros = [0; 5]; // [0, 0, 0, 0, 0]
    println!("Mes: {}", meses[0]);
    println!("Ceros: {:?}", ceros);
}`,
  challenge: "Crea un programa que use todos los tipos escalares y compuestos. Incluye una tupla con información de un estudiante (nombre como &str, edad como u8, promedio como f64) y un array con sus calificaciones."
},
{
  id: "3.3",
  chapter: "3. Conceptos Comunes",
  title: "3.3 Funciones",
  explanation: `<p>Las funciones en Rust se declaran con <code>fn</code>. La convención es usar <strong>snake_case</strong> para nombres de funciones y variables. Puedes definir funciones en cualquier parte del archivo; Rust no requiere que estén antes de ser usadas.</p>
<p>Los <strong>parámetros</strong> deben tener su tipo anotado. Si la función retorna un valor, el tipo de retorno se indica con <code>-></code>. El último expresión sin punto y coma se convierte en el valor de retorno implícito.</p>
<p>Rust distingue entre <strong>sentencias</strong> (no retornan valor) y <strong>expresiones</strong> (sí retornan valor). Un bloque <code>{}</code> es una expresión cuyo valor es el de su última expresión.</p>`,
  code: `fn main() {
    saludar("Rustacean");

    let resultado = sumar(5, 3);
    println!("5 + 3 = {}", resultado);

    let area = calcular_area(10.0, 5.5);
    println!("Área: {:.2}", area);

    // Expresiones como valores
    let y = {
        let x = 3;
        x + 1 // Sin punto y coma = expresión (retorna valor)
    };
    println!("y = {}", y);

    let nivel = clasificar(85);
    println!("Nivel: {}", nivel);
}

fn saludar(nombre: &str) {
    println!("¡Hola, {}!", nombre);
}

fn sumar(a: i32, b: i32) -> i32 {
    a + b // Retorno implícito (sin punto y coma)
}

fn calcular_area(base: f64, altura: f64) -> f64 {
    base * altura / 2.0
}

fn clasificar(puntaje: u32) -> &'static str {
    if puntaje >= 90 { "Excelente" }
    else if puntaje >= 70 { "Bueno" }
    else { "Necesita mejorar" }
}`,
  challenge: "Crea una función que reciba un array de f64 y retorne una tupla con (mínimo, máximo, promedio). Llámala desde main con datos de prueba."
},
{
  id: "3.4",
  chapter: "3. Conceptos Comunes",
  title: "3.4 Comentarios",
  explanation: `<p>Rust soporta varios tipos de comentarios. Los <strong>comentarios de línea</strong> usan <code>//</code> y los <strong>comentarios de bloque</strong> usan <code>/* */</code>. Ambos son ignorados por el compilador.</p>
<p>Los <strong>comentarios de documentación</strong> son especiales: <code>///</code> genera documentación para el siguiente elemento, y <code>//!</code> documenta el elemento que los contiene. Estos comentarios soportan Markdown y se procesan con <code>cargo doc</code>.</p>
<p>La convención en Rust es preferir comentarios de línea sobre comentarios de bloque. Los comentarios de documentación son fundamentales en el ecosistema y se publican automáticamente en docs.rs.</p>`,
  code: `//! Este módulo demuestra los tipos de comentarios en Rust.
//! Usa cargo doc --open para generar documentación HTML.

/// Calcula el factorial de un número.
///
/// # Argumentos
/// * n - El número del cual calcular el factorial
///
/// # Ejemplos
/// (ejemplo doc-test)
/// let resultado = factorial(5);
/// assert_eq!(resultado, 120);
/// (fin doc-test)
///
/// # Panics
/// No entra en pánico para valores válidos de u64.
fn factorial(n: u64) -> u64 {
    // Comentario de línea: caso base
    if n <= 1 {
        return 1;
    }
    /* Comentario de bloque:
       caso recursivo */
    n * factorial(n - 1)
}

fn main() {
    // Los comentarios de documentación (///) generan docs HTML
    for i in 0..=10 {
        println!("{}! = {}", i, factorial(i));
    }

    // TODO: Los comentarios TODO son convención común
    // FIXME: Los FIXME indican código que necesita arreglo
    // NOTE: Para notas importantes
}`,
  challenge: "Escribe una función bien documentada con /// que incluya secciones de Argumentos, Retorno, Ejemplos y Panics. La función debe convertir temperatura de Celsius a Fahrenheit."
},
{
  id: "3.5",
  chapter: "3. Conceptos Comunes",
  title: "3.5 Flujo de Control",
  explanation: `<p>Rust tiene las estructuras de control clásicas: <code>if/else</code>, bucles <code>loop</code>, <code>while</code> y <code>for</code>. Una diferencia importante es que <code>if</code> es una expresión, así que puede retornar un valor.</p>
<p>El bucle <code>loop</code> es infinito hasta que uses <code>break</code>. Puede retornar un valor con <code>break valor</code>. Los bucles se pueden etiquetar con <code>'etiqueta:</code> para controlar cuál bucle se rompe en anidamientos.</p>
<p>El bucle <code>for</code> es el más usado en Rust y recorre iteradores. Con <code>for x in coleccion</code> iteras elementos, y con rangos como <code>0..10</code> o <code>0..=10</code> generas secuencias numéricas.</p>`,
  code: `fn main() {
    // if como expresión
    let numero = 7;
    let tipo = if numero % 2 == 0 { "par" } else { "impar" };
    println!("{} es {}", numero, tipo);

    // loop con break que retorna valor
    let mut contador = 0;
    let resultado = loop {
        contador += 1;
        if contador == 10 {
            break contador * 2; // retorna 20
        }
    };
    println!("Resultado del loop: {}", resultado);

    // Etiquetas de loop
    let mut outer = 0;
    'externo: loop {
        let mut inner = 0;
        loop {
            if inner == 3 { break; }       // rompe inner
            if outer == 2 { break 'externo; } // rompe outer
            inner += 1;
        }
        outer += 1;
    }
    println!("outer terminó en: {}", outer);

    // while
    let mut n = 3;
    while n > 0 {
        println!("{}...", n);
        n -= 1;
    }
    println!("¡Despegue!");

    // for con rangos e iteradores
    let frutas = ["🍎", "🍊", "🍋", "🍇"];
    for (i, fruta) in frutas.iter().enumerate() {
        println!("{}: {}", i, fruta);
    }

    // Rango inverso
    for i in (1..=5).rev() {
        print!("{} ", i);
    }
    println!();
}`,
  challenge: "Escribe un programa que imprima los primeros 20 números de la secuencia Fibonacci usando un bucle. Usa variables para mantener los dos números anteriores."
},

// ══════════════════════════════════════════════════════
// CHAPTER 4: Understanding Ownership
// ══════════════════════════════════════════════════════
{
  id: "4.1",
  chapter: "4. Ownership",
  title: "4.1 ¿Qué es Ownership?",
  explanation: `<p><strong>Ownership</strong> (propiedad) es el concepto central de Rust que permite gestionar memoria sin recolector de basura. Cada valor tiene exactamente un <em>owner</em> (propietario), y cuando el owner sale de ámbito, el valor se libera automáticamente.</p>
<p>Cuando asignas un valor a otra variable, puede ocurrir un <strong>move</strong> (los tipos en el heap como String se mueven) o un <strong>copy</strong> (los tipos simples en el stack como i32 se copian). Después de un move, la variable original ya no es válida.</p>
<p>La función <code>clone()</code> permite hacer una copia profunda explícita de datos en el heap. Los tipos que implementan el trait <code>Copy</code> (enteros, flotantes, booleanos, char) se copian automáticamente.</p>`,
  code: `fn main() {
    // Ownership básico: el String se mueve
    let s1 = String::from("hola");
    let s2 = s1; // s1 se MUEVE a s2
    // println!("{}", s1); // ¡Error! s1 ya no es válido
    println!("s2 = {}", s2);

    // Clone: copia profunda explícita
    let s3 = String::from("mundo");
    let s4 = s3.clone();
    println!("s3 = {}, s4 = {}", s3, s4); // Ambos válidos

    // Copy: tipos simples se copian automáticamente
    let x = 5;
    let y = x; // x se COPIA (i32 implementa Copy)
    println!("x = {}, y = {}", x, y); // Ambos válidos

    // Ownership con funciones
    let nombre = String::from("Rust");
    tomar_ownership(nombre);
    // println!("{}", nombre); // ¡Error! Se movió a la función

    let numero = 42;
    hacer_copia(numero);
    println!("numero sigue válido: {}", numero); // OK, se copió

    // Retornar ownership
    let s5 = dar_ownership();
    println!("s5 = {}", s5);
}

fn tomar_ownership(s: String) {
    println!("Tomé: {}", s);
} // s se libera aquí

fn hacer_copia(n: i32) {
    println!("Copié: {}", n);
}

fn dar_ownership() -> String {
    String::from("¡soy tuyo!")
}`,
  challenge: "Crea una función que reciba un String, lo modifique (agrega texto) y lo retorne. Demuestra cómo el ownership se transfiere de ida y vuelta."
},
{
  id: "4.2",
  chapter: "4. Ownership",
  title: "4.2 Referencias y Préstamos",
  explanation: `<p>Las <strong>referencias</strong> permiten usar un valor sin tomar ownership. Se crean con <code>&</code> y se llaman "préstamos" (borrowing). Una referencia nunca puede ser nula en Rust.</p>
<p>Por defecto, las referencias son inmutables. Para modificar un valor prestado, necesitas una <strong>referencia mutable</strong> (<code>&mut</code>). La regla clave: puedes tener muchas referencias inmutables O una sola referencia mutable, pero no ambas al mismo tiempo.</p>
<p>Estas reglas previenen <em>data races</em> en tiempo de compilación. El compilador también garantiza que las referencias nunca apunten a datos liberados (no hay <em>dangling references</em>).</p>`,
  code: `fn main() {
    // Referencia inmutable (préstamo)
    let s1 = String::from("hola");
    let len = calcular_longitud(&s1); // Prestamos s1
    println!("'{}' tiene {} caracteres", s1, len); // s1 sigue válido

    // Múltiples referencias inmutables: OK
    let r1 = &s1;
    let r2 = &s1;
    println!("{} y {}", r1, r2);

    // Referencia mutable
    let mut s2 = String::from("hola");
    cambiar(&mut s2);
    println!("Modificado: {}", s2);

    // Solo UNA referencia mutable a la vez
    let mut s3 = String::from("dato");
    {
        let r3 = &mut s3;
        r3.push_str(" modificado");
    } // r3 sale de ámbito aquí
    let r4 = &mut s3; // OK, r3 ya no existe
    r4.push_str(" otra vez");
    println!("{}", s3);

    // Las referencias inmutables terminan en su último uso
    let mut s4 = String::from("texto");
    let r5 = &s4;
    println!("{}", r5); // Último uso de r5
    let r6 = &mut s4;   // OK, r5 ya no se usa
    r6.push_str("!");
    println!("{}", s4);
}

fn calcular_longitud(s: &String) -> usize {
    s.len()
} // s sale de ámbito pero no tiene ownership, no se libera

fn cambiar(s: &mut String) {
    s.push_str(", mundo");
}`,
  challenge: "Escribe una función que reciba una referencia mutable a un Vec<i32> y otra que reciba una referencia inmutable. La primera agrega elementos, la segunda calcula la suma. Demuestra las reglas de borrowing."
},
{
  id: "4.3",
  chapter: "4. Ownership",
  title: "4.3 Slices",
  explanation: `<p>Los <strong>slices</strong> son referencias a una porción contigua de una colección, sin tomar ownership. El tipo más común es el <em>string slice</em> <code>&str</code>, que referencia una parte de un String.</p>
<p>La sintaxis de slices usa rangos: <code>&s[0..5]</code> toma los primeros 5 bytes. Puedes omitir el inicio (<code>&s[..5]</code>) o el final (<code>&s[2..]</code>) del rango. Los string literals (<code>"hola"</code>) son slices inmutables.</p>
<p>Los slices también funcionan con arrays y vectores: <code>&vec[1..3]</code> da un <code>&[T]</code>. Son fundamentales en Rust para trabajar con porciones de datos eficientemente sin copiar.</p>`,
  code: `fn main() {
    // String slices
    let s = String::from("hola mundo");
    let hola = &s[0..4];   // "hola"
    let mundo = &s[5..];   // "mundo"
    println!("{} {}", hola, mundo);

    // primera_palabra retorna un slice
    let palabra = primera_palabra(&s);
    println!("Primera palabra: {}", palabra);

    // Los string literals son slices (&str)
    let literal: &str = "soy un slice";
    println!("{}", literal);

    // Slices de arrays
    let numeros = [1, 2, 3, 4, 5];
    let medio = &numeros[1..4]; // [2, 3, 4]
    println!("Slice de array: {:?}", medio);

    // Slices de vectores
    let vec = vec![10, 20, 30, 40, 50];
    let parte = &vec[2..];
    println!("Slice de vector: {:?}", parte);

    // El slice mantiene la referencia válida
    let mut texto = String::from("hola mundo");
    let primera = primera_palabra(&texto);
    println!("Primera: {}", primera);
    // texto.clear(); // ¡Error! No puedes mutar mientras hay referencia inmutable
}

fn primera_palabra(s: &str) -> &str {
    let bytes = s.as_bytes();
    for (i, &byte) in bytes.iter().enumerate() {
        if byte == b' ' {
            return &s[..i];
        }
    }
    &s[..]
}`,
  challenge: "Escribe una función que reciba un &str y retorne el último palabra. Luego escribe otra que retorne un slice con las primeras N palabras."
},

// ══════════════════════════════════════════════════════
// CHAPTER 5: Using Structs
// ══════════════════════════════════════════════════════
{
  id: "5.1",
  chapter: "5. Structs",
  title: "5.1 Definiendo Structs",
  explanation: `<p>Los <strong>structs</strong> son tipos de datos personalizados que agrupan valores relacionados con nombres significativos. Son similares a las clases en otros lenguajes pero sin herencia.</p>
<p>Hay tres tipos de structs: los <strong>structs con campos nombrados</strong> (los más comunes), los <strong>tuple structs</strong> (campos sin nombre) y los <strong>unit structs</strong> (sin campos, útiles para traits).</p>
<p>Rust tiene azúcar sintáctico útil: el <em>field init shorthand</em> cuando variable y campo tienen el mismo nombre, y el <em>struct update syntax</em> (<code>..otro_struct</code>) para crear structs basados en otro existente.</p>`,
  code: `// Struct con campos nombrados
#[derive(Debug)]
struct Usuario {
    nombre: String,
    email: String,
    activo: bool,
    intentos: u64,
}

// Tuple struct
#[derive(Debug)]
struct Color(i32, i32, i32);
struct Punto(f64, f64, f64);

// Unit struct
struct AlwaysEqual;

fn main() {
    // Crear instancia
    let mut user1 = Usuario {
        nombre: String::from("Alice"),
        email: String::from("alice@example.com"),
        activo: true,
        intentos: 1,
    };

    // Acceder y modificar (si es mut)
    user1.intentos += 1;
    println!("{}: {} intentos", user1.nombre, user1.intentos);

    // Struct update syntax
    let user2 = Usuario {
        email: String::from("bob@example.com"),
        nombre: String::from("Bob"),
        ..user1 // Toma el resto de user1
    };
    println!("{:?}", user2);

    // Field init shorthand
    let user3 = crear_usuario(
        String::from("Carol"),
        String::from("carol@example.com"),
    );
    println!("{:?}", user3);

    // Tuple structs
    let negro = Color(0, 0, 0);
    let rojo = Color(255, 0, 0);
    println!("Negro: {:?}, Rojo: {:?}", negro, rojo);
}

fn crear_usuario(nombre: String, email: String) -> Usuario {
    Usuario {
        nombre,  // field init shorthand
        email,
        activo: true,
        intentos: 0,
    }
}`,
  challenge: "Crea un struct Libro con título, autor, páginas y disponible. Implementa una función que cree un libro y otra que imprima sus detalles de forma formateada."
},
{
  id: "5.2",
  chapter: "5. Structs",
  title: "5.2 Programa de Ejemplo con Structs",
  explanation: `<p>Vamos a construir un programa que calcula el área de rectángulos, evolucionando desde variables sueltas hasta structs. Esto demuestra por qué los structs mejoran la organización del código.</p>
<p>El atributo <code>#[derive(Debug)]</code> permite imprimir structs con <code>{:?}</code> (formato debug) y <code>{:#?}</code> (formato debug bonito). La macro <code>dbg!</code> imprime el archivo, línea y valor de una expresión.</p>
<p>Este ejemplo muestra cómo los structs dan significado a los datos: en lugar de dos números sueltos (ancho, alto), tenemos un Rectangulo con campos claros.</p>`,
  code: `#[derive(Debug)]
struct Rectangulo {
    ancho: f64,
    alto: f64,
}

fn area(rect: &Rectangulo) -> f64 {
    rect.ancho * rect.alto
}

fn puede_contener(exterior: &Rectangulo, interior: &Rectangulo) -> bool {
    exterior.ancho > interior.ancho && exterior.alto > interior.alto
}

fn main() {
    let rect1 = Rectangulo { ancho: 30.0, alto: 50.0 };
    let rect2 = Rectangulo { ancho: 10.0, alto: 40.0 };
    let rect3 = Rectangulo { ancho: 60.0, alto: 45.0 };

    // Debug printing
    println!("rect1: {:?}", rect1);
    println!("rect1 bonito: {:#?}", rect1);

    // dbg! macro (imprime archivo:línea y valor)
    let escala = 2.0;
    let rect4 = Rectangulo {
        ancho: dbg!(30.0 * escala), // imprime y retorna valor
        alto: 50.0,
    };
    dbg!(&rect4);

    // Calcular áreas
    println!("Área de rect1: {} px²", area(&rect1));
    println!("Área de rect2: {} px²", area(&rect2));

    // Verificar contención
    println!("rect1 contiene rect2: {}", puede_contener(&rect1, &rect2));
    println!("rect1 contiene rect3: {}", puede_contener(&rect1, &rect3));
}`,
  challenge: "Agrega una función que reciba un vector de Rectangulo y retorne el de mayor área. Usa #[derive(Debug)] para imprimir el resultado."
},
{
  id: "5.3",
  chapter: "5. Structs",
  title: "5.3 Sintaxis de Métodos",
  explanation: `<p>Los <strong>métodos</strong> se definen dentro de un bloque <code>impl</code> y su primer parámetro siempre es <code>self</code> (la instancia del struct). Se llaman con la notación de punto: <code>rect.area()</code>.</p>
<p>El parámetro <code>self</code> puede ser <code>&self</code> (referencia inmutable, lo más común), <code>&mut self</code> (referencia mutable) o <code>self</code> (toma ownership, raro). Rust aplica <em>automatic referencing</em> al llamar métodos.</p>
<p>Las <strong>funciones asociadas</strong> no reciben <code>self</code> y se llaman con <code>::</code> (ej: <code>String::from()</code>). Se usan comúnmente como constructores. Un struct puede tener múltiples bloques <code>impl</code>.</p>`,
  code: `#[derive(Debug)]
struct Rectangulo {
    ancho: f64,
    alto: f64,
}

impl Rectangulo {
    // Función asociada (constructor) - sin self
    fn new(ancho: f64, alto: f64) -> Self {
        Self { ancho, alto }
    }

    fn cuadrado(lado: f64) -> Self {
        Self { ancho: lado, alto: lado }
    }

    // Métodos - con &self
    fn area(&self) -> f64 {
        self.ancho * self.alto
    }

    fn perimetro(&self) -> f64 {
        2.0 * (self.ancho + self.alto)
    }

    fn es_cuadrado(&self) -> bool {
        (self.ancho - self.alto).abs() < f64::EPSILON
    }

    fn puede_contener(&self, otro: &Rectangulo) -> bool {
        self.ancho > otro.ancho && self.alto > otro.alto
    }

    // Método con &mut self
    fn escalar(&mut self, factor: f64) {
        self.ancho *= factor;
        self.alto *= factor;
    }
}

fn main() {
    // Función asociada (constructor)
    let mut rect = Rectangulo::new(30.0, 50.0);
    let cuadrado = Rectangulo::cuadrado(25.0);

    println!("Área: {}", rect.area());
    println!("Perímetro: {}", rect.perimetro());
    println!("¿Es cuadrado? {}", rect.es_cuadrado());
    println!("¿Contiene al cuadrado? {}", rect.puede_contener(&cuadrado));

    // Método mutable
    rect.escalar(2.0);
    println!("Después de escalar: {:?}", rect);
    println!("Nueva área: {}", rect.area());
}`,
  challenge: "Crea un struct Circulo con radio y un bloque impl con métodos: new, area, circunferencia, y una función asociada from_diameter. Agrega un método que determine si un punto (x, y) está dentro del círculo."
}

];
window.ALL_LESSONS.push(...chunk);
})();
