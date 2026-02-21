(function() {
  window.ALL_LESSONS = window.ALL_LESSONS || [];
  window.ALL_LESSONS.push(
    {
      id: "16.1",
      chapter: "16",
      title: "Creando Hilos",
      explanation: "Rust usa hilos del sistema operativo con <code>thread::spawn</code>. El closure captura variables del entorno. Llamar <code>.join()</code> espera a que el hilo termine.",
      code: `use std::thread;
use std::time::Duration;

fn main() {
    let handle = thread::spawn(|| {
        for i in 1..5 {
            println!("hilo: {i}");
            thread::sleep(Duration::from_millis(1));
        }
    });

    for i in 1..3 {
        println!("main: {i}");
    }

    handle.join().unwrap();
}`,
      challenge: "Crea un hilo que imprima los números del 1 al 10 y espera a que termine antes de imprimir 'Listo' en main."
    },
    {
      id: "16.2",
      chapter: "16",
      title: "Paso de Mensajes",
      explanation: "Los canales (<code>mpsc::channel</code>) permiten enviar datos entre hilos. <code>tx.send()</code> envía y <code>rx.recv()</code> recibe. mpsc = múltiples productores, un consumidor.",
      code: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let msg = String::from("hola desde el hilo");
        tx.send(msg).unwrap();
    });

    let recibido = rx.recv().unwrap();
    println!("Recibí: {recibido}");
}`,
      challenge: "Crea dos hilos que envíen mensajes por el mismo canal (clona tx) y recibe ambos en main."
    },
    {
      id: "16.3",
      chapter: "16",
      title: "Estado Compartido",
      explanation: "<code>Mutex&lt;T&gt;</code> permite acceso exclusivo a datos. <code>Arc&lt;T&gt;</code> es un puntero de referencia atómico para compartir entre hilos. Combínalos: <code>Arc&lt;Mutex&lt;T&gt;&gt;</code>.",
      code: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let contador = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let c = Arc::clone(&contador);
        let h = thread::spawn(move || {
            let mut num = c.lock().unwrap();
            *num += 1;
        });
        handles.push(h);
    }

    for h in handles { h.join().unwrap(); }
    println!("Resultado: {}", *contador.lock().unwrap());
}`,
      challenge: "Usa Arc<Mutex<Vec<i32>>> para que 5 hilos añadan cada uno su número (0..5) al vector."
    },
    {
      id: "16.4",
      chapter: "16",
      title: "Sync y Send",
      explanation: "<code>Send</code> indica que un tipo puede transferirse entre hilos. <code>Sync</code> indica que puede referenciarse desde múltiples hilos. Casi todos los tipos primitivos implementan ambos.",
      code: `// Send: T puede moverse a otro hilo
// Sync: &T puede compartirse entre hilos
//
// Ejemplos:
// - i32, String, Vec<T>: Send + Sync
// - Rc<T>: NO es Send ni Sync
// - Arc<T>: Send + Sync
// - Mutex<T>: Send + Sync
//
// Rust los implementa automáticamente si todos
// los campos del struct también los implementan.

use std::sync::Arc;
use std::thread;

fn main() {
    let data = Arc::new(vec![1, 2, 3]);
    let d = Arc::clone(&data);
    thread::spawn(move || {
        println!("{:?}", d); // Arc es Send+Sync
    }).join().unwrap();
}`,
      challenge: "Intenta enviar un Rc<i32> a otro hilo y observa el error del compilador. Luego cámbialo a Arc."
    },
    {
      id: "17.1",
      chapter: "17",
      title: "Características de OOP",
      explanation: "Rust tiene encapsulación con <code>pub</code>, pero no herencia. En su lugar usa composición y traits. Los structs + impl proveen datos + comportamiento juntos.",
      code: `pub struct Promedio {
    lista: Vec<f64>,
    promedio: f64,
}

impl Promedio {
    pub fn new() -> Self {
        Promedio { lista: vec![], promedio: 0.0 }
    }

    pub fn agregar(&mut self, valor: f64) {
        self.lista.push(valor);
        self.actualizar();
    }

    pub fn promedio(&self) -> f64 {
        self.promedio
    }

    fn actualizar(&mut self) {
        let total: f64 = self.lista.iter().sum();
        self.promedio = total / self.lista.len() as f64;
    }
}

fn main() {
    let mut p = Promedio::new();
    p.agregar(10.0);
    p.agregar(20.0);
    println!("Promedio: {}", p.promedio());
}`,
      challenge: "Agrega un método 'remover' que quite el último elemento y actualice el promedio."
    },
    {
      id: "17.2",
      chapter: "17",
      title: "Trait Objects",
      explanation: "Con <code>dyn Trait</code> puedes tener polimorfismo en runtime. Un <code>Box&lt;dyn Trait&gt;</code> permite guardar distintos tipos que implementen el mismo trait en una colección.",
      code: `trait Dibujar {
    fn dibujar(&self);
}

struct Circulo;
struct Cuadrado;

impl Dibujar for Circulo {
    fn dibujar(&self) { println!("○"); }
}
impl Dibujar for Cuadrado {
    fn dibujar(&self) { println!("□"); }
}

fn main() {
    let formas: Vec<Box<dyn Dibujar>> = vec![
        Box::new(Circulo),
        Box::new(Cuadrado),
        Box::new(Circulo),
    ];
    for f in &formas {
        f.dibujar();
    }
}`,
      challenge: "Agrega un struct Triangulo que implemente Dibujar e inclúyelo en el vector."
    },
    {
      id: "17.3",
      chapter: "17",
      title: "Patrón State",
      explanation: "El patrón State usa trait objects para representar estados. Cada estado es un struct que implementa un trait con métodos de transición. El objeto principal delega al estado actual.",
      code: `trait Estado {
    fn contenido<'a>(&self, _post: &'a Post) -> &'a str { "" }
    fn solicitar(self: Box<Self>) -> Box<dyn Estado>;
    fn aprobar(self: Box<Self>) -> Box<dyn Estado>;
}

struct Borrador;
impl Estado for Borrador {
    fn solicitar(self: Box<Self>) -> Box<dyn Estado> { Box::new(Revision) }
    fn aprobar(self: Box<Self>) -> Box<dyn Estado> { self }
}

struct Revision;
impl Estado for Revision {
    fn solicitar(self: Box<Self>) -> Box<dyn Estado> { self }
    fn aprobar(self: Box<Self>) -> Box<dyn Estado> { Box::new(Publicado) }
}

struct Publicado;
impl Estado for Publicado {
    fn contenido<'a>(&self, post: &'a Post) -> &'a str { &post.texto }
    fn solicitar(self: Box<Self>) -> Box<dyn Estado> { self }
    fn aprobar(self: Box<Self>) -> Box<dyn Estado> { self }
}

struct Post { estado: Option<Box<dyn Estado>>, texto: String }

impl Post {
    fn new() -> Self { Post { estado: Some(Box::new(Borrador)), texto: String::new() } }
    fn set_texto(&mut self, t: &str) { self.texto = t.to_string(); }
    fn contenido(&self) -> &str {
        self.estado.as_ref().unwrap().contenido(self)
    }
    fn solicitar(&mut self) {
        if let Some(s) = self.estado.take() { self.estado = Some(s.solicitar()); }
    }
    fn aprobar(&mut self) {
        if let Some(s) = self.estado.take() { self.estado = Some(s.aprobar()); }
    }
}

fn main() {
    let mut post = Post::new();
    post.set_texto("Hola Rust");
    println!("Borrador: '{}'", post.contenido());
    post.solicitar();
    post.aprobar();
    println!("Publicado: '{}'", post.contenido());
}`,
      challenge: "Agrega un estado 'Rechazado' al que se pueda llegar desde Revision con un método rechazar()."
    },
    {
      id: "18.1",
      chapter: "18",
      title: "Dónde Usar Patrones",
      explanation: "Los patrones aparecen en <code>match</code>, <code>if let</code>, <code>while let</code>, <code>for</code>, <code>let</code> y parámetros de función. Son una parte fundamental del lenguaje.",
      code: `fn main() {
    // match
    let x = Some(5);
    match x {
        Some(n) => println!("match: {n}"),
        None => println!("nada"),
    }

    // if let
    if let Some(n) = x {
        println!("if let: {n}");
    }

    // while let
    let mut stack = vec![1, 2, 3];
    while let Some(top) = stack.pop() {
        println!("while let: {top}");
    }

    // for
    let v = vec!['a', 'b', 'c'];
    for (i, val) in v.iter().enumerate() {
        println!("for: {i} = {val}");
    }

    // let destructuring
    let (a, b) = (1, 2);
    println!("let: {a}, {b}");
}`,
      challenge: "Usa while let para procesar una cola de mensajes (Vec<String>) e imprime cada uno."
    },
    {
      id: "18.2",
      chapter: "18",
      title: "Refutabilidad",
      explanation: "Un patrón irrefutable siempre coincide (ej: <code>let x = 5</code>). Uno refutable puede fallar (ej: <code>Some(x)</code>). <code>let</code> y <code>for</code> requieren irrefutables; <code>if let</code> acepta refutables.",
      code: `fn main() {
    // Irrefutable: siempre coincide
    let x = 5;
    let (a, b) = (1, 2);

    // Refutable: puede no coincidir
    let valor: Option<i32> = Some(42);

    // ✅ if let acepta refutables
    if let Some(v) = valor {
        println!("Valor: {v}");
    }

    // ❌ Esto NO compila:
    // let Some(v) = valor;
    // Porque Some(x) es refutable

    // ✅ Esto sí (irrefutable con match)
    match valor {
        Some(v) => println!("{v}"),
        None => println!("nada"),
    }
}`,
      challenge: "Intenta usar 'let Some(x) = some_option;' y observa el error. Corrígelo con if let."
    },
    {
      id: "18.3",
      chapter: "18",
      title: "Sintaxis de Patrones",
      explanation: "Los patrones soportan literales, variables, rangos (<code>1..=5</code>), destructuración de structs/enums/tuplas, guards (<code>if</code>) y bindings (<code>@</code>).",
      code: `struct Punto { x: i32, y: i32 }

enum Color { Rgb(i32, i32, i32), Nombre(String) }

fn main() {
    // Destructurar struct
    let p = Punto { x: 1, y: 0 };
    let Punto { x, y } = p;
    println!("x={x}, y={y}");

    // Rangos
    let n = 3;
    match n {
        1..=5 => println!("1 a 5"),
        _ => println!("otro"),
    }

    // Enum
    let c = Color::Rgb(0, 255, 0);
    match c {
        Color::Rgb(r, _, _) if r > 100 => println!("rojo alto"),
        Color::Rgb(..) => println!("algún rgb"),
        Color::Nombre(n) => println!("{n}"),
    }

    // Binding @
    match 15 {
        n @ 10..=20 => println!("en rango: {n}"),
        _ => {}
    }
}`,
      challenge: "Crea un enum Forma con Circulo(f64) y Rectangulo{ancho, alto} y usa match para calcular el área."
    },
    {
      id: "19.1",
      chapter: "19",
      title: "Unsafe Rust",
      explanation: "El bloque <code>unsafe</code> permite: desreferenciar raw pointers, llamar funciones unsafe, acceder a variables mutables estáticas y usar traits unsafe. Úsalo solo cuando sea necesario.",
      code: `fn main() {
    // Raw pointers
    let mut num = 5;
    let r1 = &num as *const i32;
    let r2 = &mut num as *mut i32;

    unsafe {
        println!("r1 = {}", *r1);
        *r2 = 10;
        println!("r2 = {}", *r2);
    }

    // Función unsafe
    unsafe fn peligrosa() -> i32 { 42 }
    let val = unsafe { peligrosa() };
    println!("val = {val}");

    // Static mutable
    static mut CONTADOR: i32 = 0;
    unsafe {
        CONTADOR += 1;
        println!("CONTADOR = {CONTADOR}");
    }
}`,
      challenge: "Crea una función safe que internamente use unsafe para sumar dos raw pointers a i32."
    },
    {
      id: "19.2",
      chapter: "19",
      title: "Traits Avanzados",
      explanation: "Los tipos asociados definen un placeholder en el trait. La sintaxis de disambiguación (<code>&lt;Type as Trait&gt;::method</code>) resuelve conflictos. Los supertraits requieren que otro trait se implemente primero.",
      code: `// Tipo asociado
trait Iterador {
    type Item;
    fn siguiente(&mut self) -> Option<Self::Item>;
}

struct Contador { valor: u32 }

impl Iterador for Contador {
    type Item = u32;
    fn siguiente(&mut self) -> Option<u32> {
        self.valor += 1;
        if self.valor < 6 { Some(self.valor) } else { None }
    }
}

// Supertrait
trait Mostrar: std::fmt::Display {
    fn mostrar(&self) { println!("{}", self); }
}

// Disambiguación
struct Perro;
trait Animal { fn nombre() -> String; }
impl Animal for Perro {
    fn nombre() -> String { "animal".into() }
}
impl Perro {
    fn nombre() -> String { "perro".into() }
}

fn main() {
    let mut c = Contador { valor: 0 };
    while let Some(v) = c.siguiente() { print!("{v} "); }
    println!();
    println!("{}", <Perro as Animal>::nombre());
}`,
      challenge: "Crea un trait Convertir con tipo asociado Output y un método convertir(&self) -> Self::Output."
    },
    {
      id: "19.3",
      chapter: "19",
      title: "Tipos Avanzados",
      explanation: "Los type aliases crean sinónimos (<code>type Km = i32</code>). El tipo <code>!</code> (never) indica que una función nunca retorna. <code>Sized</code> es un trait implícito para tipos de tamaño conocido.",
      code: `// Type alias
type Resultado<T> = Result<T, Box<dyn std::error::Error>>;
type Thunk = Box<dyn Fn() + Send + 'static>;

fn tomar_thunk(f: Thunk) { f(); }

// Never type (!) en match
fn main() {
    let s = "5";
    let n: i32 = match s.parse() {
        Ok(n) => n,
        Err(_) => panic!("no es número"), // panic! retorna !
    };
    println!("{n}");

    // Type alias simplifica tipos largos
    let f: Thunk = Box::new(|| println!("hola!"));
    tomar_thunk(f);

    // DST: str y [T] no tienen tamaño conocido
    // Por eso usamos &str y &[T]
    fn imprimir(s: &str) { println!("{s}"); }
    imprimir("rust");
}`,
      challenge: "Crea un type alias para Result<T, String> y úsalo en una función que parsee un número."
    },
    {
      id: "19.4",
      chapter: "19",
      title: "Funciones y Closures Avanzados",
      explanation: "Los function pointers (<code>fn</code>) son un tipo concreto, distinto al trait <code>Fn</code>. Puedes pasar funciones donde se esperan closures. También puedes retornar closures con <code>Box&lt;dyn Fn&gt;</code>.",
      code: `// Function pointer
fn sumar_uno(x: i32) -> i32 { x + 1 }

fn aplicar(f: fn(i32) -> i32, val: i32) -> i32 {
    f(val)
}

// Retornar closure
fn crear_sumador(n: i32) -> Box<dyn Fn(i32) -> i32> {
    Box::new(move |x| x + n)
}

fn main() {
    // fn pointer
    let r = aplicar(sumar_uno, 5);
    println!("aplicar: {r}");

    // Usar nombre de función como closure
    let nums = vec![1, 2, 3];
    let strings: Vec<String> = nums.iter()
        .map(|n| n.to_string())
        .collect();
    println!("{strings:?}");

    // Retornar closure
    let suma5 = crear_sumador(5);
    println!("suma5(3) = {}", suma5(3));
}`,
      challenge: "Crea una función que retorne un closure que multiplique por un número dado."
    },
    {
      id: "19.5",
      chapter: "19",
      title: "Macros",
      explanation: "Las macros declarativas (<code>macro_rules!</code>) generan código por coincidencia de patrones. Las macros procedurales (derive, attribute, function-like) operan sobre el AST del código.",
      code: `// Macro declarativa
macro_rules! mi_vec {
    ( $( $x:expr ),* ) => {
        {
            let mut v = Vec::new();
            $( v.push($x); )*
            v
        }
    };
}

macro_rules! decir {
    ($msg:expr) => { println!(">> {}", $msg); };
    ($fmt:expr, $($arg:tt)*) => {
        println!(concat!(">> ", $fmt), $($arg)*);
    };
}

fn main() {
    let v = mi_vec![1, 2, 3, 4];
    println!("{v:?}");

    decir!("hola");
    decir!("{} + {} = {}", 2, 3, 5);

    // Macros derive se usan así:
    // #[derive(MiMacro)]
    // struct MiStruct { ... }
    // (requieren crate separado con proc-macro)
}`,
      challenge: "Crea una macro 'hashmap!' que acepte pares clave => valor y retorne un HashMap."
    },
    {
      id: "20.1",
      chapter: "20",
      title: "Servidor Single-Threaded",
      explanation: "Un servidor TCP básico usa <code>TcpListener::bind</code> para escuchar conexiones. Cada conexión se lee y se responde con HTTP. Este enfoque solo maneja una petición a la vez.",
      code: `use std::io::prelude::*;
use std::net::TcpListener;

fn main() {
    let listener = TcpListener::bind("127.0.0.1:7878").unwrap();
    println!("Escuchando en puerto 7878...");

    for stream in listener.incoming() {
        let mut stream = stream.unwrap();
        let mut buffer = [0; 1024];
        stream.read(&mut buffer).unwrap();

        let response = "HTTP/1.1 200 OK\\r\\n\\r\\nHola Rust!";
        stream.write_all(response.as_bytes()).unwrap();
        stream.flush().unwrap();
    }
}`,
      challenge: "Modifica el servidor para que responda con HTML que incluya un <h1> y un párrafo."
    },
    {
      id: "20.2",
      chapter: "20",
      title: "Servidor Multi-Threaded",
      explanation: "Un ThreadPool limita el número de hilos. Cada worker recibe trabajos por un canal compartido con <code>Arc&lt;Mutex&lt;Receiver&gt;&gt;</code>. Esto evita crear hilos infinitos.",
      code: `use std::sync::{mpsc, Arc, Mutex};
use std::thread;

type Job = Box<dyn FnOnce() + Send + 'static>;

struct ThreadPool {
    workers: Vec<thread::JoinHandle<()>>,
    sender: mpsc::Sender<Job>,
}

impl ThreadPool {
    fn new(size: usize) -> Self {
        let (sender, rx) = mpsc::channel();
        let rx = Arc::new(Mutex::new(rx));
        let mut workers = Vec::with_capacity(size);
        for _ in 0..size {
            let rx = Arc::clone(&rx);
            workers.push(thread::spawn(move || {
                loop {
                    let job = rx.lock().unwrap().recv();
                    match job {
                        Ok(job) => job(),
                        Err(_) => break,
                    }
                }
            }));
        }
        ThreadPool { workers, sender }
    }

    fn execute<F: FnOnce() + Send + 'static>(&self, f: F) {
        self.sender.send(Box::new(f)).unwrap();
    }
}

fn main() {
    let pool = ThreadPool::new(4);
    for i in 0..8 {
        pool.execute(move || println!("Tarea {i}"));
    }
    thread::sleep(std::time::Duration::from_secs(1));
}`,
      challenge: "Combina el ThreadPool con TcpListener para manejar múltiples conexiones HTTP."
    },
    {
      id: "20.3",
      chapter: "20",
      title: "Apagado Graceful",
      explanation: "Para un shutdown limpio, el pool envía un mensaje de terminación a cada worker. Al hacer drop del sender, los workers reciben error en recv() y terminan. Luego se hace join de cada hilo.",
      code: `use std::sync::{mpsc, Arc, Mutex};
use std::thread;

type Job = Box<dyn FnOnce() + Send + 'static>;

struct ThreadPool {
    workers: Vec<Option<thread::JoinHandle<()>>>,
    sender: Option<mpsc::Sender<Job>>,
}

impl ThreadPool {
    fn new(size: usize) -> Self {
        let (tx, rx) = mpsc::channel();
        let rx = Arc::new(Mutex::new(rx));
        let mut workers = Vec::with_capacity(size);
        for id in 0..size {
            let rx = Arc::clone(&rx);
            workers.push(Some(thread::spawn(move || loop {
                match rx.lock().unwrap().recv() {
                    Ok(job) => job(),
                    Err(_) => {
                        println!("Worker {id} terminando.");
                        break;
                    }
                }
            })));
        }
        ThreadPool { workers, sender: Some(tx) }
    }

    fn execute<F: FnOnce() + Send + 'static>(&self, f: F) {
        self.sender.as_ref().unwrap().send(Box::new(f)).unwrap();
    }
}

impl Drop for ThreadPool {
    fn drop(&mut self) {
        drop(self.sender.take()); // cierra el canal
        for w in &mut self.workers {
            if let Some(w) = w.take() {
                w.join().unwrap();
            }
        }
        println!("Pool cerrado limpiamente.");
    }
}

fn main() {
    let pool = ThreadPool::new(2);
    for i in 0..4 {
        pool.execute(move || println!("Tarea {i}"));
    }
    // pool se dropea aquí → graceful shutdown
}`,
      challenge: "Modifica el servidor web para que se detenga limpiamente después de recibir 5 peticiones."
    }
  );
})();
