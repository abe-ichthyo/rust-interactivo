// ─── LESSONS DATA: Chapters 11-15 ───
(function() {
const chunk = [

// ══════════════════════════════════════════════════════
// CHAPTER 11: Writing Automated Tests
// ══════════════════════════════════════════════════════
{
  id: "11.1",
  chapter: "11. Testing",
  title: "11.1 Writing Tests",
  explanation: `<p>Rust has built-in support for testing. You write a test function with <code>#[test]</code> and use macros like <code>assert!</code>, <code>assert_eq!</code>, and <code>assert_ne!</code> to verify conditions.</p>
<p>Test functions are grouped in a <code>#[cfg(test)]</code> module. You can verify panics with <code>#[should_panic]</code> and customize error messages with additional arguments.</p>`,
  code: `fn add(a: i32, b: i32) -> i32 { a + b }
fn is_adult(age: u32) -> bool { age >= 18 }
fn divide(a: f64, b: f64) -> f64 {
    if b == 0.0 { panic!("Division by zero"); }
    a / b
}

fn main() {
    assert_eq!(add(2, 3), 5);
    println!("✅ add(2, 3) == 5");

    assert_ne!(add(2, 3), 6);
    println!("✅ add(2, 3) != 6");

    assert!(is_adult(20));
    println!("✅ 20 is an adult");

    let r = add(2, 2);
    assert_eq!(r, 4, "Expected 4, got {}", r);
    println!("✅ Custom message works");

    let result = std::panic::catch_unwind(|| divide(10.0, 0.0));
    assert!(result.is_err());
    println!("✅ divide by zero causes panic");

    println!("\\n🎉 All tests passed!");
}`,
  challenge: "Create a Calculator struct with add, subtract, multiply, and divide methods. Write tests that verify each operation, including a test with #[should_panic] for division by zero."
},
{
  id: "11.2",
  chapter: "11. Testing",
  title: "11.2 Running Tests",
  explanation: `<p>With <code>cargo test</code> you run all tests. You can filter by name, show stdout with <code>--nocapture</code>, or run sequentially with <code>--test-threads=1</code>.</p>
<p>Tests can return <code>Result&lt;(), E&gt;</code> to use the <code>?</code> operator. Use <code>#[ignore]</code> for slow tests and run them with <code>cargo test -- --ignored</code>.</p>`,
  code: `fn process(input: &str) -> Result<i32, String> {
    input.parse::<i32>().map_err(|e| format!("Error: {}", e))
}

fn validate_email(email: &str) -> bool {
    email.contains('@') && email.contains('.')
}

fn main() {
    // Test with Result - allows using ?
    let test_result: Result<(), String> = (|| {
        let value = process("42")?;
        assert_eq!(value, 42);
        println!("✅ process(\"42\") = {}", value);
        let error = process("abc");
        assert!(error.is_err());
        println!("✅ \"abc\" produces error");
        Ok(())
    })();
    assert!(test_result.is_ok());

    println!("\\n📋 Test filtering:");
    println!("  cargo test email      → only tests with 'email'");
    println!("  cargo test -- --ignored → only ignored tests");

    let emails = vec![("user@ex.com", true), ("invalid", false), ("a@b.c", true)];
    for (email, expected) in &emails {
        assert_eq!(validate_email(email), *expected);
        println!("✅ validate_email(\"{}\") == {}", email, expected);
    }
}`,
  challenge: "Create a function that converts temperatures between Celsius and Fahrenheit. Write tests that return Result<(), String> and use the ? operator to verify."
},
{
  id: "11.3",
  chapter: "11. Testing",
  title: "11.3 Test Organization",
  explanation: `<p>Rust distinguishes <strong>unit tests</strong> (in <code>#[cfg(test)]</code> modules, can test private functions) and <strong>integration tests</strong> (in <code>tests/</code>, public API only).</p>
<p>To share code between integration tests use <code>tests/common/mod.rs</code>. Each file in <code>tests/</code> is an independent crate.</p>`,
  code: `pub struct Validator {
    min_len: usize,
    requires_num: bool,
}

impl Validator {
    pub fn new(min_len: usize, requires_num: bool) -> Self {
        Validator { min_len, requires_num }
    }

    pub fn validate(&self, input: &str) -> Result<(), Vec<String>> {
        let mut err = Vec::new();
        if input.len() < self.min_len {
            err.push(format!("Minimum {} characters", self.min_len));
        }
        if self.requires_num && !Self::has_number(input) {
            err.push("Requires a number".into());
        }
        if err.is_empty() { Ok(()) } else { Err(err) }
    }

    fn has_number(s: &str) -> bool { s.chars().any(|c| c.is_ascii_digit()) }
}

fn main() {
    // Unit test: private function
    assert!(Validator::has_number("abc123"));
    assert!(!Validator::has_number("abcdef"));
    println!("✅ has_number (private) works");

    let v = Validator::new(8, true);
    assert!(v.validate("secure123").is_ok());
    println!("✅ \"secure123\" is valid");

    let err = v.validate("ab1").unwrap_err();
    assert!(err.iter().any(|e| e.contains("Minimum")));
    println!("✅ \"ab1\" fails on length");

    let err = v.validate("ab").unwrap_err();
    assert_eq!(err.len(), 2);
    println!("✅ \"ab\" has 2 errors");

    println!("\\n📁 Structure:");
    println!("  src/lib.rs          → code + unit tests");
    println!("  tests/validator.rs  → integration tests");
    println!("  tests/common/mod.rs → shared helpers");
}`,
  challenge: "Design an authentication module with public and private functions. Write unit tests for the internal ones and integration tests for the public API."
},

// ══════════════════════════════════════════════════════
// CHAPTER 12: An I/O Project
// ══════════════════════════════════════════════════════
{
  id: "12.1",
  chapter: "12. I/O Project",
  title: "12.1 Accepting Arguments",
  explanation: `<p>Command line arguments are obtained with <code>std::env::args()</code>. The first argument is the program name. It is good practice to create a Config struct that parses the arguments.</p>
<p>This separates parsing logic from main logic and allows validating the number of arguments with clear error messages.</p>`,
  code: `struct Config {
    query: String,
    filename: String,
}

impl Config {
    fn new(args: &[String]) -> Result<Config, &str> {
        if args.len() < 3 {
            return Err("Usage: program <query> <filename>");
        }
        Ok(Config {
            query: args[1].clone(),
            filename: args[2].clone(),
        })
    }
}

fn main() {
    let scenarios = vec![
        vec!["prog".into()],
        vec!["prog".into(), "search".into()],
        vec!["minigrep".into(), "rust".into(), "poem.txt".into()],
    ];

    for (i, args) in scenarios.iter().enumerate() {
        println!("--- Scenario {} ---", i + 1);
        match Config::new(args) {
            Ok(c) => println!("✅ Query: \"{}\", File: \"{}\"", c.query, c.filename),
            Err(e) => println!("❌ {}", e),
        }
    }
}`,
  challenge: "Extend Config to accept optional flags like --ignore-case and --count with robust parsing."
},
{
  id: "12.2",
  chapter: "12. I/O Project",
  title: "12.2 Reading a File",
  explanation: `<p>To read files use <code>std::fs::read_to_string()</code>. File operations return <code>Result</code>, so handle errors with <code>match</code> or <code>?</code>.</p>
<p>For large files, <code>BufReader</code> reads line by line without loading everything into memory using the <code>lines()</code> method.</p>`,
  code: `use std::io::{self, BufRead};

fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    contents.lines().filter(|l| l.contains(query)).collect()
}

fn main() {
    let poem = "Sighs escape\\nfrom my aching heart\\nRust is safe\\nand prevents memory errors.";

    println!("📄 Contents:");
    println!("{}\\n", poem);
    println!("Lines: {}", poem.lines().count());
    println!("Words: {}", poem.split_whitespace().count());

    println!("\\n🔍 Searching for \"from\":");
    for l in search("from", poem) {
        println!("  → {}", l);
    }

    println!("\\n📖 With BufReader:");
    let cursor = io::Cursor::new(poem);
    for (i, line) in cursor.lines().enumerate() {
        if let Ok(l) = line { println!("  L{}: {}", i+1, l); }
    }
}`,
  challenge: "Implement a function that generates statistics for a text: lines, words, characters, most frequent word, and longest line."
},
{
  id: "12.3",
  chapter: "12. I/O Project",
  title: "12.3 Refactoring",
  explanation: `<p>Separate responsibilities: <code>Config::build()</code> for parsing, <code>run()</code> for logic, and <code>main()</code> only for coordinating and handling errors.</p>
<p>It is good practice for the logic to live in <code>lib.rs</code> and the entry point in <code>main.rs</code>, facilitating tests and reuse.</p>`,
  code: `struct Config { query: String, text: String, case_sensitive: bool }

impl Config {
    fn build(args: &[String]) -> Result<Config, String> {
        if args.len() < 3 { return Err("Usage: program <query> <text>".into()); }
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
    let args = vec!["prog".into(), "safe".into(),
        "Rust is safe and fast.\\nPython is dynamic.\\nRust is truly safe.".into()];

    let config = Config::build(&args).unwrap_or_else(|e| {
        eprintln!("Error: {}", e);
        std::process::exit(1);
    });

    println!("🔍 Searching: \"{}\"\\n", config.query);
    let results = run(&config);
    if results.is_empty() { println!("No results."); }
    else { for r in &results { println!("  {}", r); } }
}`,
  challenge: "Refactor a monolithic program by separating parsing, validation, and execution into functions that return Result."
},
{
  id: "12.4",
  chapter: "12. I/O Project",
  title: "12.4 TDD: Test-Driven Development",
  explanation: `<p><strong>TDD</strong> consists of writing tests before the code: 🔴 test fails → 🟢 minimal code → 🔄 refactor. In Rust this cycle is natural thanks to the compiler.</p>
<p>For minigrep we first write the test for <code>search()</code>, verify it fails, and then implement the function.</p>`,
  code: `fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    contents.lines().filter(|l| l.contains(query)).collect()
}

fn search_case_insensitive<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    let q = query.to_lowercase();
    contents.lines().filter(|l| l.to_lowercase().contains(&q)).collect()
}

fn main() {
    let text = "Rust is fast.\\nThree rules of ownership.\\nRUST prevents bugs.\\nSafe rust code.";

    let r = search("Rust", text);
    assert_eq!(r, vec!["Rust is fast."]);
    println!("✅ case-sensitive search");

    let r = search_case_insensitive("rust", text);
    assert_eq!(r.len(), 3);
    println!("✅ case-insensitive search: 3 lines");

    assert!(search("Python", text).is_empty());
    println!("✅ no results returns empty");

    println!("\\n📋 TDD Cycle:");
    println!("  1. 🔴 Write test → fails");
    println!("  2. 🟢 Minimal code → passes");
    println!("  3. 🔄 Refactor → still passes");
}`,
  challenge: "Use TDD to implement search_with_context that returns the found line along with the previous and next lines."
},
{
  id: "12.5",
  chapter: "12. I/O Project",
  title: "12.5 Environment Variables",
  explanation: `<p><code>std::env::var()</code> reads environment variables. For minigrep, <code>IGNORE_CASE</code> controls whether the search is case-sensitive.</p>
<p>Environment variables are ideal for runtime environment configurations (development vs production).</p>`,
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
            Err(_) => println!("{} = (not defined)", var),
        }
    }

    let ignore = env::var("IGNORE_CASE").is_ok();
    let text = "Rust is powerful.\\nrust is safe.\\nRUST prevents bugs.";

    println!("\\n🔍 Case sensitive:");
    for l in search("rust", text, true) { println!("  → {}", l); }

    println!("🔍 Case insensitive:");
    for l in search("rust", text, false) { println!("  → {}", l); }
}`,
  challenge: "Create a configuration system that combines args, environment variables, and default values with priority: args > env > defaults."
},
{
  id: "12.6",
  chapter: "12. I/O Project",
  title: "12.6 Writing to stderr",
  explanation: `<p><code>println!</code> writes to stdout (data), <code>eprintln!</code> writes to stderr (errors). This lets you redirect stdout to a file without losing error messages.</p>
<p>Convention: useful data to stdout, informational messages and errors to stderr. This makes your programs composable with pipes.</p>`,
  code: `fn process(data: &[&str]) -> Result<Vec<String>, String> {
    let mut res = Vec::new();
    for d in data {
        if d.is_empty() { return Err("Empty data".into()); }
        res.push(d.to_uppercase());
    }
    Ok(res)
}

fn main() {
    eprintln!("🔧 Starting...");
    let data = vec!["rust", "is", "great"];

    match process(&data) {
        Ok(r) => {
            for item in &r { println!("{}", item); }
            eprintln!("✅ Processed {} items", r.len());
        }
        Err(e) => { eprintln!("❌ Error: {}", e); std::process::exit(1); }
    }

    eprintln!("\\n💡 Redirection:");
    eprintln!("  $ prog > output.txt    → stdout to file");
    eprintln!("  $ prog 2> errors.txt   → stderr to file");
}`,
  challenge: "Create a program that writes results to stdout and a detailed log to stderr with INFO, WARN, ERROR levels."
},

// ══════════════════════════════════════════════════════
// CHAPTER 13: Functional Language Features
// ══════════════════════════════════════════════════════
{
  id: "13.1",
  chapter: "13. Functional Features",
  title: "13.1 Closures",
  explanation: `<p><strong>Closures</strong> are anonymous functions that capture variables from their environment. They are defined with <code>|params|</code> and capture by reference, mutable reference, or value (<code>move</code>).</p>
<p>They implement the <code>Fn</code>, <code>FnMut</code>, or <code>FnOnce</code> traits depending on how they capture. This lets you pass them as parameters and return them from functions.</p>`,
  code: `fn apply<F: Fn(i32) -> i32>(f: F, v: i32) -> i32 { f(v) }

fn make_adder(n: i32) -> Box<dyn Fn(i32) -> i32> {
    Box::new(move |x| x + n)
}

fn main() {
    let double = |x: i32| x * 2;
    println!("double(5) = {}", double(5));

    let factor = 3;
    let mult = |x| x * factor;
    println!("mult(7) = {}", mult(7));

    let name = String::from("Rust");
    let greet = move || println!("Hello, {}!", name);
    greet();

    println!("apply(|x| x*x, 5) = {}", apply(|x| x * x, 5));

    let add10 = make_adder(10);
    println!("add10(5) = {}", add10(5));

    let mut cnt = 0;
    let mut inc = || { cnt += 1; cnt };
    println!("inc: {}, {}, {}", inc(), inc(), inc());

    let nums = vec![1,2,3,4,5,6,7,8,9,10];
    let evens: Vec<_> = nums.iter().filter(|&&x| x % 2 == 0).collect();
    let squares: Vec<_> = nums.iter().map(|&x| x * x).collect();
    println!("Evens: {:?}", evens);
    println!("Squares: {:?}", squares);
}`,
  challenge: "Implement a memoize function that takes a Fn(i32) -> i32 closure and returns one that caches results with a HashMap."
},
{
  id: "13.2",
  chapter: "13. Functional Features",
  title: "13.2 Iterators",
  explanation: `<p>Iterators are lazy and based on the <code>Iterator</code> trait with <code>next()</code>. Adaptors like <code>map</code>, <code>filter</code>, <code>zip</code> transform without executing; consumers like <code>collect</code>, <code>sum</code>, <code>fold</code> trigger the chain.</p>
<p>You can create custom iterators by implementing the <code>Iterator</code> trait.</p>`,
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
    let sum: i32 = (1..=100).sum();
    println!("Sum 1..100 = {}", sum);

    let r: Vec<i32> = (1..=20).filter(|x| x % 2 == 0).map(|x| x * x).take(5).collect();
    println!("Evens² (5): {:?}", r);

    let fact: u64 = (1..=10).fold(1, |a, x| a * x);
    println!("10! = {}", fact);

    let names = vec!["Ana", "Bob", "Carlos"];
    let ages = vec![25, 30, 35];
    let pairs: Vec<_> = names.iter().zip(ages.iter()).collect();
    println!("Zip: {:?}", pairs);

    let fibs: Vec<u64> = Fibonacci::new().take(10).collect();
    println!("Fibonacci: {:?}", fibs);

    println!("Has even? {}", (1..10).any(|x| x % 2 == 0));
    println!("First > 5: {:?}", (1..10).find(|&x| x > 5));
}`,
  challenge: "Implement a prime number iterator. Find the first 20 primes, their sum, and the first prime greater than 100."
},
{
  id: "13.3",
  chapter: "13. Functional Features",
  title: "13.3 Improving the I/O Project",
  explanation: `<p>With iterators, <code>Config::build()</code> can take ownership of the iterator directly, eliminating clones. The <code>search()</code> function uses <code>filter</code> and <code>collect</code> instead of mutable loops.</p>
<p>The resulting code is more concise, expressive, and less error-prone.</p>`,
  code: `struct Config { query: String, case_sensitive: bool }

impl Config {
    fn build(mut args: impl Iterator<Item = String>) -> Result<Config, &'static str> {
        args.next();
        let query = args.next().ok_or("Missing query")?;
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
    let text = "Programming in Rust is safe.\\nrust has a great ecosystem.\\nThe RUST compiler helps.";
    let args = vec!["prog".into(), "rust".into(), "-i".into()];
    let config = Config::build(args.into_iter()).unwrap();

    println!("🔍 \"{}\" (case_sensitive: {})\\n", config.query, config.case_sensitive);
    search(&config.query, text, config.case_sensitive)
        .iter().enumerate()
        .for_each(|(i, l)| println!("  {}: {}", i+1, l));

    // Imperative vs functional
    let count = text.lines().filter(|l| l.to_lowercase().contains("rust")).count();
    println!("\\nTotal matches: {}", count);
}`,
  challenge: "Rewrite the program using only iterators (no for loops). Add line numbers and match highlighting."
},
{
  id: "13.4",
  chapter: "13. Functional Features",
  title: "13.4 Performance: Loops vs Iterators",
  explanation: `<p>Iterators in Rust are <strong>zero-cost abstractions</strong>: the compiler optimizes them to the same code you would write by hand with loops.</p>
<p>This means you can use the more expressive style without sacrificing performance. Iterators are idiomatic and preferred in Rust.</p>`,
  code: `use std::time::Instant;

fn sum_loop(n: u64) -> u64 {
    let mut t: u64 = 0;
    for i in 0..=n { t += i; }
    t
}
fn sum_iter(n: u64) -> u64 { (0..=n).sum() }
fn sum_formula(n: u64) -> u64 { n * (n + 1) / 2 }

fn main() {
    let n: u64 = 1_000_000;
    assert_eq!(sum_loop(n), sum_iter(n));
    assert_eq!(sum_iter(n), sum_formula(n));
    println!("Sum 0..{} = {}\\n", n, sum_formula(n));

    let methods: Vec<(&str, fn(u64)->u64)> = vec![
        ("Loop for", sum_loop), ("Iterator .sum()", sum_iter), ("Formula O(1)", sum_formula),
    ];

    for (name, f) in &methods {
        let start = Instant::now();
        for _ in 0..100 { std::hint::black_box(f(n)); }
        println!("{:<20} {:>8.2?}", name, start.elapsed());
    }

    println!("\\n💡 In release mode, loop and iterators compile to the same code.");

    let data: Vec<f64> = (0..1000).map(|x| x as f64 * 0.1).collect();
    let (sum, min, max, cnt) = data.iter().fold(
        (0.0f64, f64::MAX, f64::MIN, 0usize),
        |(s, mn, mx, c), &x| (s+x, mn.min(x), mx.max(x), c+1),
    );
    println!("\\n📊 {} elements: sum={:.1}, min={:.1}, max={:.1}, avg={:.2}", cnt, sum, min, max, sum/cnt as f64);
}`,
  challenge: "Compare the performance of finding duplicates: nested loops, sort+dedup, and HashSet."
},

// ══════════════════════════════════════════════════════
// CHAPTER 14: Cargo and Crates.io
// ══════════════════════════════════════════════════════
{
  id: "14.1",
  chapter: "14. Cargo & Crates.io",
  title: "14.1 Release Profiles",
  explanation: `<p>Cargo has <code>dev</code> (opt-level 0, fast compilation) and <code>release</code> (opt-level 3, fast execution) profiles. They are customized in <code>Cargo.toml</code> under <code>[profile.dev]</code> and <code>[profile.release]</code>.</p>
<p>Key options: <code>opt-level</code>, <code>lto</code>, <code>codegen-units</code>, <code>strip</code>. Compile for release with <code>cargo build --release</code>.</p>`,
  code: `fn main() {
    println!("📄 Example Cargo.toml:\\n");
    println!("[profile.dev]");
    println!("opt-level = 0    # No optimization");
    println!("\\n[profile.release]");
    println!("opt-level = 3    # Maximum optimization");
    println!("lto = true       # Link Time Optimization");
    println!("strip = true     # No debug symbols");

    #[cfg(debug_assertions)]
    println!("\\n🔧 Current mode: DEBUG");
    #[cfg(not(debug_assertions))]
    println!("\\n🚀 Current mode: RELEASE");

    println!("\\n┌──────────────┬─────────┬──────────┐");
    println!("│              │ dev     │ release  │");
    println!("├──────────────┼─────────┼──────────┤");
    println!("│ opt-level    │ 0       │ 3        │");
    println!("│ Compilation  │ Fast    │ Slow     │");
    println!("│ Execution    │ Slow    │ Fast     │");
    println!("└──────────────┴─────────┴──────────┘");
}`,
  challenge: "Research how to create a custom 'profiling' profile that inherits from release but keeps debug info."
},
{
  id: "14.2",
  chapter: "14. Cargo & Crates.io",
  title: "14.2 Publishing to Crates.io",
  explanation: `<p>Document with <code>///</code> (doc comments in Markdown), build docs with <code>cargo doc</code>. Examples in docs are run as tests.</p>
<p>Semver: MAJOR (incompatible), MINOR (new functionality), PATCH (bug fixes). Use <code>pub use</code> for a clean public API.</p>`,
  code: `/// Statistics for a dataset.
/// # Example
/// \`\`\`
/// let s = Stats::new(&[1.0, 2.0, 3.0]);
/// assert_eq!(s.count(), 3);
/// \`\`\`
struct Stats { data: Vec<f64> }

impl Stats {
    /// Creates Stats from a slice.
    fn new(data: &[f64]) -> Self { Stats { data: data.to_vec() } }
    fn count(&self) -> usize { self.data.len() }
    fn mean(&self) -> f64 { self.data.iter().sum::<f64>() / self.data.len() as f64 }
    fn min(&self) -> f64 { self.data.iter().cloned().fold(f64::INFINITY, f64::min) }
    fn max(&self) -> f64 { self.data.iter().cloned().fold(f64::NEG_INFINITY, f64::max) }
}

fn main() {
    let s = Stats::new(&[10.0, 20.0, 30.0, 40.0, 50.0]);
    println!("📊 Count: {}, Mean: {:.1}, Min: {:.1}, Max: {:.1}",
        s.count(), s.mean(), s.min(), s.max());

    println!("\\n📦 Publish: cargo login → fill Cargo.toml → cargo publish");
}`,
  challenge: "Design the API of a 'mini-stats' crate with complete documentation and runnable examples."
},
{
  id: "14.3",
  chapter: "14. Cargo & Crates.io",
  title: "14.3 Cargo Workspaces",
  explanation: `<p>A workspace manages multiple crates with a shared <code>target/</code> and <code>Cargo.lock</code>. It is defined with <code>[workspace]</code> in the root Cargo.toml.</p>
<p>Ideal for projects with a binary and several libraries. Use <code>cargo run -p crate</code> to run a specific crate.</p>`,
  code: `fn main() {
    println!("📁 Workspace structure:");
    println!("my-workspace/");
    println!("├── Cargo.toml     # [workspace] members = [...]");
    println!("├── adder/src/main.rs");
    println!("├── add_one/src/lib.rs");
    println!("└── add_two/src/lib.rs\\n");

    fn add_one(x: i32) -> i32 { x + 1 }
    fn add_two(x: i32) -> i32 { x + 2 }

    let n = 10;
    println!("add_one({}) = {}", n, add_one(n));
    println!("add_two({}) = {}", n, add_two(n));

    println!("\\n🛠️ Commands:");
    println!("  cargo build           → entire workspace");
    println!("  cargo run -p adder    → specific crate");
    println!("  cargo test -p add_one → specific tests");
}`,
  challenge: "Design a workspace with 'cli', 'core', and 'utils'. Define the dependencies between them."
},
{
  id: "14.4",
  chapter: "14. Cargo & Crates.io",
  title: "14.4 Cargo Install",
  explanation: `<p><code>cargo install</code> installs binaries from crates.io to <code>~/.cargo/bin/</code>. Only crates with <code>src/main.rs</code> can be installed.</p>
<p>Many modern terminal tools are written in Rust: ripgrep, fd, bat, eza, starship, etc.</p>`,
  code: `fn main() {
    let tools = vec![
        ("ripgrep (rg)", "fast grep"),
        ("fd-find (fd)", "modern find"),
        ("bat", "cat with syntax highlighting"),
        ("eza", "ls with colors and Git"),
        ("tokei", "Count lines of code"),
        ("starship", "Customizable prompt"),
    ];

    println!("🛠️ Popular Rust tools:\\n");
    for (name, desc) in &tools {
        println!("  📦 {} — {}", name, desc);
    }

    println!("\\n💡 cargo install ripgrep");
    println!("   cargo install --list     → list installed");
    println!("   Binaries in ~/.cargo/bin/");
}`,
  challenge: "List 5 Rust tools that could replace tools you use daily."
},
{
  id: "14.5",
  chapter: "14. Cargo & Crates.io",
  title: "14.5 Custom Commands",
  explanation: `<p>Any binary <code>cargo-something</code> in your PATH runs as <code>cargo something</code>. Popular extensions: cargo-edit, cargo-watch, cargo-clippy, cargo-fmt.</p>
<p>You can create your own subcommands by creating a binary with the <code>cargo-</code> prefix.</p>`,
  code: `fn main() {
    let ext = vec![
        ("cargo-edit", "cargo add serde", "Add dependencies"),
        ("cargo-watch", "cargo watch -x test", "Recompile on change"),
        ("cargo-clippy", "cargo clippy", "Advanced linter"),
        ("cargo-fmt", "cargo fmt", "Format code"),
    ];

    println!("🔌 Popular extensions:\\n");
    for (name, cmd, desc) in &ext {
        println!("  {} — {} ({})", name, desc, cmd);
    }

    println!("\\n🛠️ Create your own:");
    println!("  1. cargo new cargo-my-tool");
    println!("  2. Implement logic");
    println!("  3. cargo install --path .");
    println!("  4. Use: cargo my-tool");
}`,
  challenge: "Design a cargo-todo subcommand that searches for TODO and FIXME in the source code."
},

// ══════════════════════════════════════════════════════
// CHAPTER 15: Smart Pointers
// ══════════════════════════════════════════════════════
{
  id: "15.1",
  chapter: "15. Smart Pointers",
  title: "15.1 Box<T>: Data on the Heap",
  explanation: `<p><code>Box&lt;T&gt;</code> stores data on the heap. It is necessary for recursive types (lists, trees) where the compiler needs a known size.</p>
<p>Box implements <code>Deref</code> and <code>Drop</code>: it is used like a reference and frees memory automatically when it goes out of scope.</p>`,
  code: `use std::fmt;

#[derive(Debug)]
enum List {
    Cons(i32, Box<List>),
    Nil,
}

impl List {
    fn new() -> Self { List::Nil }
    fn push(self, v: i32) -> Self { List::Cons(v, Box::new(self)) }
    fn to_vec(&self) -> Vec<i32> {
        let mut r = Vec::new();
        let mut cur = self;
        while let List::Cons(v, next) = cur { r.push(*v); cur = next; }
        r
    }
}

#[derive(Debug)]
enum Tree {
    Leaf(i32),
    Node(Box<Tree>, i32, Box<Tree>),
    Empty,
}

impl Tree {
    fn sum(&self) -> i32 {
        match self {
            Tree::Empty => 0,
            Tree::Leaf(v) => *v,
            Tree::Node(l, v, r) => l.sum() + v + r.sum(),
        }
    }
}

fn main() {
    let b = Box::new(42);
    println!("Box: {}, stack size: {} bytes", b, std::mem::size_of::<Box<i32>>());

    let list = List::new().push(1).push(2).push(3).push(4);
    println!("List: {:?}", list.to_vec());

    let tree = Tree::Node(
        Box::new(Tree::Node(Box::new(Tree::Leaf(1)), 2, Box::new(Tree::Leaf(3)))),
        4,
        Box::new(Tree::Leaf(5)),
    );
    println!("Tree sum: {}", tree.sum());
}`,
  challenge: "Implement a BST with Box: insert, contains, and in-order traversal."
},
{
  id: "15.2",
  chapter: "15. Smart Pointers",
  title: "15.2 Deref: Treating as References",
  explanation: `<p>The <code>Deref</code> trait lets you customize <code>*</code>. <strong>Deref coercion</strong> automatically converts <code>&String</code> → <code>&str</code>, <code>&Box&lt;T&gt;</code> → <code>&T</code>, etc.</p>
<p>There is also <code>DerefMut</code> for mutable dereferencing. This makes code ergonomic at zero cost.</p>`,
  code: `use std::ops::Deref;

struct MyBox<T>(T);

impl<T> MyBox<T> { fn new(x: T) -> Self { MyBox(x) } }

impl<T> Deref for MyBox<T> {
    type Target = T;
    fn deref(&self) -> &T { &self.0 }
}

fn greet(name: &str) { println!("Hello, {}!", name); }

fn main() {
    let x = 5;
    let y = MyBox::new(x);
    assert_eq!(5, *y);
    println!("*MyBox = {}", *y);

    // Deref coercion: MyBox<String> → &String → &str
    let name = MyBox::new(String::from("Rust"));
    greet(&name);

    let boxed = Box::new(String::from("World"));
    greet(&boxed);  // &Box<String> → &String → &str

    let s = String::from("Hello");
    greet(&s);  // &String → &str

    println!("✅ Deref coercion is automatic and ergonomic");
}`,
  challenge: "Create a Sensitive<T> type that implements Deref but hides the value in Debug/Display (showing '***')."
},
{
  id: "15.3",
  chapter: "15. Smart Pointers",
  title: "15.3 Drop: Cleanup Code",
  explanation: `<p>The <code>Drop</code> trait runs code when a value goes out of scope (destructor). Rust calls drop automatically in reverse order. Use <code>std::mem::drop()</code> to free early.</p>
<p>Drop is the foundation of RAII: resources are freed automatically without a garbage collector.</p>`,
  code: `struct Resource { name: String }

impl Resource {
    fn new(n: &str) -> Self {
        println!("📦 Creating: {}", n);
        Resource { name: n.into() }
    }
}

impl Drop for Resource {
    fn drop(&mut self) { println!("🗑️  Freeing: {}", self.name); }
}

fn main() {
    println!("=== Reverse order ===");
    {
        let _a = Resource::new("First");
        let _b = Resource::new("Second");
        let _c = Resource::new("Third");
        println!("--- End of scope ---");
    }

    println!("\\n=== Early drop ===");
    let r = Resource::new("Temporary");
    println!("Using resource...");
    drop(r);
    println!("Already freed, continuing");

    println!("\\n=== RAII ===");
    {
        let _conn = Resource::new("DB Connection");
        println!("Using connection...");
    }
    println!("Connection closed automatically");
}`,
  challenge: "Implement a TempFile that creates a temporary file and deletes it automatically with Drop."
},
{
  id: "15.4",
  chapter: "15. Smart Pointers",
  title: "15.4 Rc<T>: Reference Counting",
  explanation: `<p><code>Rc&lt;T&gt;</code> allows multiple owners. Each <code>Rc::clone()</code> increments a counter; when it reaches zero, the data is freed.</p>
<p>Single-threaded only. For multi-threading use <code>Arc&lt;T&gt;</code> (atomic). Useful for graphs and shared immutable data.</p>`,
  code: `use std::rc::Rc;

#[derive(Debug)]
enum List { Cons(i32, Rc<List>), Nil }

fn main() {
    let a = Rc::new(List::Cons(5, Rc::new(List::Cons(10, Rc::new(List::Nil)))));
    println!("Refs after creating a: {}", Rc::strong_count(&a));

    let _b = List::Cons(3, Rc::clone(&a));
    println!("Refs after b: {}", Rc::strong_count(&a));

    {
        let _c = List::Cons(4, Rc::clone(&a));
        println!("Refs with c: {}", Rc::strong_count(&a));
    }
    println!("Refs without c: {}", Rc::strong_count(&a));

    // Shared config
    let config = Rc::new(("postgres://localhost", 10));
    let s1 = Rc::clone(&config);
    let s2 = Rc::clone(&config);
    println!("\\nConfig: {:?}, refs: {}", s1, Rc::strong_count(&config));
    println!("Same ptr? {}", Rc::ptr_eq(&config, &s2));
}`,
  challenge: "Implement a simple graph with Rc where multiple edges point to the same node."
},
{
  id: "15.5",
  chapter: "15. Smart Pointers",
  title: "15.5 RefCell<T>: Interior Mutability",
  explanation: `<p><code>RefCell&lt;T&gt;</code> checks borrowing at runtime. <code>borrow()</code> gives an immutable reference, <code>borrow_mut()</code> gives a mutable one. Violating the rules causes a panic.</p>
<p><code>Rc&lt;RefCell&lt;T&gt;&gt;</code> is a common pattern: multiple owners with mutability.</p>`,
  code: `use std::cell::RefCell;
use std::rc::Rc;

struct Account {
    holder: String,
    balance: RefCell<f64>,
}

impl Account {
    fn new(h: &str, b: f64) -> Self { Account { holder: h.into(), balance: RefCell::new(b) } }
    fn deposit(&self, amount: f64) { *self.balance.borrow_mut() += amount; }
    fn withdraw(&self, amount: f64) -> Result<(), String> {
        let mut b = self.balance.borrow_mut();
        if *b >= amount { *b -= amount; Ok(()) } else { Err(format!("Insufficient: {:.2}", *b)) }
    }
    fn balance(&self) -> f64 { *self.balance.borrow() }
}

fn main() {
    let account = Account::new("Ana", 1000.0);
    println!("Balance: \${:.2}", account.balance());
    account.deposit(500.0);
    println!("After +500: \${:.2}", account.balance());
    account.withdraw(200.0).unwrap();
    println!("After -200: \${:.2}", account.balance());

    // Rc<RefCell<T>>
    let shared = Rc::new(RefCell::new(vec![1, 2, 3]));
    let r1 = Rc::clone(&shared);
    let r2 = Rc::clone(&shared);
    r1.borrow_mut().push(4);
    r2.borrow_mut().push(5);
    println!("\\nShared: {:?}", shared.borrow());
}`,
  challenge: "Implement an LRU cache with Rc<RefCell<T>> with fixed capacity and eviction."
},
{
  id: "15.6",
  chapter: "15. Smart Pointers",
  title: "15.6 Reference Cycles",
  explanation: `<p>With <code>Rc&lt;RefCell&lt;T&gt;&gt;</code> you can create cycles (A→B→A) causing memory leaks. <code>Weak&lt;T&gt;</code> solves this: it doesn't increment strong_count and <code>upgrade()</code> returns <code>Option</code>.</p>
<p>Pattern: parents hold <code>Rc</code> to children, children hold <code>Weak</code> to parent.</p>`,
  code: `use std::rc::{Rc, Weak};
use std::cell::RefCell;

struct Node {
    value: i32,
    children: RefCell<Vec<Rc<Node>>>,
    parent: RefCell<Weak<Node>>,
}

impl Node {
    fn new(v: i32) -> Rc<Node> {
        Rc::new(Node { value: v, children: RefCell::new(vec![]), parent: RefCell::new(Weak::new()) })
    }
    fn add_child(parent: &Rc<Node>, child: &Rc<Node>) {
        parent.children.borrow_mut().push(Rc::clone(child));
        *child.parent.borrow_mut() = Rc::downgrade(parent);
    }
}

impl Drop for Node {
    fn drop(&mut self) { println!("🗑️  Freeing node {}", self.value); }
}

fn main() {
    let root = Node::new(1);
    let child_a = Node::new(2);
    let child_b = Node::new(3);

    Node::add_child(&root, &child_a);
    Node::add_child(&root, &child_b);

    println!("Root strong: {}, weak: {}", Rc::strong_count(&root), Rc::weak_count(&root));

    if let Some(p) = child_a.parent.borrow().upgrade() {
        println!("Parent of child_a: {}", p.value);
    }

    // Weak detects freed values
    let weak: Weak<Node>;
    { let tmp = Node::new(99); weak = Rc::downgrade(&tmp); }
    println!("After drop: upgrade = {:?}", weak.upgrade().map(|n| n.value));
    println!("\\n--- End ---");
}`,
  challenge: "Implement a doubly-linked tree (Rc to children, Weak to parent) with a method to find the root from any node."
}

];
window.ALL_LESSONS.push(...chunk);
})();
