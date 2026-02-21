// ─── LESSONS DATA: Chapters 11-15 ───
(function() {
const chunk = [

// ══════════════════════════════════════════════════════
// CHAPTER 11: Writing Automated Tests
// ══════════════════════════════════════════════════════
{
  id: "11.1",
  chapter: "11. Testing",
  title: "11.1 Escribiendo Tests",
  explanation: `<p>Rust tiene soporte integrado para pruebas. Se escribe una función de test con <code>#[test]</code> y se usan macros como <code>assert!</code>, <code>assert_eq!</code> y <code>assert_ne!</code> para verificar condiciones.</p>
<p>Las funciones de test se agrupan en un módulo <code>#[cfg(test)]</code>. Puedes verificar panics con <code>#[should_panic]</code> y personalizar mensajes de error con argumentos adicionales.</p>`,
  code: `fn sumar(a: i32, b: i32) -> i32 { a + b }
fn es_mayor(edad: u32) -> bool { edad >= 18 }
fn dividir(a: f64, b: f64) -> f64 {
    if b == 0.0 { panic!("División por cero"); }
    a / b
}

fn main() {
    assert_eq!(sumar(2, 3), 5);
    println!("✅ sumar(2, 3) == 5");

    assert_ne!(sumar(2, 3), 6);
    println!("✅ sumar(2, 3) != 6");

    assert!(es_mayor(20));
    println!("✅ 20 es mayor de edad");

    let r = sumar(2, 2);
    assert_eq!(r, 4, "Esperaba 4, obtuve {}", r);
    println!("✅ Mensaje personalizado funciona");

    let result = std::panic::catch_unwind(|| dividir(10.0, 0.0));
    assert!(result.is_err());
    println!("✅ dividir por cero causa panic");

    println!("\\n🎉 ¡Todos los tests pasaron!");
}`,
  challenge: "Crea un struct Calculadora con métodos sumar, restar, multiplicar y dividir. Escribe tests que verifiquen cada operación, incluyendo un test con #[should_panic] para la división por cero."
},
{
  id: "11.2",
  chapter: "11. Testing",
  title: "11.2 Ejecutando Tests",
  explanation: `<p>Con <code>cargo test</code> ejecutas todas las pruebas. Puedes filtrar por nombre, mostrar stdout con <code>--nocapture</code>, o ejecutar secuencialmente con <code>--test-threads=1</code>.</p>
<p>Los tests pueden retornar <code>Result&lt;(), E&gt;</code> para usar el operador <code>?</code>. Usa <code>#[ignore]</code> para tests lentos y ejecútalos con <code>cargo test -- --ignored</code>.</p>`,
  code: `fn procesar(input: &str) -> Result<i32, String> {
    input.parse::<i32>().map_err(|e| format!("Error: {}", e))
}

fn validar_email(email: &str) -> bool {
    email.contains('@') && email.contains('.')
}

fn main() {
    // Test con Result - permite usar ?
    let test_result: Result<(), String> = (|| {
        let valor = procesar("42")?;
        assert_eq!(valor, 42);
        println!("✅ procesar(\"42\") = {}", valor);
        let error = procesar("abc");
        assert!(error.is_err());
        println!("✅ \"abc\" produce error");
        Ok(())
    })();
    assert!(test_result.is_ok());

    println!("\\n📋 Filtrado de tests:");
    println!("  cargo test email      → solo tests con 'email'");
    println!("  cargo test -- --ignored → solo los ignorados");

    let emails = vec![("user@ex.com", true), ("invalido", false), ("a@b.c", true)];
    for (email, esperado) in &emails {
        assert_eq!(validar_email(email), *esperado);
        println!("✅ validar_email(\"{}\") == {}", email, esperado);
    }
}`,
  challenge: "Crea una función que convierta temperaturas entre Celsius y Fahrenheit. Escribe tests que retornen Result<(), String> y usa el operador ? para verificar."
},
{
  id: "11.3",
  chapter: "11. Testing",
  title: "11.3 Organización de Tests",
  explanation: `<p>Rust distingue <strong>tests unitarios</strong> (en módulos <code>#[cfg(test)]</code>, pueden probar funciones privadas) y <strong>tests de integración</strong> (en <code>tests/</code>, solo API pública).</p>
<p>Para compartir código entre tests de integración usa <code>tests/common/mod.rs</code>. Cada archivo en <code>tests/</code> es un crate independiente.</p>`,
  code: `pub struct Validador {
    min_len: usize,
    requiere_num: bool,
}

impl Validador {
    pub fn new(min_len: usize, requiere_num: bool) -> Self {
        Validador { min_len, requiere_num }
    }

    pub fn validar(&self, input: &str) -> Result<(), Vec<String>> {
        let mut err = Vec::new();
        if input.len() < self.min_len {
            err.push(format!("Mínimo {} caracteres", self.min_len));
        }
        if self.requiere_num && !Self::tiene_num(input) {
            err.push("Requiere un número".into());
        }
        if err.is_empty() { Ok(()) } else { Err(err) }
    }

    fn tiene_num(s: &str) -> bool { s.chars().any(|c| c.is_ascii_digit()) }
}

fn main() {
    // Test unitario: función privada
    assert!(Validador::tiene_num("abc123"));
    assert!(!Validador::tiene_num("abcdef"));
    println!("✅ tiene_num (privada) funciona");

    let v = Validador::new(8, true);
    assert!(v.validar("secure123").is_ok());
    println!("✅ \"secure123\" es válida");

    let err = v.validar("ab1").unwrap_err();
    assert!(err.iter().any(|e| e.contains("Mínimo")));
    println!("✅ \"ab1\" falla por longitud");

    let err = v.validar("ab").unwrap_err();
    assert_eq!(err.len(), 2);
    println!("✅ \"ab\" tiene 2 errores");

    println!("\\n📁 Estructura:");
    println!("  src/lib.rs          → código + tests unitarios");
    println!("  tests/validador.rs  → tests de integración");
    println!("  tests/common/mod.rs → helpers compartidos");
}`,
  challenge: "Diseña un módulo de autenticación con funciones públicas y privadas. Escribe tests unitarios para las internas y tests de integración para la API pública."
},

// ══════════════════════════════════════════════════════
// CHAPTER 12: An I/O Project
// ══════════════════════════════════════════════════════
{
  id: "12.1",
  chapter: "12. Proyecto I/O",
  title: "12.1 Aceptando Argumentos",
  explanation: `<p>Los argumentos de línea de comandos se obtienen con <code>std::env::args()</code>. El primer argumento es el nombre del programa. Es buena práctica crear un struct Config que parsee los argumentos.</p>
<p>Esto separa la lógica de parsing de la lógica principal y permite validar la cantidad de argumentos con mensajes de error claros.</p>`,
  code: `struct Config {
    consulta: String,
    archivo: String,
}

impl Config {
    fn new(args: &[String]) -> Result<Config, &str> {
        if args.len() < 3 {
            return Err("Uso: programa <consulta> <archivo>");
        }
        Ok(Config {
            consulta: args[1].clone(),
            archivo: args[2].clone(),
        })
    }
}

fn main() {
    let escenarios = vec![
        vec!["prog".into()],
        vec!["prog".into(), "buscar".into()],
        vec!["minigrep".into(), "rust".into(), "poema.txt".into()],
    ];

    for (i, args) in escenarios.iter().enumerate() {
        println!("--- Escenario {} ---", i + 1);
        match Config::new(args) {
            Ok(c) => println!("✅ Consulta: \"{}\", Archivo: \"{}\"", c.consulta, c.archivo),
            Err(e) => println!("❌ {}", e),
        }
    }
}`,
  challenge: "Extiende Config para aceptar flags opcionales como --ignore-case y --count con parsing robusto."
},
{
  id: "12.2",
  chapter: "12. Proyecto I/O",
  title: "12.2 Leyendo un Archivo",
  explanation: `<p>Para leer archivos usa <code>std::fs::read_to_string()</code>. Las operaciones de archivo retornan <code>Result</code>, así que maneja los errores con <code>match</code> o <code>?</code>.</p>
<p>Para archivos grandes, <code>BufReader</code> lee por líneas sin cargar todo en memoria usando el método <code>lines()</code>.</p>`,
  code: `use std::io::{self, BufRead};

fn buscar<'a>(consulta: &str, contenido: &'a str) -> Vec<&'a str> {
    contenido.lines().filter(|l| l.contains(consulta)).collect()
}

fn main() {
    let poema = "Los suspiros se escapan\\nde mi corazón doliente\\nRust es seguro\\ny previene errores de memoria.";

    println!("📄 Contenido:");
    println!("{}\\n", poema);
    println!("Líneas: {}", poema.lines().count());
    println!("Palabras: {}", poema.split_whitespace().count());

    println!("\\n🔍 Buscando \"de\":");
    for l in buscar("de", poema) {
        println!("  → {}", l);
    }

    println!("\\n📖 Con BufReader:");
    let cursor = io::Cursor::new(poema);
    for (i, linea) in cursor.lines().enumerate() {
        if let Ok(l) = linea { println!("  L{}: {}", i+1, l); }
    }
}`,
  challenge: "Implementa una función que genere estadísticas de un texto: líneas, palabras, caracteres, palabra más frecuente y línea más larga."
},
{
  id: "12.3",
  chapter: "12. Proyecto I/O",
  title: "12.3 Refactorizando",
  explanation: `<p>Separa responsabilidades: <code>Config::build()</code> para parsing, <code>run()</code> para lógica, y <code>main()</code> solo para coordinar y manejar errores.</p>
<p>Es buena práctica que la lógica viva en <code>lib.rs</code> y el punto de entrada en <code>main.rs</code>, facilitando tests y reutilización.</p>`,
  code: `struct Config { query: String, text: String, case_sensitive: bool }

impl Config {
    fn build(args: &[String]) -> Result<Config, String> {
        if args.len() < 3 { return Err("Uso: programa <query> <text>".into()); }
        Ok(Config { query: args[1].clone(), text: args[2..].join(" "), case_sensitive: true })
    }
}

fn run(config: &Config) -> Vec<String> {
    config.text.lines()
        .enumerate()
        .filter(|(_, l)| {
            if config.case_sensitive { l.contains(&config.query) }
            else { l.to_lowercase().contains(&config.query.to_lowercase()) }
        })
        .map(|(i, l)| format!("L{}: {}", i+1, l))
        .collect()
}

fn main() {
    let args = vec!["prog".into(), "seguro".into(),
        "Rust es seguro y rápido.\\nPython es dinámico.\\nRust es seguro de verdad.".into()];

    let config = Config::build(&args).unwrap_or_else(|e| {
        eprintln!("Error: {}", e);
        std::process::exit(1);
    });

    println!("🔍 Buscando: \"{}\"\\n", config.query);
    let resultados = run(&config);
    if resultados.is_empty() { println!("Sin resultados."); }
    else { for r in &resultados { println!("  {}", r); } }
}`,
  challenge: "Refactoriza un programa monolítico separando parsing, validación y ejecución en funciones que retornen Result."
},
{
  id: "12.4",
  chapter: "12. Proyecto I/O",
  title: "12.4 TDD: Desarrollo Guiado por Tests",
  explanation: `<p><strong>TDD</strong> consiste en escribir tests antes del código: 🔴 test falla → 🟢 código mínimo → 🔄 refactoriza. En Rust este ciclo es natural gracias al compilador.</p>
<p>Para minigrep escribimos primero el test de <code>search()</code>, verificamos que falla, y luego implementamos la función.</p>`,
  code: `fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    contents.lines().filter(|l| l.contains(query)).collect()
}

fn search_insensitive<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    let q = query.to_lowercase();
    contents.lines().filter(|l| l.to_lowercase().contains(&q)).collect()
}

fn main() {
    let text = "Rust es rápido.\\nTres reglas del ownership.\\nRUST previene bugs.\\nCódigo rust seguro.";

    let r = search("Rust", text);
    assert_eq!(r, vec!["Rust es rápido."]);
    println!("✅ búsqueda case-sensitive");

    let r = search_insensitive("rust", text);
    assert_eq!(r.len(), 3);
    println!("✅ búsqueda case-insensitive: 3 líneas");

    assert!(search("Python", text).is_empty());
    println!("✅ sin resultados retorna vacío");

    println!("\\n📋 Ciclo TDD:");
    println!("  1. 🔴 Escribe test → falla");
    println!("  2. 🟢 Código mínimo → pasa");
    println!("  3. 🔄 Refactoriza → sigue pasando");
}`,
  challenge: "Usa TDD para implementar search_with_context que retorne la línea encontrada junto con las líneas anterior y siguiente."
},
{
  id: "12.5",
  chapter: "12. Proyecto I/O",
  title: "12.5 Variables de Entorno",
  explanation: `<p><code>std::env::var()</code> lee variables de entorno. Para minigrep, <code>IGNORE_CASE</code> controla si la búsqueda distingue mayúsculas.</p>
<p>Las variables de entorno son ideales para configuraciones del entorno de ejecución (desarrollo vs producción).</p>`,
  code: `use std::env;

fn search<'a>(query: &str, text: &'a str, case_sensitive: bool) -> Vec<&'a str> {
    if case_sensitive {
        text.lines().filter(|l| l.contains(query)).collect()
    } else {
        let q = query.to_lowercase();
        text.lines().filter(|l| l.to_lowercase().contains(&q)).collect()
    }
}

fn main() {
    for var in &["PATH", "HOME", "USER"] {
        match env::var(var) {
            Ok(v) => println!("{} = {}...", var, &v[..v.len().min(40)]),
            Err(_) => println!("{} = (no definida)", var),
        }
    }

    let ignore = env::var("IGNORE_CASE").is_ok();
    let text = "Rust es poderoso.\\nrust es seguro.\\nRUST previene bugs.";

    println!("\\n🔍 Case sensitive:");
    for l in search("rust", text, true) { println!("  → {}", l); }

    println!("🔍 Case insensitive:");
    for l in search("rust", text, false) { println!("  → {}", l); }
}`,
  challenge: "Crea un sistema de configuración que combine args, variables de entorno y valores por defecto con prioridad: args > env > defaults."
},
{
  id: "12.6",
  chapter: "12. Proyecto I/O",
  title: "12.6 Escribiendo a stderr",
  explanation: `<p><code>println!</code> escribe a stdout (datos), <code>eprintln!</code> escribe a stderr (errores). Esto permite redirigir stdout a un archivo sin perder los errores.</p>
<p>Convención: datos útiles a stdout, mensajes informativos y errores a stderr. Esto hace tus programas componibles con pipes.</p>`,
  code: `fn procesar(datos: &[&str]) -> Result<Vec<String>, String> {
    let mut res = Vec::new();
    for d in datos {
        if d.is_empty() { return Err("Dato vacío".into()); }
        res.push(d.to_uppercase());
    }
    Ok(res)
}

fn main() {
    eprintln!("🔧 Iniciando...");
    let datos = vec!["rust", "es", "genial"];

    match procesar(&datos) {
        Ok(r) => {
            for item in &r { println!("{}", item); }
            eprintln!("✅ Procesados {} elementos", r.len());
        }
        Err(e) => { eprintln!("❌ Error: {}", e); std::process::exit(1); }
    }

    eprintln!("\\n💡 Redirección:");
    eprintln!("  $ prog > salida.txt    → stdout al archivo");
    eprintln!("  $ prog 2> errores.txt  → stderr al archivo");
}`,
  challenge: "Crea un programa que escriba resultados a stdout y un log detallado a stderr con niveles INFO, WARN, ERROR."
},

// ══════════════════════════════════════════════════════
// CHAPTER 13: Functional Language Features
// ══════════════════════════════════════════════════════
{
  id: "13.1",
  chapter: "13. Características Funcionales",
  title: "13.1 Closures",
  explanation: `<p>Los <strong>closures</strong> son funciones anónimas que capturan variables del entorno. Se definen con <code>|params|</code> y capturan por referencia, referencia mutable, o valor (<code>move</code>).</p>
<p>Implementan traits <code>Fn</code>, <code>FnMut</code>, o <code>FnOnce</code> según cómo capturan. Esto permite pasarlos como parámetros y retornarlos desde funciones.</p>`,
  code: `fn aplicar<F: Fn(i32) -> i32>(f: F, v: i32) -> i32 { f(v) }

fn crear_sumador(n: i32) -> Box<dyn Fn(i32) -> i32> {
    Box::new(move |x| x + n)
}

fn main() {
    let duplicar = |x: i32| x * 2;
    println!("duplicar(5) = {}", duplicar(5));

    let factor = 3;
    let mult = |x| x * factor;
    println!("mult(7) = {}", mult(7));

    let nombre = String::from("Rust");
    let saludo = move || println!("¡Hola, {}!", nombre);
    saludo();

    println!("aplicar(|x| x*x, 5) = {}", aplicar(|x| x * x, 5));

    let sum10 = crear_sumador(10);
    println!("sum10(5) = {}", sum10(5));

    let mut cnt = 0;
    let mut inc = || { cnt += 1; cnt };
    println!("inc: {}, {}, {}", inc(), inc(), inc());

    let nums = vec![1,2,3,4,5,6,7,8,9,10];
    let pares: Vec<_> = nums.iter().filter(|&&x| x % 2 == 0).collect();
    let cuad: Vec<_> = nums.iter().map(|&x| x * x).collect();
    println!("Pares: {:?}", pares);
    println!("Cuadrados: {:?}", cuad);
}`,
  challenge: "Implementa una función memoize que tome un closure Fn(i32) -> i32 y retorne uno que cache resultados con HashMap."
},
{
  id: "13.2",
  chapter: "13. Características Funcionales",
  title: "13.2 Iteradores",
  explanation: `<p>Los iteradores son lazy y se basan en el trait <code>Iterator</code> con <code>next()</code>. Adaptadores como <code>map</code>, <code>filter</code>, <code>zip</code> transforman sin ejecutar; consumidores como <code>collect</code>, <code>sum</code>, <code>fold</code> activan la cadena.</p>
<p>Puedes crear iteradores personalizados implementando el trait <code>Iterator</code>.</p>`,
  code: `struct Fibonacci { a: u64, b: u64 }

impl Fibonacci {
    fn new() -> Self { Fibonacci { a: 0, b: 1 } }
}

impl Iterator for Fibonacci {
    type Item = u64;
    fn next(&mut self) -> Option<u64> {
        let r = self.a;
        let n = self.a + self.b;
        self.a = self.b;
        self.b = n;
        Some(r)
    }
}

fn main() {
    let suma: i32 = (1..=100).sum();
    println!("Suma 1..100 = {}", suma);

    let r: Vec<i32> = (1..=20).filter(|x| x % 2 == 0).map(|x| x * x).take(5).collect();
    println!("Pares² (5): {:?}", r);

    let fact: u64 = (1..=10).fold(1, |a, x| a * x);
    println!("10! = {}", fact);

    let nombres = vec!["Ana", "Bob", "Carlos"];
    let edades = vec![25, 30, 35];
    let pares: Vec<_> = nombres.iter().zip(edades.iter()).collect();
    println!("Zip: {:?}", pares);

    let fibs: Vec<u64> = Fibonacci::new().take(10).collect();
    println!("Fibonacci: {:?}", fibs);

    println!("¿Tiene par? {}", (1..10).any(|x| x % 2 == 0));
    println!("Primer > 5: {:?}", (1..10).find(|&x| x > 5));
}`,
  challenge: "Implementa un iterador de números primos. Encuentra los primeros 20 primos, su suma, y el primer primo mayor a 100."
},
{
  id: "13.3",
  chapter: "13. Características Funcionales",
  title: "13.3 Mejorando el Proyecto I/O",
  explanation: `<p>Con iteradores, <code>Config::build()</code> puede tomar ownership del iterador directamente, eliminando clones. La función <code>search()</code> usa <code>filter</code> y <code>collect</code> en lugar de bucles mutables.</p>
<p>El código resultante es más conciso, expresivo y menos propenso a errores.</p>`,
  code: `struct Config { query: String, case_sensitive: bool }

impl Config {
    fn build(mut args: impl Iterator<Item = String>) -> Result<Config, &'static str> {
        args.next();
        let query = args.next().ok_or("Falta consulta")?;
        let ci = args.any(|a| a == "-i");
        Ok(Config { query, case_sensitive: !ci })
    }
}

fn search<'a>(q: &str, text: &'a str, cs: bool) -> Vec<&'a str> {
    if cs { text.lines().filter(|l| l.contains(q)).collect() }
    else {
        let q = q.to_lowercase();
        text.lines().filter(|l| l.to_lowercase().contains(&q)).collect()
    }
}

fn main() {
    let text = "Programar en Rust es seguro.\\nrust tiene gran ecosistema.\\nEl compilador RUST ayuda.";
    let args = vec!["prog".into(), "rust".into(), "-i".into()];
    let config = Config::build(args.into_iter()).unwrap();

    println!("🔍 \"{}\" (case_sensitive: {})\\n", config.query, config.case_sensitive);
    search(&config.query, text, config.case_sensitive)
        .iter().enumerate()
        .for_each(|(i, l)| println!("  {}: {}", i+1, l));

    // Imperativo vs funcional
    let count = text.lines().filter(|l| l.to_lowercase().contains("rust")).count();
    println!("\\nTotal coincidencias: {}", count);
}`,
  challenge: "Reescribe el programa usando solo iteradores (sin for). Agrega números de línea y resaltado de coincidencias."
},
{
  id: "13.4",
  chapter: "13. Características Funcionales",
  title: "13.4 Rendimiento: Loops vs Iteradores",
  explanation: `<p>Los iteradores en Rust son <strong>abstracciones de costo cero</strong>: el compilador los optimiza al mismo código que escribirías a mano con loops.</p>
<p>Esto significa que puedes usar el estilo más expresivo sin sacrificar rendimiento. Los iteradores son idiomáticos y preferidos en Rust.</p>`,
  code: `use std::time::Instant;

fn suma_loop(n: u64) -> u64 {
    let mut t: u64 = 0;
    for i in 0..=n { t += i; }
    t
}
fn suma_iter(n: u64) -> u64 { (0..=n).sum() }
fn suma_formula(n: u64) -> u64 { n * (n + 1) / 2 }

fn main() {
    let n: u64 = 1_000_000;
    assert_eq!(suma_loop(n), suma_iter(n));
    assert_eq!(suma_iter(n), suma_formula(n));
    println!("Suma 0..{} = {}\\n", n, suma_formula(n));

    let metodos: Vec<(&str, fn(u64)->u64)> = vec![
        ("Loop for", suma_loop), ("Iterator .sum()", suma_iter), ("Fórmula O(1)", suma_formula),
    ];

    for (nombre, f) in &metodos {
        let start = Instant::now();
        for _ in 0..100 { std::hint::black_box(f(n)); }
        println!("{:<20} {:>8.2?}", nombre, start.elapsed());
    }

    println!("\\n💡 En release, loop e iteradores compilan al mismo código.");

    let datos: Vec<f64> = (0..1000).map(|x| x as f64 * 0.1).collect();
    let (sum, min, max, cnt) = datos.iter().fold(
        (0.0f64, f64::MAX, f64::MIN, 0usize),
        |(s, mn, mx, c), &x| (s+x, mn.min(x), mx.max(x), c+1),
    );
    println!("\\n📊 {} elementos: sum={:.1}, min={:.1}, max={:.1}, avg={:.2}", cnt, sum, min, max, sum/cnt as f64);
}`,
  challenge: "Compara el rendimiento de encontrar duplicados: bucles anidados, sort+dedup, y HashSet."
},

// ══════════════════════════════════════════════════════
// CHAPTER 14: Cargo and Crates.io
// ══════════════════════════════════════════════════════
{
  id: "14.1",
  chapter: "14. Cargo y Crates.io",
  title: "14.1 Perfiles de Release",
  explanation: `<p>Cargo tiene perfiles <code>dev</code> (opt-level 0, compilación rápida) y <code>release</code> (opt-level 3, ejecución rápida). Se personalizan en <code>Cargo.toml</code> bajo <code>[profile.dev]</code> y <code>[profile.release]</code>.</p>
<p>Opciones clave: <code>opt-level</code>, <code>lto</code>, <code>codegen-units</code>, <code>strip</code>. Compila release con <code>cargo build --release</code>.</p>`,
  code: `fn main() {
    println!("📄 Ejemplo Cargo.toml:\\n");
    println!("[profile.dev]");
    println!("opt-level = 0    # Sin optimización");
    println!("\\n[profile.release]");
    println!("opt-level = 3    # Máxima optimización");
    println!("lto = true       # Link Time Optimization");
    println!("strip = true     # Sin símbolos debug");

    #[cfg(debug_assertions)]
    println!("\\n🔧 Modo actual: DEBUG");
    #[cfg(not(debug_assertions))]
    println!("\\n🚀 Modo actual: RELEASE");

    println!("\\n┌──────────────┬─────────┬──────────┐");
    println!("│              │ dev     │ release  │");
    println!("├──────────────┼─────────┼──────────┤");
    println!("│ opt-level    │ 0       │ 3        │");
    println!("│ Compilación  │ Rápida  │ Lenta    │");
    println!("│ Ejecución    │ Lenta   │ Rápida   │");
    println!("└──────────────┴─────────┴──────────┘");
}`,
  challenge: "Investiga cómo crear un perfil personalizado 'profiling' que herede de release pero mantenga info de debug."
},
{
  id: "14.2",
  chapter: "14. Cargo y Crates.io",
  title: "14.2 Publicando en Crates.io",
  explanation: `<p>Documenta con <code>///</code> (doc comments en Markdown), compila docs con <code>cargo doc</code>. Los ejemplos en docs se ejecutan como tests.</p>
<p>Semver: MAJOR (incompatible), MINOR (nueva funcionalidad), PATCH (correcciones). Usa <code>pub use</code> para una API pública limpia.</p>`,
  code: `/// Estadísticas de un conjunto de datos.
/// # Ejemplo
/// \`\`\`
/// let s = Stats::new(&[1.0, 2.0, 3.0]);
/// assert_eq!(s.count(), 3);
/// \`\`\`
struct Stats { datos: Vec<f64> }

impl Stats {
    /// Crea Stats desde un slice.
    fn new(data: &[f64]) -> Self { Stats { datos: data.to_vec() } }
    fn count(&self) -> usize { self.datos.len() }
    fn mean(&self) -> f64 { self.datos.iter().sum::<f64>() / self.datos.len() as f64 }
    fn min(&self) -> f64 { self.datos.iter().cloned().fold(f64::INFINITY, f64::min) }
    fn max(&self) -> f64 { self.datos.iter().cloned().fold(f64::NEG_INFINITY, f64::max) }
}

fn main() {
    let s = Stats::new(&[10.0, 20.0, 30.0, 40.0, 50.0]);
    println!("📊 Count: {}, Mean: {:.1}, Min: {:.1}, Max: {:.1}",
        s.count(), s.mean(), s.min(), s.max());

    println!("\\n📦 Publicar: cargo login → llenar Cargo.toml → cargo publish");
}`,
  challenge: "Diseña la API de un crate 'mini-stats' con documentación completa y ejemplos ejecutables."
},
{
  id: "14.3",
  chapter: "14. Cargo y Crates.io",
  title: "14.3 Workspaces de Cargo",
  explanation: `<p>Un workspace gestiona múltiples crates con un <code>target/</code> y <code>Cargo.lock</code> compartidos. Se define con <code>[workspace]</code> en el Cargo.toml raíz.</p>
<p>Ideal para proyectos con un binario y varias librerías. Usa <code>cargo run -p crate</code> para ejecutar un crate específico.</p>`,
  code: `fn main() {
    println!("📁 Estructura de workspace:");
    println!("mi-workspace/");
    println!("├── Cargo.toml     # [workspace] members = [...]");
    println!("├── adder/src/main.rs");
    println!("├── add_one/src/lib.rs");
    println!("└── add_two/src/lib.rs\\n");

    fn add_one(x: i32) -> i32 { x + 1 }
    fn add_two(x: i32) -> i32 { x + 2 }

    let n = 10;
    println!("add_one({}) = {}", n, add_one(n));
    println!("add_two({}) = {}", n, add_two(n));

    println!("\\n🛠️ Comandos:");
    println!("  cargo build           → todo el workspace");
    println!("  cargo run -p adder    → crate específico");
    println!("  cargo test -p add_one → tests específicos");
}`,
  challenge: "Diseña un workspace con 'cli', 'core' y 'utils'. Define las dependencias entre ellos."
},
{
  id: "14.4",
  chapter: "14. Cargo y Crates.io",
  title: "14.4 Cargo Install",
  explanation: `<p><code>cargo install</code> instala binarios de crates.io en <code>~/.cargo/bin/</code>. Solo crates con <code>src/main.rs</code> pueden instalarse.</p>
<p>Muchas herramientas modernas de terminal están escritas en Rust: ripgrep, fd, bat, eza, starship, etc.</p>`,
  code: `fn main() {
    let tools = vec![
        ("ripgrep (rg)", "grep rápido"),
        ("fd-find (fd)", "find moderno"),
        ("bat", "cat con syntax highlighting"),
        ("eza", "ls con colores y Git"),
        ("tokei", "Contar líneas de código"),
        ("starship", "Prompt personalizable"),
    ];

    println!("🛠️ Herramientas Rust populares:\\n");
    for (name, desc) in &tools {
        println!("  📦 {} — {}", name, desc);
    }

    println!("\\n💡 cargo install ripgrep");
    println!("   cargo install --list     → listar instalados");
    println!("   Binarios en ~/.cargo/bin/");
}`,
  challenge: "Lista 5 herramientas Rust que podrían reemplazar herramientas que usas diariamente."
},
{
  id: "14.5",
  chapter: "14. Cargo y Crates.io",
  title: "14.5 Comandos Personalizados",
  explanation: `<p>Cualquier binario <code>cargo-algo</code> en tu PATH se ejecuta como <code>cargo algo</code>. Extensiones populares: cargo-edit, cargo-watch, cargo-clippy, cargo-fmt.</p>
<p>Puedes crear subcomandos propios creando un binario con prefijo <code>cargo-</code>.</p>`,
  code: `fn main() {
    let ext = vec![
        ("cargo-edit", "cargo add serde", "Agregar dependencias"),
        ("cargo-watch", "cargo watch -x test", "Recompilar al cambiar"),
        ("cargo-clippy", "cargo clippy", "Linter avanzado"),
        ("cargo-fmt", "cargo fmt", "Formatear código"),
    ];

    println!("🔌 Extensiones populares:\\n");
    for (name, cmd, desc) in &ext {
        println!("  {} — {} ({})", name, desc, cmd);
    }

    println!("\\n🛠️ Crear tu propio:");
    println!("  1. cargo new cargo-mi-tool");
    println!("  2. Implementar lógica");
    println!("  3. cargo install --path .");
    println!("  4. Usar: cargo mi-tool");
}`,
  challenge: "Diseña un subcomando cargo-todo que busque TODO y FIXME en el código fuente."
},

// ══════════════════════════════════════════════════════
// CHAPTER 15: Smart Pointers
// ══════════════════════════════════════════════════════
{
  id: "15.1",
  chapter: "15. Smart Pointers",
  title: "15.1 Box<T>: Datos en el Heap",
  explanation: `<p><code>Box&lt;T&gt;</code> almacena datos en el heap. Es necesario para tipos recursivos (listas, árboles) donde el compilador necesita un tamaño conocido.</p>
<p>Box implementa <code>Deref</code> y <code>Drop</code>: se usa como referencia y libera memoria automáticamente al salir del scope.</p>`,
  code: `use std::fmt;

#[derive(Debug)]
enum Lista {
    Cons(i32, Box<Lista>),
    Nil,
}

impl Lista {
    fn new() -> Self { Lista::Nil }
    fn push(self, v: i32) -> Self { Lista::Cons(v, Box::new(self)) }
    fn to_vec(&self) -> Vec<i32> {
        let mut r = Vec::new();
        let mut cur = self;
        while let Lista::Cons(v, next) = cur { r.push(*v); cur = next; }
        r
    }
}

#[derive(Debug)]
enum Arbol {
    Hoja(i32),
    Nodo(Box<Arbol>, i32, Box<Arbol>),
    Vacio,
}

impl Arbol {
    fn suma(&self) -> i32 {
        match self {
            Arbol::Vacio => 0,
            Arbol::Hoja(v) => *v,
            Arbol::Nodo(i, v, d) => i.suma() + v + d.suma(),
        }
    }
}

fn main() {
    let b = Box::new(42);
    println!("Box: {}, tamaño en stack: {} bytes", b, std::mem::size_of::<Box<i32>>());

    let lista = Lista::new().push(1).push(2).push(3).push(4);
    println!("Lista: {:?}", lista.to_vec());

    let arbol = Arbol::Nodo(
        Box::new(Arbol::Nodo(Box::new(Arbol::Hoja(1)), 2, Box::new(Arbol::Hoja(3)))),
        4,
        Box::new(Arbol::Hoja(5)),
    );
    println!("Árbol suma: {}", arbol.suma());
}`,
  challenge: "Implementa un BST con Box: insert, contains, y recorrido in-order."
},
{
  id: "15.2",
  chapter: "15. Smart Pointers",
  title: "15.2 Deref: Tratar como Referencias",
  explanation: `<p>El trait <code>Deref</code> permite personalizar <code>*</code>. La <strong>deref coercion</strong> convierte automáticamente <code>&String</code> → <code>&str</code>, <code>&Box&lt;T&gt;</code> → <code>&T</code>, etc.</p>
<p>También existe <code>DerefMut</code> para desreferencia mutable. Esto hace el código ergonómico sin costo.</p>`,
  code: `use std::ops::Deref;

struct MiBox<T>(T);

impl<T> MiBox<T> { fn new(x: T) -> Self { MiBox(x) } }

impl<T> Deref for MiBox<T> {
    type Target = T;
    fn deref(&self) -> &T { &self.0 }
}

fn saludar(nombre: &str) { println!("¡Hola, {}!", nombre); }

fn main() {
    let x = 5;
    let y = MiBox::new(x);
    assert_eq!(5, *y);
    println!("*MiBox = {}", *y);

    // Deref coercion: MiBox<String> → &String → &str
    let nombre = MiBox::new(String::from("Rust"));
    saludar(&nombre);

    let boxed = Box::new(String::from("Mundo"));
    saludar(&boxed);  // &Box<String> → &String → &str

    let s = String::from("Hola");
    saludar(&s);  // &String → &str

    println!("✅ Deref coercion es automático y ergonómico");
}`,
  challenge: "Crea un tipo Sensitive<T> que implemente Deref pero oculte el valor en Debug/Display (mostrando '***')."
},
{
  id: "15.3",
  chapter: "15. Smart Pointers",
  title: "15.3 Drop: Código de Limpieza",
  explanation: `<p>El trait <code>Drop</code> ejecuta código al salir del scope (destructor). Rust llama drop automáticamente en orden inverso. Usa <code>std::mem::drop()</code> para liberar anticipadamente.</p>
<p>Drop es la base de RAII: los recursos se liberan automáticamente sin garbage collector.</p>`,
  code: `struct Recurso { nombre: String }

impl Recurso {
    fn new(n: &str) -> Self {
        println!("📦 Creando: {}", n);
        Recurso { nombre: n.into() }
    }
}

impl Drop for Recurso {
    fn drop(&mut self) { println!("🗑️  Liberando: {}", self.nombre); }
}

fn main() {
    println!("=== Orden inverso ===");
    {
        let _a = Recurso::new("Primero");
        let _b = Recurso::new("Segundo");
        let _c = Recurso::new("Tercero");
        println!("--- Fin scope ---");
    }

    println!("\\n=== Drop anticipado ===");
    let r = Recurso::new("Temporal");
    println!("Usando recurso...");
    drop(r);
    println!("Ya liberado, continuamos");

    println!("\\n=== RAII ===");
    {
        let _conn = Recurso::new("Conexión DB");
        println!("Usando conexión...");
    }
    println!("Conexión cerrada automáticamente");
}`,
  challenge: "Implementa un TempFile que cree un archivo temporal y lo elimine automáticamente con Drop."
},
{
  id: "15.4",
  chapter: "15. Smart Pointers",
  title: "15.4 Rc<T>: Conteo de Referencias",
  explanation: `<p><code>Rc&lt;T&gt;</code> permite múltiples propietarios. Cada <code>Rc::clone()</code> incrementa un contador; al llegar a cero, los datos se liberan.</p>
<p>Solo para un hilo. Para multi-hilo usa <code>Arc&lt;T&gt;</code> (atómico). Útil en grafos y datos compartidos inmutables.</p>`,
  code: `use std::rc::Rc;

#[derive(Debug)]
enum Lista { Cons(i32, Rc<Lista>), Nil }

fn main() {
    let a = Rc::new(Lista::Cons(5, Rc::new(Lista::Cons(10, Rc::new(Lista::Nil)))));
    println!("Refs después de crear a: {}", Rc::strong_count(&a));

    let _b = Lista::Cons(3, Rc::clone(&a));
    println!("Refs después de b: {}", Rc::strong_count(&a));

    {
        let _c = Lista::Cons(4, Rc::clone(&a));
        println!("Refs con c: {}", Rc::strong_count(&a));
    }
    println!("Refs sin c: {}", Rc::strong_count(&a));

    // Config compartida
    let config = Rc::new(("postgres://localhost", 10));
    let s1 = Rc::clone(&config);
    let s2 = Rc::clone(&config);
    println!("\\nConfig: {:?}, refs: {}", s1, Rc::strong_count(&config));
    println!("¿Mismo ptr? {}", Rc::ptr_eq(&config, &s2));
}`,
  challenge: "Implementa un grafo simple con Rc donde múltiples aristas apunten al mismo nodo."
},
{
  id: "15.5",
  chapter: "15. Smart Pointers",
  title: "15.5 RefCell<T>: Mutabilidad Interior",
  explanation: `<p><code>RefCell&lt;T&gt;</code> verifica borrowing en runtime. <code>borrow()</code> da referencia inmutable, <code>borrow_mut()</code> da mutable. Violar reglas causa panic.</p>
<p><code>Rc&lt;RefCell&lt;T&gt;&gt;</code> es un patrón común: múltiples propietarios con mutabilidad.</p>`,
  code: `use std::cell::RefCell;
use std::rc::Rc;

struct Cuenta {
    titular: String,
    saldo: RefCell<f64>,
}

impl Cuenta {
    fn new(t: &str, s: f64) -> Self { Cuenta { titular: t.into(), saldo: RefCell::new(s) } }
    fn depositar(&self, m: f64) { *self.saldo.borrow_mut() += m; }
    fn retirar(&self, m: f64) -> Result<(), String> {
        let mut s = self.saldo.borrow_mut();
        if *s >= m { *s -= m; Ok(()) } else { Err(format!("Insuficiente: {:.2}", *s)) }
    }
    fn saldo(&self) -> f64 { *self.saldo.borrow() }
}

fn main() {
    let cuenta = Cuenta::new("Ana", 1000.0);
    println!("Saldo: \${:.2}", cuenta.saldo());
    cuenta.depositar(500.0);
    println!("Después +500: \${:.2}", cuenta.saldo());
    cuenta.retirar(200.0).unwrap();
    println!("Después -200: \${:.2}", cuenta.saldo());

    // Rc<RefCell<T>>
    let shared = Rc::new(RefCell::new(vec![1, 2, 3]));
    let r1 = Rc::clone(&shared);
    let r2 = Rc::clone(&shared);
    r1.borrow_mut().push(4);
    r2.borrow_mut().push(5);
    println!("\\nCompartida: {:?}", shared.borrow());
}`,
  challenge: "Implementa un caché LRU con Rc<RefCell<T>> con capacidad fija y evicción."
},
{
  id: "15.6",
  chapter: "15. Smart Pointers",
  title: "15.6 Ciclos de Referencias",
  explanation: `<p>Con <code>Rc&lt;RefCell&lt;T&gt;&gt;</code> puedes crear ciclos (A→B→A) causando memory leaks. <code>Weak&lt;T&gt;</code> resuelve esto: no incrementa strong_count y <code>upgrade()</code> retorna <code>Option</code>.</p>
<p>Patrón: padres con <code>Rc</code> a hijos, hijos con <code>Weak</code> al padre.</p>`,
  code: `use std::rc::{Rc, Weak};
use std::cell::RefCell;

struct Nodo {
    valor: i32,
    hijos: RefCell<Vec<Rc<Nodo>>>,
    padre: RefCell<Weak<Nodo>>,
}

impl Nodo {
    fn new(v: i32) -> Rc<Nodo> {
        Rc::new(Nodo { valor: v, hijos: RefCell::new(vec![]), padre: RefCell::new(Weak::new()) })
    }
    fn agregar_hijo(padre: &Rc<Nodo>, hijo: &Rc<Nodo>) {
        padre.hijos.borrow_mut().push(Rc::clone(hijo));
        *hijo.padre.borrow_mut() = Rc::downgrade(padre);
    }
}

impl Drop for Nodo {
    fn drop(&mut self) { println!("🗑️  Liberando nodo {}", self.valor); }
}

fn main() {
    let raiz = Nodo::new(1);
    let hijo_a = Nodo::new(2);
    let hijo_b = Nodo::new(3);

    Nodo::agregar_hijo(&raiz, &hijo_a);
    Nodo::agregar_hijo(&raiz, &hijo_b);

    println!("Raíz strong: {}, weak: {}", Rc::strong_count(&raiz), Rc::weak_count(&raiz));

    if let Some(p) = hijo_a.padre.borrow().upgrade() {
        println!("Padre de hijo_a: {}", p.valor);
    }

    // Weak detecta valores liberados
    let weak: Weak<Nodo>;
    { let tmp = Nodo::new(99); weak = Rc::downgrade(&tmp); }
    println!("Después de drop: upgrade = {:?}", weak.upgrade().map(|n| n.valor));
    println!("\\n--- Fin ---");
}`,
  challenge: "Implementa un árbol doubly-linked (Rc a hijos, Weak al padre) con método para encontrar la raíz desde cualquier nodo."
}

];
window.ALL_LESSONS.push(...chunk);
})();
