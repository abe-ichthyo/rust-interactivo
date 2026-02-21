// ─── LESSONS DATA: Chapters 6-10 ───
(function() {
const chunk = [

// ══════════════════════════════════════════════════════
// CHAPTER 6: Enums and Pattern Matching
// ══════════════════════════════════════════════════════
{
  id: "6.1",
  chapter: "6. Enums y Pattern Matching",
  title: "6.1 Definiendo Enums",
  explanation: `<p>Los <strong>enums</strong> en Rust son mucho más poderosos que en otros lenguajes. Cada variante puede contener datos de diferentes tipos: sin datos, tuplas, o structs con campos nombrados.</p>
<p>El enum más importante de Rust es <code>Option&lt;T&gt;</code>, que reemplaza los valores nulos. Tiene dos variantes: <code>Some(T)</code> cuando hay un valor, y <code>None</code> cuando no lo hay. Esto elimina los errores de null pointer.</p>
<p>Los enums pueden tener métodos implementados con <code>impl</code>, igual que los structs. Son ideales para modelar estados, mensajes, tipos de datos variantes y máquinas de estado.</p>`,
  code: `// Enum con diferentes tipos de datos en cada variante
#[derive(Debug)]
enum Mensaje {
    Salir,                        // Sin datos
    Mover { x: i32, y: i32 },   // Struct anónimo
    Escribir(String),             // Tupla con String
    CambiarColor(i32, i32, i32), // Tupla con 3 valores
}

impl Mensaje {
    fn procesar(&self) {
        match self {
            Mensaje::Salir => println!("Saliendo..."),
            Mensaje::Mover { x, y } => println!("Moviendo a ({}, {})", x, y),
            Mensaje::Escribir(texto) => println!("Texto: {}", texto),
            Mensaje::CambiarColor(r, g, b) => println!("Color: ({}, {}, {})", r, g, b),
        }
    }
}

fn main() {
    let mensajes = vec![
        Mensaje::Escribir(String::from("hola")),
        Mensaje::Mover { x: 10, y: 20 },
        Mensaje::CambiarColor(255, 0, 128),
        Mensaje::Salir,
    ];

    for msg in &mensajes {
        msg.procesar();
    }

    // Option<T> - reemplaza null
    let algun_numero: Option<i32> = Some(42);
    let ningun_numero: Option<i32> = None;

    println!("¿Tiene valor? {}", algun_numero.is_some());
    println!("Valor o default: {}", ningun_numero.unwrap_or(0));

    // Usar Option con map
    let resultado = algun_numero.map(|n| n * 2);
    println!("Doble: {:?}", resultado);
}`,
  challenge: "Crea un enum Forma con variantes Circulo(f64), Rectangulo(f64, f64), y Triangulo(f64, f64, f64). Implementa un método area() que calcule el área según la variante."
},
{
  id: "6.2",
  chapter: "6. Enums y Pattern Matching",
  title: "6.2 El Operador match",
  explanation: `<p><code>match</code> es una de las características más poderosas de Rust. Compara un valor contra una serie de patrones y ejecuta el código del primer patrón que coincida. El compilador verifica que todos los casos posibles estén cubiertos.</p>
<p>Los patrones pueden desestructurar enums, tuplas, structs y referencias. Puedes usar <code>_</code> como patrón comodín para capturar "todo lo demás". Las guardas (<code>if condicion</code>) permiten filtros adicionales.</p>
<p>Match es una expresión: retorna un valor. Cada brazo debe retornar el mismo tipo. Es exhaustivo: el compilador te obliga a manejar todas las variantes posibles de un enum.</p>`,
  code: `#[derive(Debug)]
enum Moneda {
    Centavo,
    Cinco,
    Diez,
    Veinticinco(EstadoUS),
}

#[derive(Debug)]
enum EstadoUS {
    Alabama,
    Alaska,
    Arizona,
}

fn valor_en_centavos(moneda: &Moneda) -> u32 {
    match moneda {
        Moneda::Centavo => {
            println!("¡Centavo de la suerte!");
            1
        },
        Moneda::Cinco => 5,
        Moneda::Diez => 10,
        Moneda::Veinticinco(estado) => {
            println!("Veinticinco centavos de {:?}", estado);
            25
        },
    }
}

fn main() {
    let monedas = vec![
        Moneda::Centavo,
        Moneda::Veinticinco(EstadoUS::Alaska),
        Moneda::Diez,
    ];

    let total: u32 = monedas.iter().map(|m| valor_en_centavos(m)).sum();
    println!("Total: {} centavos", total);

    // Match con Option
    let cinco = Some(5);
    let seis = mas_uno(cinco);
    let nada = mas_uno(None);
    println!("seis: {:?}, nada: {:?}", seis, nada);

    // Match con guardas y comodín
    let numero = 13;
    let texto = match numero {
        1 => "uno",
        2 | 3 | 5 | 7 | 11 | 13 => "primo",
        n if n % 2 == 0 => "par",
        _ => "otro impar",
    };
    println!("{} es {}", numero, texto);

    // Match con rangos
    let nota = 85;
    let calificacion = match nota {
        90..=100 => "A",
        80..=89 => "B",
        70..=79 => "C",
        _ => "F",
    };
    println!("Nota {}: {}", nota, calificacion);
}

fn mas_uno(x: Option<i32>) -> Option<i32> {
    match x {
        None => None,
        Some(i) => Some(i + 1),
    }
}`,
  challenge: "Crea un enum Operacion con variantes Suma, Resta, Multiplicacion, Division. Escribe una función calcular que reciba dos f64 y una Operacion, retornando Option<f64> (None para división por cero)."
},
{
  id: "6.3",
  chapter: "6. Enums y Pattern Matching",
  title: "6.3 Control Conciso con if let",
  explanation: `<p><code>if let</code> es azúcar sintáctico para un <code>match</code> que solo maneja un patrón e ignora el resto. Es más conciso cuando solo te interesa un caso específico.</p>
<p>Puedes combinarlo con <code>else</code> para manejar el caso "todo lo demás". También existe <code>while let</code> que ejecuta un bucle mientras el patrón coincida, útil para iterar sobre Options.</p>
<p>La elección entre <code>match</code> e <code>if let</code> depende del contexto: usa <code>match</code> cuando necesitas exhaustividad, y <code>if let</code> cuando solo te importa un caso y quieres código más limpio.</p>`,
  code: `fn main() {
    // match verbose para un solo caso
    let config_max = Some(3u8);
    match config_max {
        Some(max) => println!("Máximo configurado: {}", max),
        _ => (),
    }

    // if let: más conciso
    if let Some(max) = config_max {
        println!("Máximo (con if let): {}", max);
    }

    // if let con else
    let moneda = "veinticinco";
    if let "veinticinco" = moneda {
        println!("¡Encontré un quarter!");
    } else {
        println!("No es un quarter");
    }

    // while let: iterar mientras haya coincidencia
    let mut pila = vec![1, 2, 3, 4, 5];
    while let Some(tope) = pila.pop() {
        println!("Sacando: {}", tope);
    }

    // if let con enums
    #[derive(Debug)]
    enum Resultado {
        Ok(String),
        Error(String),
        Pendiente,
    }

    let resultados = vec![
        Resultado::Ok(String::from("datos")),
        Resultado::Error(String::from("timeout")),
        Resultado::Pendiente,
        Resultado::Ok(String::from("más datos")),
    ];

    let mut exitosos = 0;
    for r in &resultados {
        if let Resultado::Ok(datos) = r {
            println!("Éxito: {}", datos);
            exitosos += 1;
        }
    }
    println!("Total exitosos: {}", exitosos);

    // Combinando if let con otras condiciones
    let edad: Option<u32> = Some(25);
    if let Some(e) = edad {
        if e >= 18 {
            println!("Mayor de edad: {} años", e);
        }
    }
}`,
  challenge: "Crea un programa que procese un vector de Option<String> representando mensajes. Usa if let para imprimir solo los mensajes que existen, y while let para procesar una cola de tareas."
},

// ══════════════════════════════════════════════════════
// CHAPTER 7: Packages, Crates, and Modules
// ══════════════════════════════════════════════════════
{
  id: "7.1",
  chapter: "7. Paquetes y Módulos",
  title: "7.1 Paquetes y Crates",
  explanation: `<p>Un <strong>crate</strong> es la unidad mínima de compilación en Rust. Puede ser un <em>binary crate</em> (ejecutable con main) o un <em>library crate</em> (código reutilizable). Un <strong>package</strong> es un conjunto de crates definido por Cargo.toml.</p>
<p>Un package puede contener múltiples binary crates (en src/bin/) pero solo un library crate (src/lib.rs). El archivo src/main.rs es la raíz del binary crate, y src/lib.rs la raíz del library crate.</p>
<p>El <strong>crate root</strong> es el archivo desde donde el compilador empieza. Los módulos y todo el árbol de código se construyen a partir de este punto de entrada.</p>`,
  code: `// Simulación de estructura de un package
// mi_proyecto/
// ├── Cargo.toml
// ├── src/
// │   ├── main.rs      (binary crate root)
// │   ├── lib.rs        (library crate root)
// │   └── bin/
// │       ├── server.rs (otro binary crate)
// │       └── client.rs (otro binary crate)

// En un proyecto real, Cargo.toml define el package:
// [package]
// name = "mi_proyecto"
// version = "0.1.0"
// edition = "2021"

fn main() {
    println!("=== Paquetes y Crates en Rust ===");

    let conceptos = vec![
        ("Crate", "Unidad mínima de compilación"),
        ("Binary crate", "Genera un ejecutable (tiene main)"),
        ("Library crate", "Código reutilizable (sin main)"),
        ("Package", "Conjunto de crates (Cargo.toml)"),
        ("Crate root", "Archivo raíz de compilación"),
    ];

    for (concepto, desc) in &conceptos {
        println!("• {}: {}", concepto, desc);
    }

    println!("\\nReglas de un package:");
    println!("  - 0 o 1 library crate");
    println!("  - 0 o más binary crates");
    println!("  - Al menos 1 crate (library o binary)");
}`,
  challenge: "Describe la estructura de directorios de un package que tenga un library crate y dos binary crates. Imprime el árbol de archivos como texto formateado."
},
{
  id: "7.2",
  chapter: "7. Paquetes y Módulos",
  title: "7.2 Definiendo Módulos",
  explanation: `<p>Los <strong>módulos</strong> organizan el código dentro de un crate en grupos lógicos con control de visibilidad. Se definen con <code>mod</code> y pueden anidarse. Todo es privado por defecto.</p>
<p>El árbol de módulos comienza en el crate root. Los módulos pueden definirse inline (dentro del archivo) o en archivos separados. El compilador busca módulos en rutas específicas.</p>
<p>La visibilidad se controla con <code>pub</code>: un módulo público permite acceso desde fuera, pero sus contenidos siguen siendo privados a menos que también sean <code>pub</code>.</p>`,
  code: `// Definir módulos inline
mod restaurante {
    pub mod recepcion {
        pub fn agregar_a_lista_espera() {
            println!("Agregado a lista de espera");
        }

        pub fn sentar_en_mesa() {
            println!("Sentado en mesa");
        }
    }

    mod cocina {
        fn preparar_orden() {
            println!("Preparando orden...");
        }

        pub fn servir_orden() {
            preparar_orden(); // Puede acceder a privados del mismo módulo
            println!("¡Orden servida!");
            super::recepcion::agregar_a_lista_espera(); // super = módulo padre
        }
    }

    pub fn operar() {
        recepcion::agregar_a_lista_espera();
        cocina::servir_orden(); // OK: cocina es hijo de restaurante
    }
}

mod utilidades {
    pub mod matematicas {
        pub fn factorial(n: u64) -> u64 {
            if n <= 1 { 1 } else { n * factorial(n - 1) }
        }
    }

    pub mod texto {
        pub fn capitalizar(s: &str) -> String {
            let mut chars = s.chars();
            match chars.next() {
                None => String::new(),
                Some(c) => c.to_uppercase().to_string() + chars.as_str(),
            }
        }
    }
}

fn main() {
    // Ruta absoluta desde crate root
    restaurante::recepcion::agregar_a_lista_espera();

    // Usando el módulo
    restaurante::operar();

    // Módulos de utilidades
    println!("5! = {}", utilidades::matematicas::factorial(5));
    println!("{}", utilidades::texto::capitalizar("hola mundo"));
}`,
  challenge: "Crea un módulo 'tienda' con submódulos 'inventario' y 'ventas'. Inventario debe tener funciones para agregar y listar productos. Ventas debe poder consultar el inventario."
},
{
  id: "7.3",
  chapter: "7. Paquetes y Módulos",
  title: "7.3 Rutas para Referir Ítems",
  explanation: `<p>Para acceder a un ítem en el árbol de módulos, usas una <strong>ruta</strong>. Las rutas pueden ser absolutas (desde el crate root con <code>crate::</code>) o relativas (desde el módulo actual).</p>
<p><code>super</code> permite ir al módulo padre, similar a <code>..</code> en el sistema de archivos. Es útil cuando sabes que la relación entre módulos se mantendrá aunque los muevas.</p>
<p>Puedes hacer públicos los campos de un struct individualmente. En enums, si el enum es público, todas sus variantes son públicas automáticamente.</p>`,
  code: `mod jardin {
    pub mod vegetales {
        #[derive(Debug)]
        pub struct Planta {
            pub nombre: String,
            pub altura_cm: f64,
            ubicacion: String, // privado
        }

        impl Planta {
            pub fn new(nombre: &str, ubicacion: &str) -> Planta {
                Planta {
                    nombre: String::from(nombre),
                    altura_cm: 0.0,
                    ubicacion: String::from(ubicacion),
                }
            }

            pub fn crecer(&mut self, cm: f64) {
                self.altura_cm += cm;
                println!("{} creció a {} cm", self.nombre, self.altura_cm);
            }
        }

        // Enum público = variantes públicas
        #[derive(Debug)]
        pub enum Estacion {
            Primavera,
            Verano,
            Otono,
            Invierno,
        }

        pub fn plantar(estacion: &Estacion) {
            match estacion {
                Estacion::Primavera => println!("¡Época perfecta para plantar!"),
                Estacion::Verano => println!("Necesitará más agua"),
                _ => println!("Mejor esperar a primavera"),
            }
        }
    }

    pub mod herramientas {
        pub fn regar() {
            println!("Regando el jardín...");
            // super accede al módulo padre (jardin)
            super::vegetales::plantar(&super::vegetales::Estacion::Verano);
        }
    }
}

fn main() {
    // Ruta absoluta
    let mut tomate = jardin::vegetales::Planta::new("Tomate", "invernadero");
    tomate.crecer(5.0);
    tomate.crecer(3.0);
    println!("Planta: {:?}", tomate);
    // println!("{}", tomate.ubicacion); // ¡Error! Campo privado

    // Enum público
    let estacion = jardin::vegetales::Estacion::Primavera;
    jardin::vegetales::plantar(&estacion);

    // Usando super (internamente en herramientas)
    jardin::herramientas::regar();
}`,
  challenge: "Crea un módulo 'banco' con un struct CuentaBancaria donde el balance sea privado. Implementa métodos públicos para depositar, retirar y consultar balance."
},
{
  id: "7.4",
  chapter: "7. Paquetes y Módulos",
  title: "7.4 Trayendo Rutas al Ámbito con use",
  explanation: `<p>La palabra clave <code>use</code> crea atajos para rutas largas, similar a import en otros lenguajes. La convención es importar módulos padre para funciones y el tipo directamente para structs y enums.</p>
<p>Puedes renombrar imports con <code>as</code> para evitar conflictos de nombres. También puedes re-exportar con <code>pub use</code>, exponiendo ítems internos como parte de tu API pública.</p>
<p>Para importar múltiples ítems del mismo módulo, usa llaves: <code>use std::io::{self, Write}</code>. El glob operator <code>*</code> importa todo, pero se recomienda evitarlo excepto en tests.</p>`,
  code: `// Importar con use
use std::collections::HashMap;
use std::fmt;

// Renombrar con as
use std::io::Result as IoResult;

// Importar múltiples ítems
// use std::io::{self, Write, BufRead};

mod formas {
    #[derive(Debug)]
    pub struct Circulo {
        pub radio: f64,
    }

    #[derive(Debug)]
    pub struct Cuadrado {
        pub lado: f64,
    }

    pub mod calculos {
        use super::{Circulo, Cuadrado};
        use std::f64::consts::PI;

        pub fn area_circulo(c: &Circulo) -> f64 {
            PI * c.radio * c.radio
        }

        pub fn area_cuadrado(c: &Cuadrado) -> f64 {
            c.lado * c.lado
        }
    }

    // Re-exportar para API más limpia
    pub use calculos::area_circulo;
    pub use calculos::area_cuadrado;
}

// Usar las re-exportaciones
use formas::{Circulo, Cuadrado, area_circulo, area_cuadrado};

fn main() {
    let c = Circulo { radio: 5.0 };
    let s = Cuadrado { lado: 4.0 };

    // Gracias a pub use, accedemos directamente
    println!("Área círculo: {:.2}", area_circulo(&c));
    println!("Área cuadrado: {:.2}", area_cuadrado(&s));

    // HashMap importado con use
    let mut puntuaciones: HashMap<&str, i32> = HashMap::new();
    puntuaciones.insert("Alice", 100);
    puntuaciones.insert("Bob", 85);

    for (nombre, puntos) in &puntuaciones {
        println!("{}: {} puntos", nombre, puntos);
    }
}`,
  challenge: "Organiza un módulo 'geometria' con sub-módulos 2d y 3d. Usa pub use para re-exportar las funciones más comunes al nivel del módulo geometria."
},
{
  id: "7.5",
  chapter: "7. Paquetes y Módulos",
  title: "7.5 Separando Módulos en Archivos",
  explanation: `<p>En proyectos grandes, los módulos se separan en archivos y directorios. Declaras el módulo con <code>mod nombre;</code> (sin cuerpo) y Rust busca el código en <code>nombre.rs</code> o <code>nombre/mod.rs</code>.</p>
<p>La estructura de archivos refleja la estructura de módulos: <code>mod ventas;</code> busca <code>ventas.rs</code> o <code>ventas/mod.rs</code>. Los submódulos de ventas irían en <code>ventas/sub.rs</code>.</p>
<p>La edición 2021 prefiere <code>nombre.rs</code> + <code>nombre/sub.rs</code> sobre el estilo antiguo <code>nombre/mod.rs</code>. Ambos funcionan, pero el nuevo estilo evita tener muchos archivos llamados mod.rs.</p>`,
  code: `// Estructura de archivos de un proyecto real:
// src/
// ├── main.rs          (crate root)
// ├── lib.rs           (library crate root, opcional)
// ├── config.rs        (mod config)
// ├── modelos/         
// │   ├── mod.rs       (mod modelos - estilo antiguo)
// │   ├── usuario.rs   (mod modelos::usuario)
// │   └── producto.rs  (mod modelos::producto)
// ├── servicios.rs     (mod servicios)
// └── servicios/
//     ├── auth.rs      (mod servicios::auth)
//     └── db.rs        (mod servicios::db)

// Simulamos la estructura con módulos inline
mod config {
    pub const VERSION: &str = "1.0.0";
    pub const APP_NAME: &str = "MiApp";
}

mod modelos {
    pub mod usuario {
        #[derive(Debug)]
        pub struct Usuario {
            pub id: u32,
            pub nombre: String,
        }
    }

    pub mod producto {
        #[derive(Debug)]
        pub struct Producto {
            pub id: u32,
            pub nombre: String,
            pub precio: f64,
        }
    }
}

mod servicios {
    use super::modelos::usuario::Usuario;

    pub fn crear_usuario(id: u32, nombre: &str) -> Usuario {
        Usuario {
            id,
            nombre: String::from(nombre),
        }
    }

    pub fn listar_info() {
        println!("Servicio activo v{}", super::config::VERSION);
    }
}

use modelos::producto::Producto;
use servicios::crear_usuario;

fn main() {
    println!("{} v{}", config::APP_NAME, config::VERSION);

    let user = crear_usuario(1, "Alice");
    println!("Usuario: {:?}", user);

    let producto = Producto {
        id: 1,
        nombre: String::from("Laptop"),
        precio: 999.99,
    };
    println!("Producto: {:?}", producto);

    servicios::listar_info();
}`,
  challenge: "Diseña la estructura de módulos para una aplicación web con: modelos (User, Post, Comment), rutas (api, web), y servicios (auth, database). Imprímela como un árbol de archivos."
},

// ══════════════════════════════════════════════════════
// CHAPTER 8: Common Collections
// ══════════════════════════════════════════════════════
{
  id: "8.1",
  chapter: "8. Colecciones",
  title: "8.1 Vectores",
  explanation: `<p>Los <strong>vectores</strong> (<code>Vec&lt;T&gt;</code>) son arreglos dinámicos que almacenan elementos del mismo tipo en el heap. Se crean con <code>Vec::new()</code> o la macro <code>vec![]</code>.</p>
<p>Puedes acceder a elementos por índice (puede causar panic) o con <code>get()</code> que retorna <code>Option</code>. Para agregar elementos usa <code>push()</code>, y para iterar usa <code>for item in &vec</code>.</p>
<p>Un truco para almacenar diferentes tipos es usar un enum como tipo del vector. Las reglas de borrowing aplican: no puedes tener una referencia inmutable y modificar el vector al mismo tiempo.</p>`,
  code: `fn main() {
    // Crear vectores
    let mut v1: Vec<i32> = Vec::new();
    v1.push(1);
    v1.push(2);
    v1.push(3);

    let v2 = vec![10, 20, 30, 40, 50];

    // Acceso por índice (puede panic)
    let tercero = &v2[2];
    println!("Tercero: {}", tercero);

    // Acceso seguro con get
    match v2.get(100) {
        Some(valor) => println!("Valor: {}", valor),
        None => println!("No existe ese índice"),
    }

    // Iterar
    for n in &v2 {
        print!("{} ", n);
    }
    println!();

    // Iterar y modificar
    let mut v3 = vec![100, 200, 300];
    for n in &mut v3 {
        *n += 50;
    }
    println!("Modificado: {:?}", v3);

    // Enum para tipos mixtos en un vector
    #[derive(Debug)]
    enum Celda {
        Entero(i32),
        Flotante(f64),
        Texto(String),
    }

    let fila = vec![
        Celda::Entero(42),
        Celda::Flotante(3.14),
        Celda::Texto(String::from("hola")),
    ];

    for celda in &fila {
        match celda {
            Celda::Entero(n) => println!("Int: {}", n),
            Celda::Flotante(f) => println!("Float: {}", f),
            Celda::Texto(s) => println!("Str: {}", s),
        }
    }

    // Métodos útiles
    let nums = vec![5, 2, 8, 1, 9, 3];
    println!("Len: {}, Vacío: {}", nums.len(), nums.is_empty());
    println!("Contiene 8: {}", nums.contains(&8));
}`,
  challenge: "Crea un programa que simule una lista de compras usando un Vec. Implementa funciones para agregar, eliminar, buscar y mostrar items."
},
{
  id: "8.2",
  chapter: "8. Colecciones",
  title: "8.2 Strings",
  explanation: `<p>En Rust hay dos tipos principales de strings: <code>String</code> (owned, mutable, en el heap) y <code>&str</code> (slice, referencia inmutable). Los strings en Rust son siempre UTF-8 válido.</p>
<p>Concatenar strings se puede hacer con <code>push_str()</code>, <code>push()</code>, el operador <code>+</code>, o la macro <code>format!()</code>. El operador + toma ownership del primer string.</p>
<p>Indexar strings directamente no es posible porque los caracteres UTF-8 pueden ser multi-byte. Usa <code>chars()</code> para iterar por caracteres o <code>bytes()</code> para bytes individuales.</p>`,
  code: `fn main() {
    // Crear strings
    let mut s1 = String::new();
    let s2 = "hola".to_string();
    let s3 = String::from("mundo");

    // Agregar contenido
    s1.push_str("¡Hola ");
    s1.push_str(&s2);
    s1.push('!');
    println!("{}", s1);

    // Concatenar con +
    let saludo = s2 + " " + &s3; // s2 se mueve, s3 se presta
    println!("{}", saludo);

    // format! (no toma ownership)
    let s4 = String::from("Rust");
    let s5 = String::from("genial");
    let oracion = format!("{} es {}", s4, s5);
    println!("{}", oracion);
    println!("Originales: {} {}", s4, s5); // Siguen válidos

    // NO se puede indexar directamente
    let hola = String::from("Здравствуйте"); // Ruso
    // let h = hola[0]; // ¡Error!

    // Iterar por caracteres
    for c in hola.chars() {
        print!("{} ", c);
    }
    println!();

    // Slices (cuidado con límites de caracteres)
    let hello = String::from("Здравствуйте");
    let s = &hello[0..4]; // Primeros 2 caracteres cirílicos (2 bytes cada uno)
    println!("Slice: {}", s);

    // Métodos útiles
    let texto = String::from("  Hola Mundo  ");
    println!("Trim: '{}'", texto.trim());
    println!("Upper: {}", texto.to_uppercase());
    println!("Replace: {}", texto.replace("Mundo", "Rust"));
    println!("Contains: {}", texto.contains("Mundo"));

    // Split
    let csv = "uno,dos,tres,cuatro";
    let partes: Vec<&str> = csv.split(',').collect();
    println!("Partes: {:?}", partes);
}`,
  challenge: "Escribe una función que reciba un &str y retorne un String con cada palabra capitalizada (primera letra mayúscula). Maneja correctamente strings con múltiples espacios."
},
{
  id: "8.3",
  chapter: "8. Colecciones",
  title: "8.3 HashMaps",
  explanation: `<p>Los <strong>HashMaps</strong> almacenan pares clave-valor con búsqueda O(1). Se importan con <code>use std::collections::HashMap</code>. Las claves deben implementar <code>Eq</code> y <code>Hash</code>.</p>
<p>El método <code>entry()</code> es muy útil: permite verificar si existe una clave e insertar un valor default si no existe, con <code>or_insert()</code>. Esto evita búsquedas duplicadas.</p>
<p>Para tipos que implementan <code>Copy</code> (como i32), los valores se copian al HashMap. Para tipos owned como String, el HashMap toma ownership de los valores insertados.</p>`,
  code: `use std::collections::HashMap;

fn main() {
    // Crear y llenar
    let mut puntuaciones = HashMap::new();
    puntuaciones.insert(String::from("Azul"), 10);
    puntuaciones.insert(String::from("Rojo"), 50);

    // Acceder
    let equipo = String::from("Azul");
    let puntaje = puntuaciones.get(&equipo).copied().unwrap_or(0);
    println!("{}: {}", equipo, puntaje);

    // Iterar
    for (clave, valor) in &puntuaciones {
        println!("{}: {}", clave, valor);
    }

    // Sobrescribir
    puntuaciones.insert(String::from("Azul"), 25);
    println!("Azul actualizado: {:?}", puntuaciones);

    // entry: insertar solo si no existe
    puntuaciones.entry(String::from("Verde")).or_insert(30);
    puntuaciones.entry(String::from("Azul")).or_insert(999); // No cambia
    println!("Con entry: {:?}", puntuaciones);

    // Contar palabras con entry
    let texto = "hola mundo hola rust mundo hola";
    let mut conteo = HashMap::new();
    for palabra in texto.split_whitespace() {
        let cuenta = conteo.entry(palabra).or_insert(0);
        *cuenta += 1;
    }
    println!("Conteo: {:?}", conteo);

    // Crear desde iterador de tuplas
    let equipos = vec!["Luna", "Sol", "Estrella"];
    let puntajes_iniciales = vec![0, 0, 0];
    let tabla: HashMap<_, _> = equipos.into_iter()
        .zip(puntajes_iniciales.into_iter())
        .collect();
    println!("Tabla: {:?}", tabla);
}`,
  challenge: "Crea un programa que lea una lista de estudiantes con sus calificaciones y calcule: el promedio por estudiante, la calificación más alta global, y cuántos estudiantes aprobaron (>=70)."
},

// ══════════════════════════════════════════════════════
// CHAPTER 9: Error Handling
// ══════════════════════════════════════════════════════
{
  id: "9.1",
  chapter: "9. Manejo de Errores",
  title: "9.1 Errores Irrecuperables con panic!",
  explanation: `<p>Rust tiene dos categorías de errores: irrecuperables (<code>panic!</code>) y recuperables (<code>Result</code>). Un <code>panic!</code> detiene la ejecución, imprime un mensaje de error y limpia el stack.</p>
<p>Los panics ocurren explícitamente con la macro <code>panic!()</code> o implícitamente cuando accedes a un índice fuera de rango, por ejemplo. La variable de entorno <code>RUST_BACKTRACE=1</code> muestra el backtrace completo.</p>
<p>En producción, los panics pueden configurarse para hacer <em>abort</em> (terminar sin limpiar) en Cargo.toml, lo que reduce el tamaño del binario. Los panics son para bugs, no para errores esperados.</p>`,
  code: `fn main() {
    println!("=== Manejo de Errores: panic! ===");

    // Ejemplo controlado de situaciones que causan panic
    let v = vec![1, 2, 3];

    // Esto causaría panic: v[99]
    // En su lugar, usamos get() que es seguro
    match v.get(99) {
        Some(val) => println!("Valor: {}", val),
        None => println!("Índice 99 no existe (evitamos panic)"),
    }

    // Funciones que pueden fallar
    let resultado = dividir_seguro(10.0, 3.0);
    println!("10 / 3 = {:.2}", resultado);

    // let _boom = dividir_seguro(10.0, 0.0); // ¡Esto haría panic!

    // unwrap() y expect() causan panic si es None/Err
    let numeros = vec![1, 2, 3];
    // let _val = numeros.get(10).unwrap(); // ¡Panic!
    // let _val = numeros.get(10).expect("Índice fuera de rango"); // Panic con mensaje

    // Forma segura
    let val = numeros.get(1).unwrap_or(&0);
    println!("Valor seguro: {}", val);

    // Demostrar cuándo usar panic
    println!("\\n¿Cuándo usar panic!?");
    let casos = [
        ("Bugs en el código", "Sí - el programa está mal"),
        ("Entrada de usuario inválida", "No - usa Result"),
        ("Archivo no encontrado", "No - usa Result"),
        ("Estado imposible", "Sí - algo salió muy mal"),
        ("Prototipado rápido", "Sí - unwrap() temporal"),
    ];

    for (caso, usar_panic) in &casos {
        println!("  {} -> panic: {}", caso, usar_panic);
    }
}

fn dividir_seguro(a: f64, b: f64) -> f64 {
    if b == 0.0 {
        panic!("¡División por cero!");
    }
    a / b
}`,
  challenge: "Escribe un programa que demuestre 3 situaciones que causarían panic y muestra cómo manejar cada una de forma segura sin panic."
},
{
  id: "9.2",
  chapter: "9. Manejo de Errores",
  title: "9.2 Errores Recuperables con Result",
  explanation: `<p><code>Result&lt;T, E&gt;</code> es un enum con dos variantes: <code>Ok(T)</code> para éxito y <code>Err(E)</code> para error. Es el mecanismo principal de manejo de errores en Rust, usado por operaciones que pueden fallar.</p>
<p>El operador <code>?</code> es azúcar sintáctico que propaga errores automáticamente: si el Result es Err, retorna el error; si es Ok, extrae el valor. Solo se puede usar en funciones que retornan Result o Option.</p>
<p>Puedes encadenar operaciones con <code>and_then()</code>, <code>map()</code>, <code>map_err()</code> y otros combinadores. Para errores personalizados, puedes crear tus propios tipos de error.</p>`,
  code: `use std::num::ParseIntError;
use std::fmt;

// Error personalizado
#[derive(Debug)]
enum AppError {
    ParseError(ParseIntError),
    ValidacionError(String),
    NotFound(String),
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            AppError::ParseError(e) => write!(f, "Error de parseo: {}", e),
            AppError::ValidacionError(msg) => write!(f, "Validación: {}", msg),
            AppError::NotFound(item) => write!(f, "No encontrado: {}", item),
        }
    }
}

impl From<ParseIntError> for AppError {
    fn from(e: ParseIntError) -> Self {
        AppError::ParseError(e)
    }
}

fn parsear_edad(input: &str) -> Result<u32, AppError> {
    let edad: u32 = input.parse()?; // ? convierte ParseIntError a AppError
    if edad > 150 {
        Err(AppError::ValidacionError(
            format!("Edad {} no es realista", edad)
        ))
    } else {
        Ok(edad)
    }
}

fn buscar_usuario(id: u32) -> Result<String, AppError> {
    match id {
        1 => Ok(String::from("Alice")),
        2 => Ok(String::from("Bob")),
        _ => Err(AppError::NotFound(format!("Usuario {}", id))),
    }
}

fn main() {
    // Manejar Result con match
    let entradas = vec!["25", "abc", "200", "30"];
    for entrada in entradas {
        match parsear_edad(entrada) {
            Ok(edad) => println!("'{}' -> edad: {}", entrada, edad),
            Err(e) => println!("'{}' -> error: {}", entrada, e),
        }
    }

    // Encadenar con and_then
    let resultado = parsear_edad("1")
        .and_then(|id| buscar_usuario(id));
    println!("\\nBúsqueda: {:?}", resultado);

    // unwrap_or_else para valores default
    let nombre = buscar_usuario(99)
        .unwrap_or_else(|_| String::from("Anónimo"));
    println!("Nombre: {}", nombre);

    // map para transformar Ok
    let doble = parsear_edad("21").map(|e| e * 2);
    println!("Doble de edad: {:?}", doble);
}`,
  challenge: "Crea una función que parsee un string de configuración 'clave=valor' y retorne Result<(String, String), ConfigError>. Maneja errores como formato inválido, clave vacía, etc."
},
{
  id: "9.3",
  chapter: "9. Manejo de Errores",
  title: "9.3 ¿panic! o Result?",
  explanation: `<p>La decisión entre <code>panic!</code> y <code>Result</code> depende del contexto. Usa <code>panic!</code> para errores que indican bugs (estados imposibles, violación de contratos). Usa <code>Result</code> para errores esperados y recuperables.</p>
<p>En prototipos y tests, <code>unwrap()</code> y <code>expect()</code> son aceptables. En código de producción, siempre maneja los errores explícitamente. La función <code>main</code> puede retornar <code>Result</code>.</p>
<p>Los <strong>tipos newtype</strong> para validación son un patrón poderoso: creas un tipo que solo puede construirse con valores válidos, moviendo la validación al constructor y garantizando corrección en todo el programa.</p>`,
  code: `// Tipo con validación en el constructor
#[derive(Debug)]
struct Porcentaje(f64);

impl Porcentaje {
    fn new(valor: f64) -> Result<Self, String> {
        if valor < 0.0 || valor > 100.0 {
            Err(format!("{} no es un porcentaje válido (0-100)", valor))
        } else {
            Ok(Porcentaje(valor))
        }
    }

    fn valor(&self) -> f64 {
        self.0
    }
}

#[derive(Debug)]
struct Email(String);

impl Email {
    fn new(email: &str) -> Result<Self, String> {
        if email.contains('@') && email.contains('.') {
            Ok(Email(String::from(email)))
        } else {
            Err(format!("'{}' no es un email válido", email))
        }
    }
}

// main puede retornar Result
fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Tipos validados
    let nota = Porcentaje::new(85.0)?;
    println!("Nota: {}%", nota.valor());

    // Esto fallaría:
    match Porcentaje::new(150.0) {
        Ok(p) => println!("Porcentaje: {:?}", p),
        Err(e) => println!("Error: {}", e),
    }

    let email = Email::new("user@example.com")?;
    println!("Email: {:?}", email);

    match Email::new("invalido") {
        Ok(e) => println!("Email: {:?}", e),
        Err(e) => println!("Error: {}", e),
    }

    // Guía de decisión
    println!("\\n=== ¿panic! o Result? ===");
    let guia = [
        ("Ejemplo/prototipo", "unwrap()/expect() OK"),
        ("Test", "unwrap() - queremos que falle rápido"),
        ("Librería", "Result siempre - dejar que el usuario decida"),
        ("Input de usuario", "Result - el usuario puede corregir"),
        ("Bug del programador", "panic! - no debería pasar"),
        ("Estado corrupto", "panic! - no se puede continuar"),
    ];

    for (caso, recomendacion) in &guia {
        println!("  {}: {}", caso, recomendacion);
    }

    Ok(())
}`,
  challenge: "Crea un tipo Username que solo acepte strings de 3-20 caracteres alfanuméricos. Crea un tipo Password que requiera al menos 8 caracteres con al menos un número. Usa Result para la validación."
},

// ══════════════════════════════════════════════════════
// CHAPTER 10: Generic Types, Traits, and Lifetimes
// ══════════════════════════════════════════════════════
{
  id: "10.1",
  chapter: "10. Genéricos, Traits y Lifetimes",
  title: "10.1 Tipos Genéricos",
  explanation: `<p>Los <strong>genéricos</strong> permiten escribir código que funciona con múltiples tipos. Se declaran con <code>&lt;T&gt;</code> en funciones, structs y enums. En tiempo de compilación, Rust genera código específico para cada tipo usado (monomorfización).</p>
<p>Puedes tener múltiples parámetros genéricos: <code>&lt;T, U&gt;</code>. Los genéricos no tienen costo en rendimiento gracias a la monomorfización: el compilador genera versiones especializadas.</p>
<p>Los genéricos son la base del sistema de tipos de Rust. Vec&lt;T&gt;, Option&lt;T&gt;, Result&lt;T, E&gt; son todos tipos genéricos que ya has usado.</p>`,
  code: `// Función genérica
fn mayor<T: PartialOrd>(lista: &[T]) -> &T {
    let mut mayor = &lista[0];
    for item in &lista[1..] {
        if item > mayor {
            mayor = item;
        }
    }
    mayor
}

// Struct genérico
#[derive(Debug)]
struct Punto<T> {
    x: T,
    y: T,
}

// Struct con múltiples tipos genéricos
#[derive(Debug)]
struct Par<T, U> {
    primero: T,
    segundo: U,
}

// Implementación genérica
impl<T: std::fmt::Display> Punto<T> {
    fn mostrar(&self) {
        println!("({}, {})", self.x, self.y);
    }
}

// Implementación solo para un tipo específico
impl Punto<f64> {
    fn distancia_origen(&self) -> f64 {
        (self.x.powi(2) + self.y.powi(2)).sqrt()
    }
}

// Método con tipos genéricos mixtos
impl<T, U> Par<T, U> {
    fn mezclar<V, W>(self, otro: Par<V, W>) -> Par<T, W> {
        Par {
            primero: self.primero,
            segundo: otro.segundo,
        }
    }
}

fn main() {
    // Función genérica con diferentes tipos
    let numeros = vec![34, 50, 25, 100, 65];
    println!("Mayor número: {}", mayor(&numeros));

    let chars = vec!['y', 'm', 'a', 'q'];
    println!("Mayor char: {}", mayor(&chars));

    // Structs genéricos
    let entero = Punto { x: 5, y: 10 };
    let flotante = Punto { x: 1.5, y: 4.2 };
    println!("Puntos: {:?} y {:?}", entero, flotante);

    flotante.mostrar();
    println!("Distancia al origen: {:.2}", flotante.distancia_origen());

    // Par con tipos mixtos
    let p1 = Par { primero: 5, segundo: "hola" };
    let p2 = Par { primero: 'x', segundo: 3.14 };
    let p3 = p1.mezclar(p2);
    println!("Mezclado: {:?}", p3); // Par { primero: 5, segundo: 3.14 }
}`,
  challenge: "Crea un struct genérico Pila<T> con métodos push, pop (retorna Option<T>), peek (retorna Option<&T>), y is_empty. Úsalo con diferentes tipos."
},
{
  id: "10.2",
  chapter: "10. Genéricos, Traits y Lifetimes",
  title: "10.2 Traits: Definir Comportamiento Compartido",
  explanation: `<p>Los <strong>traits</strong> definen comportamiento compartido, similar a interfaces en otros lenguajes. Se declaran con <code>trait</code> y pueden tener métodos con o sin implementación default.</p>
<p>Implementas un trait para un tipo con <code>impl Trait for Type</code>. Los <strong>trait bounds</strong> (<code>T: Trait</code>) restringen genéricos a tipos que implementan cierto trait. La sintaxis <code>impl Trait</code> es azúcar para trait bounds simples.</p>
<p>Puedes combinar traits con <code>+</code>: <code>T: Display + Clone</code>. Las cláusulas <code>where</code> hacen la sintaxis más legible con múltiples bounds. Los traits pueden tener tipos asociados y constantes.</p>`,
  code: `use std::fmt;

// Definir un trait
trait Resumen {
    fn resumir_autor(&self) -> String;

    // Método con implementación default
    fn resumir(&self) -> String {
        format!("(Leer más de {}...)", self.resumir_autor())
    }
}

#[derive(Debug)]
struct Articulo {
    titulo: String,
    autor: String,
    contenido: String,
}

#[derive(Debug)]
struct Tweet {
    usuario: String,
    contenido: String,
    respuesta: bool,
}

impl Resumen for Articulo {
    fn resumir_autor(&self) -> String {
        self.autor.clone()
    }

    fn resumir(&self) -> String {
        format!("{}, por {} - {}...", self.titulo, self.autor, &self.contenido[..20.min(self.contenido.len())])
    }
}

impl Resumen for Tweet {
    fn resumir_autor(&self) -> String {
        format!("@{}", self.usuario)
    }
    // Usa el default de resumir()
}

// Trait bound como parámetro
fn notificar(item: &impl Resumen) {
    println!("¡Nuevo! {}", item.resumir());
}

// Sintaxis completa con where
fn comparar_resumen<T, U>(a: &T, b: &U) -> String
where
    T: Resumen + fmt::Debug,
    U: Resumen + fmt::Debug,
{
    format!("{} vs {}", a.resumir(), b.resumir())
}

// Retornar impl Trait
fn crear_tweet() -> impl Resumen {
    Tweet {
        usuario: String::from("rustlang"),
        contenido: String::from("Rust 2024 ya está aquí"),
        respuesta: false,
    }
}

fn main() {
    let articulo = Articulo {
        titulo: String::from("Rust en Producción"),
        autor: String::from("Alice"),
        contenido: String::from("Rust se usa cada vez más en sistemas de producción..."),
    };

    let tweet = Tweet {
        usuario: String::from("bob"),
        contenido: String::from("Aprendiendo Rust!"),
        respuesta: false,
    };

    notificar(&articulo);
    notificar(&tweet);

    println!("{}", comparar_resumen(&articulo, &tweet));

    let nuevo = crear_tweet();
    println!("Nuevo: {}", nuevo.resumir());
}`,
  challenge: "Crea un trait Area con un método area() -> f64 e impleméntalo para Circulo, Rectangulo y Triangulo. Escribe una función que reciba un slice de &dyn Area y retorne el área total."
},
{
  id: "10.3",
  chapter: "10. Genéricos, Traits y Lifetimes",
  title: "10.3 Validando Referencias con Lifetimes",
  explanation: `<p>Los <strong>lifetimes</strong> son anotaciones que le dicen al compilador cuánto tiempo viven las referencias. Su propósito es prevenir <em>dangling references</em> (referencias a datos liberados).</p>
<p>La sintaxis usa apóstrofo: <code>'a</code>. Cuando una función retorna una referencia, el lifetime indica que el resultado vive al menos tanto como las entradas anotadas. El compilador infiere lifetimes en muchos casos (reglas de elision).</p>
<p>El lifetime <code>'static</code> indica que la referencia vive toda la duración del programa. Los string literals tienen lifetime <code>'static</code>. Los structs que contienen referencias necesitan anotaciones de lifetime.</p>`,
  code: `// Función con lifetimes: el resultado vive tanto como la entrada más corta
fn mas_largo<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

// Struct con referencia necesita lifetime
#[derive(Debug)]
struct Extracto<'a> {
    texto: &'a str,
    autor: &'a str,
}

impl<'a> Extracto<'a> {
    // El lifetime de &self se infiere (regla de elisión)
    fn nivel(&self) -> &str {
        if self.texto.len() > 50 { "largo" } else { "corto" }
    }

    // Retorna referencia con lifetime de self
    fn primera_palabra(&self) -> &str {
        self.texto.split_whitespace().next().unwrap_or("")
    }
}

// Múltiples lifetimes
fn primero_de<'a, 'b>(x: &'a str, _y: &'b str) -> &'a str {
    x
}

// Combinando genéricos, traits y lifetimes
fn anuncio_largo<'a, T>(x: &'a str, y: &'a str, anuncio: T) -> &'a str
where
    T: std::fmt::Display,
{
    println!("Anuncio: {}", anuncio);
    if x.len() > y.len() { x } else { y }
}

fn main() {
    // Lifetimes básicos
    let string1 = String::from("cadena larga es larga");
    let resultado;
    {
        let string2 = String::from("xyz");
        resultado = mas_largo(string1.as_str(), string2.as_str());
        println!("Más largo: {}", resultado);
    }
    // println!("{}", resultado); // Error si string2 ya no existe

    // Struct con lifetime
    let novela = String::from("Llámame Ishmael. Hace algunos años...");
    let extracto = Extracto {
        texto: &novela[..30],
        autor: "Herman Melville",
    };
    println!("Extracto: {:?}", extracto);
    println!("Nivel: {}", extracto.nivel());
    println!("Primera palabra: {}", extracto.primera_palabra());

    // 'static lifetime
    let s: &'static str = "Vivo para siempre";
    println!("{}", s);

    // Combinando todo
    let mejor = anuncio_largo(
        "primer texto largo",
        "segundo",
        "¡Oferta especial!",
    );
    println!("Mejor: {}", mejor);
}`,
  challenge: "Crea un struct Cache<'a> que almacene referencias a strings. Implementa métodos para agregar entradas y buscar por clave. Asegúrate de que los lifetimes sean correctos."
}

];
window.ALL_LESSONS.push(...chunk);
})();
