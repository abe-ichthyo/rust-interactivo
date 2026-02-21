(function() {
  window.ALL_LESSONS = window.ALL_LESSONS || [];
  window.ALL_LESSONS.push(
    {
      id: "16.1",
      chapter: "16",
      title: "Creating Threads",
      explanation: "Rust uses OS threads with <code>thread::spawn</code>. The closure captures variables from the environment. Calling <code>.join()</code> waits for the thread to finish.",
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
      challenge: "Create a thread that prints the numbers from 1 to 10 and wait for it to finish before printing 'Done' in main."
    },
    {
      id: "16.2",
      chapter: "16",
      title: "Message Passing",
      explanation: "Channels (<code>mpsc::channel</code>) allow sending data between threads. <code>tx.send()</code> sends and <code>rx.recv()</code> receives. mpsc = multiple producers, single consumer.",
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
      challenge: "Create two threads that send messages through the same channel (clone tx) and receive both in main."
    },
    {
      id: "16.3",
      chapter: "16",
      title: "Shared State",
      explanation: "<code>Mutex&lt;T&gt;</code> allows exclusive access to data. <code>Arc&lt;T&gt;</code> is an atomic reference-counted pointer for sharing between threads. Combine them: <code>Arc&lt;Mutex&lt;T&gt;&gt;</code>.",
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
      challenge: "Use Arc<Mutex<Vec<i32>>> so that 5 threads each add their number (0..5) to the vector."
    },
    {
      id: "16.4",
      chapter: "16",
      title: "Sync and Send",
      explanation: "<code>Send</code> indicates that a type can be transferred between threads. <code>Sync</code> indicates it can be referenced from multiple threads. Almost all primitive types implement both.",
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
      challenge: "Try sending an Rc<i32> to another thread and observe the compiler error. Then change it to Arc."
    },
    {
      id: "17.1",
      chapter: "17",
      title: "OOP Characteristics",
      explanation: "Rust has encapsulation with <code>pub</code>, but no inheritance. Instead it uses composition and traits. Structs + impl provide data + behavior together.",
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
      challenge: "Add a 'remove' method that removes the last element and updates the average."
    },
    {
      id: "17.2",
      chapter: "17",
      title: "Trait Objects",
      explanation: "With <code>dyn Trait</code> you can have runtime polymorphism. A <code>Box&lt;dyn Trait&gt;</code> allows storing different types that implement the same trait in a collection.",
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
      challenge: "Add a Triangle struct that implements Dibujar and include it in the vector."
    },
    {
      id: "17.3",
      chapter: "17",
      title: "State Pattern",
      explanation: "The State pattern uses trait objects to represent states. Each state is a struct that implements a trait with transition methods. The main object delegates to the current state.",
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
      challenge: "Add a 'Rejected' state that can be reached from Revision with a reject() method."
    },
    {
      id: "18.1",
      chapter: "18",
      title: "Where to Use Patterns",
      explanation: "Patterns appear in <code>match</code>, <code>if let</code>, <code>while let</code>, <code>for</code>, <code>let</code>, and function parameters. They are a fundamental part of the language.",
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
      challenge: "Use while let to process a message queue (Vec<String>) and print each one."
    },
    {
      id: "18.2",
      chapter: "18",
      title: "Refutability",
      explanation: "An irrefutable pattern always matches (e.g., <code>let x = 5</code>). A refutable one can fail (e.g., <code>Some(x)</code>). <code>let</code> and <code>for</code> require irrefutable patterns; <code>if let</code> accepts refutable ones.",
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
      challenge: "Try using 'let Some(x) = some_option;' and observe the error. Fix it with if let."
    },
    {
      id: "18.3",
      chapter: "18",
      title: "Pattern Syntax",
      explanation: "Patterns support literals, variables, ranges (<code>1..=5</code>), destructuring of structs/enums/tuples, guards (<code>if</code>), and bindings (<code>@</code>).",
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
      challenge: "Create an enum Shape with Circle(f64) and Rectangle{width, height} and use match to calculate the area."
    },
    {
      id: "19.1",
      chapter: "19",
      title: "Unsafe Rust",
      explanation: "The <code>unsafe</code> block allows: dereferencing raw pointers, calling unsafe functions, accessing mutable static variables, and using unsafe traits. Use it only when necessary.",
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
      challenge: "Create a safe function that internally uses unsafe to add two raw pointers to i32."
    },
    {
      id: "19.2",
      chapter: "19",
      title: "Advanced Traits",
      explanation: "Associated types define a placeholder in the trait. Disambiguation syntax (<code>&lt;Type as Trait&gt;::method</code>) resolves conflicts. Supertraits require that another trait be implemented first.",
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
      challenge: "Create a Convert trait with an associated type Output and a convert(&self) -> Self::Output method."
    },
    {
      id: "19.3",
      chapter: "19",
      title: "Advanced Types",
      explanation: "Type aliases create synonyms (<code>type Km = i32</code>). The <code>!</code> (never) type indicates a function never returns. <code>Sized</code> is an implicit trait for types with a known size.",
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
      challenge: "Create a type alias for Result<T, String> and use it in a function that parses a number."
    },
    {
      id: "19.4",
      chapter: "19",
      title: "Advanced Functions and Closures",
      explanation: "Function pointers (<code>fn</code>) are a concrete type, different from the <code>Fn</code> trait. You can pass functions where closures are expected. You can also return closures with <code>Box&lt;dyn Fn&gt;</code>.",
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
      challenge: "Create a function that returns a closure that multiplies by a given number."
    },
    {
      id: "19.5",
      chapter: "19",
      title: "Macros",
      explanation: "Declarative macros (<code>macro_rules!</code>) generate code through pattern matching. Procedural macros (derive, attribute, function-like) operate on the code's AST.",
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
      challenge: "Create a 'hashmap!' macro that accepts key => value pairs and returns a HashMap."
    },
    {
      id: "20.1",
      chapter: "20",
      title: "Single-Threaded Server",
      explanation: "A basic TCP server uses <code>TcpListener::bind</code> to listen for connections. Each connection is read and responded to with HTTP. This approach only handles one request at a time.",
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
      challenge: "Modify the server to respond with HTML that includes an <h1> and a paragraph."
    },
    {
      id: "20.2",
      chapter: "20",
      title: "Multi-Threaded Server",
      explanation: "A ThreadPool limits the number of threads. Each worker receives jobs through a shared channel with <code>Arc&lt;Mutex&lt;Receiver&gt;&gt;</code>. This prevents creating infinite threads.",
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
      challenge: "Combine the ThreadPool with TcpListener to handle multiple HTTP connections."
    },
    {
      id: "20.3",
      chapter: "20",
      title: "Graceful Shutdown",
      explanation: "For a clean shutdown, the pool sends a termination message to each worker. When the sender is dropped, workers receive an error on recv() and terminate. Then each thread is joined.",
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
      challenge: "Modify the web server to shut down cleanly after receiving 5 requests."
    }
  );
})();
