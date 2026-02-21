// ─── LESSONS DATA: Chapters 6-10 ───
(function() {
const chunk = [

// ══════════════════════════════════════════════════════
// CHAPTER 6: Enums and Pattern Matching
// ══════════════════════════════════════════════════════
{
  id: "6.1",
  chapter: "6. Enums & Pattern Matching",
  title: "6.1 Defining Enums",
  explanation: `<p><strong>Enums</strong> in Rust are much more powerful than in other languages. Each variant can hold data of different types: no data, tuples, or structs with named fields.</p>
<p>The most important enum in Rust is <code>Option&lt;T&gt;</code>, which replaces null values. It has two variants: <code>Some(T)</code> when there is a value, and <code>None</code> when there isn't. This eliminates null pointer errors.</p>
<p>Enums can have methods implemented with <code>impl</code>, just like structs. They are ideal for modeling states, messages, variant data types, and state machines.</p>`,
  code: `// Enum with different data types in each variant
#[derive(Debug)]
enum Message {
    Quit,                         // No data
    Move { x: i32, y: i32 },    // Anonymous struct
    Write(String),                // Tuple with String
    ChangeColor(i32, i32, i32),  // Tuple with 3 values
}

impl Message {
    fn process(&self) {
        match self {
            Message::Quit => println!("Quitting..."),
            Message::Move { x, y } => println!("Moving to ({}, {})", x, y),
            Message::Write(text) => println!("Text: {}", text),
            Message::ChangeColor(r, g, b) => println!("Color: ({}, {}, {})", r, g, b),
        }
    }
}

fn main() {
    let messages = vec![
        Message::Write(String::from("hello")),
        Message::Move { x: 10, y: 20 },
        Message::ChangeColor(255, 0, 128),
        Message::Quit,
    ];

    for msg in &messages {
        msg.process();
    }

    // Option<T> - replaces null
    let some_number: Option<i32> = Some(42);
    let no_number: Option<i32> = None;

    println!("Has value? {}", some_number.is_some());
    println!("Value or default: {}", no_number.unwrap_or(0));

    // Using Option with map
    let result = some_number.map(|n| n * 2);
    println!("Double: {:?}", result);
}`,
  challenge: "Create an enum Shape with variants Circle(f64), Rectangle(f64, f64), and Triangle(f64, f64, f64). Implement an area() method that calculates the area for each variant."
},
{
  id: "6.2",
  chapter: "6. Enums & Pattern Matching",
  title: "6.2 The match Operator",
  explanation: `<p><code>match</code> is one of Rust's most powerful features. It compares a value against a series of patterns and executes the code of the first matching pattern. The compiler verifies that all possible cases are covered.</p>
<p>Patterns can destructure enums, tuples, structs, and references. You can use <code>_</code> as a wildcard pattern to catch "everything else." Guards (<code>if condition</code>) allow additional filtering.</p>
<p>Match is an expression: it returns a value. Each arm must return the same type. It is exhaustive: the compiler forces you to handle all possible variants of an enum.</p>`,
  code: `#[derive(Debug)]
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter(UsState),
}

#[derive(Debug)]
enum UsState {
    Alabama,
    Alaska,
    Arizona,
}

fn value_in_cents(coin: &Coin) -> u32 {
    match coin {
        Coin::Penny => {
            println!("Lucky penny!");
            1
        },
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter(state) => {
            println!("Quarter from {:?}", state);
            25
        },
    }
}

fn main() {
    let coins = vec![
        Coin::Penny,
        Coin::Quarter(UsState::Alaska),
        Coin::Dime,
    ];

    let total: u32 = coins.iter().map(|m| value_in_cents(m)).sum();
    println!("Total: {} cents", total);

    // Match with Option
    let five = Some(5);
    let six = plus_one(five);
    let none = plus_one(None);
    println!("six: {:?}, none: {:?}", six, none);

    // Match with guards and wildcard
    let number = 13;
    let text = match number {
        1 => "one",
        2 | 3 | 5 | 7 | 11 | 13 => "prime",
        n if n % 2 == 0 => "even",
        _ => "other odd",
    };
    println!("{} is {}", number, text);

    // Match with ranges
    let score = 85;
    let grade = match score {
        90..=100 => "A",
        80..=89 => "B",
        70..=79 => "C",
        _ => "F",
    };
    println!("Score {}: {}", score, grade);
}

fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        None => None,
        Some(i) => Some(i + 1),
    }
}`,
  challenge: "Create an enum Operation with variants Add, Subtract, Multiply, Division. Write a calculate function that receives two f64 and an Operation, returning Option<f64> (None for division by zero)."
},
{
  id: "6.3",
  chapter: "6. Enums & Pattern Matching",
  title: "6.3 Concise Control with if let",
  explanation: `<p><code>if let</code> is syntactic sugar for a <code>match</code> that only handles one pattern and ignores the rest. It is more concise when you only care about one specific case.</p>
<p>You can combine it with <code>else</code> to handle the "everything else" case. There is also <code>while let</code> which runs a loop while the pattern matches, useful for iterating over Options.</p>
<p>The choice between <code>match</code> and <code>if let</code> depends on context: use <code>match</code> when you need exhaustiveness, and <code>if let</code> when you only care about one case and want cleaner code.</p>`,
  code: `fn main() {
    // Verbose match for a single case
    let config_max = Some(3u8);
    match config_max {
        Some(max) => println!("Max configured: {}", max),
        _ => (),
    }

    // if let: more concise
    if let Some(max) = config_max {
        println!("Max (with if let): {}", max);
    }

    // if let with else
    let coin = "quarter";
    if let "quarter" = coin {
        println!("Found a quarter!");
    } else {
        println!("Not a quarter");
    }

    // while let: iterate while there's a match
    let mut stack = vec![1, 2, 3, 4, 5];
    while let Some(top) = stack.pop() {
        println!("Popping: {}", top);
    }

    // if let with enums
    #[derive(Debug)]
    enum Result {
        Ok(String),
        Error(String),
        Pending,
    }

    let results = vec![
        Result::Ok(String::from("data")),
        Result::Error(String::from("timeout")),
        Result::Pending,
        Result::Ok(String::from("more data")),
    ];

    let mut successes = 0;
    for r in &results {
        if let Result::Ok(data) = r {
            println!("Success: {}", data);
            successes += 1;
        }
    }
    println!("Total successes: {}", successes);

    // Combining if let with other conditions
    let age: Option<u32> = Some(25);
    if let Some(a) = age {
        if a >= 18 {
            println!("Adult: {} years old", a);
        }
    }
}`,
  challenge: "Create a program that processes a vector of Option<String> representing messages. Use if let to print only the messages that exist, and while let to process a task queue."
},

// ══════════════════════════════════════════════════════
// CHAPTER 7: Packages, Crates, and Modules
// ══════════════════════════════════════════════════════
{
  id: "7.1",
  chapter: "7. Packages & Modules",
  title: "7.1 Packages and Crates",
  explanation: `<p>A <strong>crate</strong> is the smallest unit of compilation in Rust. It can be a <em>binary crate</em> (executable with main) or a <em>library crate</em> (reusable code). A <strong>package</strong> is a set of crates defined by Cargo.toml.</p>
<p>A package can contain multiple binary crates (in src/bin/) but only one library crate (src/lib.rs). The file src/main.rs is the binary crate root, and src/lib.rs is the library crate root.</p>
<p>The <strong>crate root</strong> is the file where the compiler starts. Modules and the entire code tree are built from this entry point.</p>`,
  code: `// Simulation of a package structure
// my_project/
// ├── Cargo.toml
// ├── src/
// │   ├── main.rs      (binary crate root)
// │   ├── lib.rs        (library crate root)
// │   └── bin/
// │       ├── server.rs (another binary crate)
// │       └── client.rs (another binary crate)

// In a real project, Cargo.toml defines the package:
// [package]
// name = "my_project"
// version = "0.1.0"
// edition = "2021"

fn main() {
    println!("=== Packages and Crates in Rust ===");

    let concepts = vec![
        ("Crate", "Smallest unit of compilation"),
        ("Binary crate", "Generates an executable (has main)"),
        ("Library crate", "Reusable code (no main)"),
        ("Package", "Set of crates (Cargo.toml)"),
        ("Crate root", "Root compilation file"),
    ];

    for (concept, desc) in &concepts {
        println!("• {}: {}", concept, desc);
    }

    println!("\\nPackage rules:");
    println!("  - 0 or 1 library crate");
    println!("  - 0 or more binary crates");
    println!("  - At least 1 crate (library or binary)");
}`,
  challenge: "Describe the directory structure of a package that has a library crate and two binary crates. Print the file tree as formatted text."
},
{
  id: "7.2",
  chapter: "7. Packages & Modules",
  title: "7.2 Defining Modules",
  explanation: `<p><strong>Modules</strong> organize code within a crate into logical groups with visibility control. They are defined with <code>mod</code> and can be nested. Everything is private by default.</p>
<p>The module tree starts at the crate root. Modules can be defined inline (within the file) or in separate files. The compiler looks for modules at specific paths.</p>
<p>Visibility is controlled with <code>pub</code>: a public module allows access from outside, but its contents remain private unless they are also <code>pub</code>.</p>`,
  code: `// Define inline modules
mod restaurant {
    pub mod front_of_house {
        pub fn add_to_waitlist() {
            println!("Added to waitlist");
        }

        pub fn seat_at_table() {
            println!("Seated at table");
        }
    }

    mod kitchen {
        fn prepare_order() {
            println!("Preparing order...");
        }

        pub fn serve_order() {
            prepare_order(); // Can access private items in the same module
            println!("Order served!");
            super::front_of_house::add_to_waitlist(); // super = parent module
        }
    }

    pub fn operate() {
        front_of_house::add_to_waitlist();
        kitchen::serve_order(); // OK: kitchen is a child of restaurant
    }
}

mod utilities {
    pub mod math {
        pub fn factorial(n: u64) -> u64 {
            if n <= 1 { 1 } else { n * factorial(n - 1) }
        }
    }

    pub mod text {
        pub fn capitalize(s: &str) -> String {
            let mut chars = s.chars();
            match chars.next() {
                None => String::new(),
                Some(c) => c.to_uppercase().to_string() + chars.as_str(),
            }
        }
    }
}

fn main() {
    // Absolute path from crate root
    restaurant::front_of_house::add_to_waitlist();

    // Using the module
    restaurant::operate();

    // Utility modules
    println!("5! = {}", utilities::math::factorial(5));
    println!("{}", utilities::text::capitalize("hello world"));
}`,
  challenge: "Create a 'store' module with submodules 'inventory' and 'sales'. Inventory should have functions to add and list products. Sales should be able to query the inventory."
},
{
  id: "7.3",
  chapter: "7. Packages & Modules",
  title: "7.3 Paths for Referring to Items",
  explanation: `<p>To access an item in the module tree, you use a <strong>path</strong>. Paths can be absolute (from the crate root with <code>crate::</code>) or relative (from the current module).</p>
<p><code>super</code> lets you go to the parent module, similar to <code>..</code> in the file system. It is useful when you know the relationship between modules will be maintained even if you move them.</p>
<p>You can make struct fields public individually. In enums, if the enum is public, all its variants are automatically public.</p>`,
  code: `mod garden {
    pub mod vegetables {
        #[derive(Debug)]
        pub struct Plant {
            pub name: String,
            pub height_cm: f64,
            location: String, // private
        }

        impl Plant {
            pub fn new(name: &str, location: &str) -> Plant {
                Plant {
                    name: String::from(name),
                    height_cm: 0.0,
                    location: String::from(location),
                }
            }

            pub fn grow(&mut self, cm: f64) {
                self.height_cm += cm;
                println!("{} grew to {} cm", self.name, self.height_cm);
            }
        }

        // Public enum = public variants
        #[derive(Debug)]
        pub enum Season {
            Spring,
            Summer,
            Autumn,
            Winter,
        }

        pub fn plant(season: &Season) {
            match season {
                Season::Spring => println!("Perfect time to plant!"),
                Season::Summer => println!("It will need more water"),
                _ => println!("Better wait until spring"),
            }
        }
    }

    pub mod tools {
        pub fn water() {
            println!("Watering the garden...");
            // super accesses the parent module (garden)
            super::vegetables::plant(&super::vegetables::Season::Summer);
        }
    }
}

fn main() {
    // Absolute path
    let mut tomato = garden::vegetables::Plant::new("Tomato", "greenhouse");
    tomato.grow(5.0);
    tomato.grow(3.0);
    println!("Plant: {:?}", tomato);
    // println!("{}", tomato.location); // Error! Private field

    // Public enum
    let season = garden::vegetables::Season::Spring;
    garden::vegetables::plant(&season);

    // Using super (internally in tools)
    garden::tools::water();
}`,
  challenge: "Create a 'bank' module with a BankAccount struct where the balance is private. Implement public methods to deposit, withdraw, and check balance."
},
{
  id: "7.4",
  chapter: "7. Packages & Modules",
  title: "7.4 Bringing Paths into Scope with use",
  explanation: `<p>The <code>use</code> keyword creates shortcuts for long paths, similar to import in other languages. The convention is to import parent modules for functions and the type directly for structs and enums.</p>
<p>You can rename imports with <code>as</code> to avoid name conflicts. You can also re-export with <code>pub use</code>, exposing internal items as part of your public API.</p>
<p>To import multiple items from the same module, use curly braces: <code>use std::io::{self, Write}</code>. The glob operator <code>*</code> imports everything, but it is recommended to avoid it except in tests.</p>`,
  code: `// Import with use
use std::collections::HashMap;
use std::fmt;

// Rename with as
use std::io::Result as IoResult;

// Import multiple items
// use std::io::{self, Write, BufRead};

mod shapes {
    #[derive(Debug)]
    pub struct Circle {
        pub radius: f64,
    }

    #[derive(Debug)]
    pub struct Square {
        pub side: f64,
    }

    pub mod calculations {
        use super::{Circle, Square};
        use std::f64::consts::PI;

        pub fn circle_area(c: &Circle) -> f64 {
            PI * c.radius * c.radius
        }

        pub fn square_area(s: &Square) -> f64 {
            s.side * s.side
        }
    }

    // Re-export for a cleaner API
    pub use calculations::circle_area;
    pub use calculations::square_area;
}

// Use the re-exports
use shapes::{Circle, Square, circle_area, square_area};

fn main() {
    let c = Circle { radius: 5.0 };
    let s = Square { side: 4.0 };

    // Thanks to pub use, we access directly
    println!("Circle area: {:.2}", circle_area(&c));
    println!("Square area: {:.2}", square_area(&s));

    // HashMap imported with use
    let mut scores: HashMap<&str, i32> = HashMap::new();
    scores.insert("Alice", 100);
    scores.insert("Bob", 85);

    for (name, points) in &scores {
        println!("{}: {} points", name, points);
    }
}`,
  challenge: "Organize a 'geometry' module with sub-modules 2d and 3d. Use pub use to re-export the most common functions to the geometry module level."
},
{
  id: "7.5",
  chapter: "7. Packages & Modules",
  title: "7.5 Separating Modules into Files",
  explanation: `<p>In large projects, modules are separated into files and directories. You declare the module with <code>mod name;</code> (without a body) and Rust looks for the code in <code>name.rs</code> or <code>name/mod.rs</code>.</p>
<p>The file structure mirrors the module structure: <code>mod sales;</code> looks for <code>sales.rs</code> or <code>sales/mod.rs</code>. Submodules of sales would go in <code>sales/sub.rs</code>.</p>
<p>The 2021 edition prefers <code>name.rs</code> + <code>name/sub.rs</code> over the old style <code>name/mod.rs</code>. Both work, but the new style avoids having many files called mod.rs.</p>`,
  code: `// File structure of a real project:
// src/
// ├── main.rs          (crate root)
// ├── lib.rs           (library crate root, optional)
// ├── config.rs        (mod config)
// ├── models/
// │   ├── mod.rs       (mod models - old style)
// │   ├── user.rs      (mod models::user)
// │   └── product.rs   (mod models::product)
// ├── services.rs      (mod services)
// └── services/
//     ├── auth.rs      (mod services::auth)
//     └── db.rs        (mod services::db)

// We simulate the structure with inline modules
mod config {
    pub const VERSION: &str = "1.0.0";
    pub const APP_NAME: &str = "MyApp";
}

mod models {
    pub mod user {
        #[derive(Debug)]
        pub struct User {
            pub id: u32,
            pub name: String,
        }
    }

    pub mod product {
        #[derive(Debug)]
        pub struct Product {
            pub id: u32,
            pub name: String,
            pub price: f64,
        }
    }
}

mod services {
    use super::models::user::User;

    pub fn create_user(id: u32, name: &str) -> User {
        User {
            id,
            name: String::from(name),
        }
    }

    pub fn list_info() {
        println!("Service active v{}", super::config::VERSION);
    }
}

use models::product::Product;
use services::create_user;

fn main() {
    println!("{} v{}", config::APP_NAME, config::VERSION);

    let user = create_user(1, "Alice");
    println!("User: {:?}", user);

    let product = Product {
        id: 1,
        name: String::from("Laptop"),
        price: 999.99,
    };
    println!("Product: {:?}", product);

    services::list_info();
}`,
  challenge: "Design the module structure for a web application with: models (User, Post, Comment), routes (api, web), and services (auth, database). Print it as a file tree."
},

// ══════════════════════════════════════════════════════
// CHAPTER 8: Common Collections
// ══════════════════════════════════════════════════════
{
  id: "8.1",
  chapter: "8. Collections",
  title: "8.1 Vectors",
  explanation: `<p><strong>Vectors</strong> (<code>Vec&lt;T&gt;</code>) are dynamic arrays that store elements of the same type on the heap. They are created with <code>Vec::new()</code> or the <code>vec![]</code> macro.</p>
<p>You can access elements by index (can cause panic) or with <code>get()</code> which returns <code>Option</code>. To add elements use <code>push()</code>, and to iterate use <code>for item in &vec</code>.</p>
<p>A trick for storing different types is to use an enum as the vector's type. Borrowing rules apply: you cannot have an immutable reference and modify the vector at the same time.</p>`,
  code: `fn main() {
    // Create vectors
    let mut v1: Vec<i32> = Vec::new();
    v1.push(1);
    v1.push(2);
    v1.push(3);

    let v2 = vec![10, 20, 30, 40, 50];

    // Access by index (can panic)
    let third = &v2[2];
    println!("Third: {}", third);

    // Safe access with get
    match v2.get(100) {
        Some(value) => println!("Value: {}", value),
        None => println!("That index doesn't exist"),
    }

    // Iterate
    for n in &v2 {
        print!("{} ", n);
    }
    println!();

    // Iterate and modify
    let mut v3 = vec![100, 200, 300];
    for n in &mut v3 {
        *n += 50;
    }
    println!("Modified: {:?}", v3);

    // Enum for mixed types in a vector
    #[derive(Debug)]
    enum Cell {
        Int(i32),
        Float(f64),
        Text(String),
    }

    let row = vec![
        Cell::Int(42),
        Cell::Float(3.14),
        Cell::Text(String::from("hello")),
    ];

    for cell in &row {
        match cell {
            Cell::Int(n) => println!("Int: {}", n),
            Cell::Float(f) => println!("Float: {}", f),
            Cell::Text(s) => println!("Str: {}", s),
        }
    }

    // Useful methods
    let nums = vec![5, 2, 8, 1, 9, 3];
    println!("Len: {}, Empty: {}", nums.len(), nums.is_empty());
    println!("Contains 8: {}", nums.contains(&8));
}`,
  challenge: "Create a program that simulates a shopping list using a Vec. Implement functions to add, remove, search, and display items."
},
{
  id: "8.2",
  chapter: "8. Collections",
  title: "8.2 Strings",
  explanation: `<p>In Rust there are two main string types: <code>String</code> (owned, mutable, on the heap) and <code>&str</code> (slice, immutable reference). Strings in Rust are always valid UTF-8.</p>
<p>Concatenating strings can be done with <code>push_str()</code>, <code>push()</code>, the <code>+</code> operator, or the <code>format!()</code> macro. The + operator takes ownership of the first string.</p>
<p>Directly indexing strings is not possible because UTF-8 characters can be multi-byte. Use <code>chars()</code> to iterate by characters or <code>bytes()</code> for individual bytes.</p>`,
  code: `fn main() {
    // Create strings
    let mut s1 = String::new();
    let s2 = "hello".to_string();
    let s3 = String::from("world");

    // Append content
    s1.push_str("Hello ");
    s1.push_str(&s2);
    s1.push('!');
    println!("{}", s1);

    // Concatenate with +
    let greeting = s2 + " " + &s3; // s2 is moved, s3 is borrowed
    println!("{}", greeting);

    // format! (doesn't take ownership)
    let s4 = String::from("Rust");
    let s5 = String::from("great");
    let sentence = format!("{} is {}", s4, s5);
    println!("{}", sentence);
    println!("Originals: {} {}", s4, s5); // Still valid

    // You CANNOT index directly
    let hello = String::from("Здравствуйте"); // Russian
    // let h = hello[0]; // Error!

    // Iterate by characters
    for c in hello.chars() {
        print!("{} ", c);
    }
    println!();

    // Slices (be careful with character boundaries)
    let hello = String::from("Здравствуйте");
    let s = &hello[0..4]; // First 2 Cyrillic characters (2 bytes each)
    println!("Slice: {}", s);

    // Useful methods
    let text = String::from("  Hello World  ");
    println!("Trim: '{}'", text.trim());
    println!("Upper: {}", text.to_uppercase());
    println!("Replace: {}", text.replace("World", "Rust"));
    println!("Contains: {}", text.contains("World"));

    // Split
    let csv = "one,two,three,four";
    let parts: Vec<&str> = csv.split(',').collect();
    println!("Parts: {:?}", parts);
}`,
  challenge: "Write a function that receives a &str and returns a String with each word capitalized (first letter uppercase). Handle strings with multiple spaces correctly."
},
{
  id: "8.3",
  chapter: "8. Collections",
  title: "8.3 HashMaps",
  explanation: `<p><strong>HashMaps</strong> store key-value pairs with O(1) lookup. They are imported with <code>use std::collections::HashMap</code>. Keys must implement <code>Eq</code> and <code>Hash</code>.</p>
<p>The <code>entry()</code> method is very useful: it lets you check if a key exists and insert a default value if it doesn't, with <code>or_insert()</code>. This avoids duplicate lookups.</p>
<p>For types that implement <code>Copy</code> (like i32), values are copied into the HashMap. For owned types like String, the HashMap takes ownership of the inserted values.</p>`,
  code: `use std::collections::HashMap;

fn main() {
    // Create and populate
    let mut scores = HashMap::new();
    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Red"), 50);

    // Access
    let team = String::from("Blue");
    let score = scores.get(&team).copied().unwrap_or(0);
    println!("{}: {}", team, score);

    // Iterate
    for (key, value) in &scores {
        println!("{}: {}", key, value);
    }

    // Overwrite
    scores.insert(String::from("Blue"), 25);
    println!("Blue updated: {:?}", scores);

    // entry: insert only if it doesn't exist
    scores.entry(String::from("Green")).or_insert(30);
    scores.entry(String::from("Blue")).or_insert(999); // Doesn't change
    println!("With entry: {:?}", scores);

    // Count words with entry
    let text = "hello world hello rust world hello";
    let mut word_count = HashMap::new();
    for word in text.split_whitespace() {
        let count = word_count.entry(word).or_insert(0);
        *count += 1;
    }
    println!("Word count: {:?}", word_count);

    // Create from iterator of tuples
    let teams = vec!["Moon", "Sun", "Star"];
    let initial_scores = vec![0, 0, 0];
    let table: HashMap<_, _> = teams.into_iter()
        .zip(initial_scores.into_iter())
        .collect();
    println!("Table: {:?}", table);
}`,
  challenge: "Create a program that reads a list of students with their grades and calculates: the average per student, the highest grade overall, and how many students passed (>=70)."
},

// ══════════════════════════════════════════════════════
// CHAPTER 9: Error Handling
// ══════════════════════════════════════════════════════
{
  id: "9.1",
  chapter: "9. Error Handling",
  title: "9.1 Unrecoverable Errors with panic!",
  explanation: `<p>Rust has two categories of errors: unrecoverable (<code>panic!</code>) and recoverable (<code>Result</code>). A <code>panic!</code> stops execution, prints an error message, and unwinds the stack.</p>
<p>Panics happen explicitly with the <code>panic!()</code> macro or implicitly when you access an out-of-bounds index, for example. The <code>RUST_BACKTRACE=1</code> environment variable shows the full backtrace.</p>
<p>In production, panics can be configured to abort (terminate without cleanup) in Cargo.toml, which reduces binary size. Panics are for bugs, not for expected errors.</p>`,
  code: `fn main() {
    println!("=== Error Handling: panic! ===");

    // Controlled example of situations that cause panic
    let v = vec![1, 2, 3];

    // This would cause panic: v[99]
    // Instead, we use get() which is safe
    match v.get(99) {
        Some(val) => println!("Value: {}", val),
        None => println!("Index 99 doesn't exist (we avoided panic)"),
    }

    // Functions that can fail
    let result = safe_divide(10.0, 3.0);
    println!("10 / 3 = {:.2}", result);

    // let _boom = safe_divide(10.0, 0.0); // This would panic!

    // unwrap() and expect() cause panic if None/Err
    let numbers = vec![1, 2, 3];
    // let _val = numbers.get(10).unwrap(); // Panic!
    // let _val = numbers.get(10).expect("Index out of bounds"); // Panic with message

    // Safe way
    let val = numbers.get(1).unwrap_or(&0);
    println!("Safe value: {}", val);

    // Demonstrate when to use panic
    println!("\\nWhen to use panic!?");
    let cases = [
        ("Bugs in the code", "Yes - the program is wrong"),
        ("Invalid user input", "No - use Result"),
        ("File not found", "No - use Result"),
        ("Impossible state", "Yes - something went very wrong"),
        ("Quick prototyping", "Yes - temporary unwrap()"),
    ];

    for (case, use_panic) in &cases {
        println!("  {} -> panic: {}", case, use_panic);
    }
}

fn safe_divide(a: f64, b: f64) -> f64 {
    if b == 0.0 {
        panic!("Division by zero!");
    }
    a / b
}`,
  challenge: "Write a program that demonstrates 3 situations that would cause panic and show how to handle each one safely without panic."
},
{
  id: "9.2",
  chapter: "9. Error Handling",
  title: "9.2 Recoverable Errors with Result",
  explanation: `<p><code>Result&lt;T, E&gt;</code> is an enum with two variants: <code>Ok(T)</code> for success and <code>Err(E)</code> for error. It is the main error handling mechanism in Rust, used by operations that can fail.</p>
<p>The <code>?</code> operator is syntactic sugar that propagates errors automatically: if the Result is Err, it returns the error; if it is Ok, it extracts the value. It can only be used in functions that return Result or Option.</p>
<p>You can chain operations with <code>and_then()</code>, <code>map()</code>, <code>map_err()</code>, and other combinators. For custom errors, you can create your own error types.</p>`,
  code: `use std::num::ParseIntError;
use std::fmt;

// Custom error
#[derive(Debug)]
enum AppError {
    ParseError(ParseIntError),
    ValidationError(String),
    NotFound(String),
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            AppError::ParseError(e) => write!(f, "Parse error: {}", e),
            AppError::ValidationError(msg) => write!(f, "Validation: {}", msg),
            AppError::NotFound(item) => write!(f, "Not found: {}", item),
        }
    }
}

impl From<ParseIntError> for AppError {
    fn from(e: ParseIntError) -> Self {
        AppError::ParseError(e)
    }
}

fn parse_age(input: &str) -> Result<u32, AppError> {
    let age: u32 = input.parse()?; // ? converts ParseIntError to AppError
    if age > 150 {
        Err(AppError::ValidationError(
            format!("Age {} is not realistic", age)
        ))
    } else {
        Ok(age)
    }
}

fn find_user(id: u32) -> Result<String, AppError> {
    match id {
        1 => Ok(String::from("Alice")),
        2 => Ok(String::from("Bob")),
        _ => Err(AppError::NotFound(format!("User {}", id))),
    }
}

fn main() {
    // Handle Result with match
    let inputs = vec!["25", "abc", "200", "30"];
    for input in inputs {
        match parse_age(input) {
            Ok(age) => println!("'{}' -> age: {}", input, age),
            Err(e) => println!("'{}' -> error: {}", input, e),
        }
    }

    // Chain with and_then
    let result = parse_age("1")
        .and_then(|id| find_user(id));
    println!("\\nLookup: {:?}", result);

    // unwrap_or_else for default values
    let name = find_user(99)
        .unwrap_or_else(|_| String::from("Anonymous"));
    println!("Name: {}", name);

    // map to transform Ok
    let double = parse_age("21").map(|a| a * 2);
    println!("Double age: {:?}", double);
}`,
  challenge: "Create a function that parses a configuration string 'key=value' and returns Result<(String, String), ConfigError>. Handle errors like invalid format, empty key, etc."
},
{
  id: "9.3",
  chapter: "9. Error Handling",
  title: "9.3 panic! or Result?",
  explanation: `<p>The decision between <code>panic!</code> and <code>Result</code> depends on context. Use <code>panic!</code> for errors that indicate bugs (impossible states, contract violations). Use <code>Result</code> for expected, recoverable errors.</p>
<p>In prototypes and tests, <code>unwrap()</code> and <code>expect()</code> are acceptable. In production code, always handle errors explicitly. The <code>main</code> function can return <code>Result</code>.</p>
<p><strong>Newtype</strong> patterns for validation are powerful: you create a type that can only be constructed with valid values, moving validation to the constructor and guaranteeing correctness throughout the program.</p>`,
  code: `// Type with validation in the constructor
#[derive(Debug)]
struct Percentage(f64);

impl Percentage {
    fn new(value: f64) -> Result<Self, String> {
        if value < 0.0 || value > 100.0 {
            Err(format!("{} is not a valid percentage (0-100)", value))
        } else {
            Ok(Percentage(value))
        }
    }

    fn value(&self) -> f64 {
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
            Err(format!("'{}' is not a valid email", email))
        }
    }
}

// main can return Result
fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Validated types
    let grade = Percentage::new(85.0)?;
    println!("Grade: {}%", grade.value());

    // This would fail:
    match Percentage::new(150.0) {
        Ok(p) => println!("Percentage: {:?}", p),
        Err(e) => println!("Error: {}", e),
    }

    let email = Email::new("user@example.com")?;
    println!("Email: {:?}", email);

    match Email::new("invalid") {
        Ok(e) => println!("Email: {:?}", e),
        Err(e) => println!("Error: {}", e),
    }

    // Decision guide
    println!("\\n=== panic! or Result? ===");
    let guide = [
        ("Example/prototype", "unwrap()/expect() OK"),
        ("Test", "unwrap() - we want it to fail fast"),
        ("Library", "Result always - let the user decide"),
        ("User input", "Result - the user can correct it"),
        ("Programmer bug", "panic! - this shouldn't happen"),
        ("Corrupted state", "panic! - cannot continue"),
    ];

    for (case, recommendation) in &guide {
        println!("  {}: {}", case, recommendation);
    }

    Ok(())
}`,
  challenge: "Create a Username type that only accepts 3-20 alphanumeric character strings. Create a Password type that requires at least 8 characters with at least one number. Use Result for validation."
},

// ══════════════════════════════════════════════════════
// CHAPTER 10: Generic Types, Traits, and Lifetimes
// ══════════════════════════════════════════════════════
{
  id: "10.1",
  chapter: "10. Generics, Traits & Lifetimes",
  title: "10.1 Generic Types",
  explanation: `<p><strong>Generics</strong> let you write code that works with multiple types. They are declared with <code>&lt;T&gt;</code> in functions, structs, and enums. At compile time, Rust generates specific code for each type used (monomorphization).</p>
<p>You can have multiple generic parameters: <code>&lt;T, U&gt;</code>. Generics have no runtime performance cost thanks to monomorphization: the compiler generates specialized versions.</p>
<p>Generics are the foundation of Rust's type system. Vec&lt;T&gt;, Option&lt;T&gt;, Result&lt;T, E&gt; are all generic types you have already used.</p>`,
  code: `// Generic function
fn largest<T: PartialOrd>(list: &[T]) -> &T {
    let mut largest = &list[0];
    for item in &list[1..] {
        if item > largest {
            largest = item;
        }
    }
    largest
}

// Generic struct
#[derive(Debug)]
struct Point<T> {
    x: T,
    y: T,
}

// Struct with multiple generic types
#[derive(Debug)]
struct Pair<T, U> {
    first: T,
    second: U,
}

// Generic implementation
impl<T: std::fmt::Display> Point<T> {
    fn display(&self) {
        println!("({}, {})", self.x, self.y);
    }
}

// Implementation only for a specific type
impl Point<f64> {
    fn distance_from_origin(&self) -> f64 {
        (self.x.powi(2) + self.y.powi(2)).sqrt()
    }
}

// Method with mixed generic types
impl<T, U> Pair<T, U> {
    fn mixup<V, W>(self, other: Pair<V, W>) -> Pair<T, W> {
        Pair {
            first: self.first,
            second: other.second,
        }
    }
}

fn main() {
    // Generic function with different types
    let numbers = vec![34, 50, 25, 100, 65];
    println!("Largest number: {}", largest(&numbers));

    let chars = vec!['y', 'm', 'a', 'q'];
    println!("Largest char: {}", largest(&chars));

    // Generic structs
    let integer = Point { x: 5, y: 10 };
    let float = Point { x: 1.5, y: 4.2 };
    println!("Points: {:?} and {:?}", integer, float);

    float.display();
    println!("Distance from origin: {:.2}", float.distance_from_origin());

    // Pair with mixed types
    let p1 = Pair { first: 5, second: "hello" };
    let p2 = Pair { first: 'x', second: 3.14 };
    let p3 = p1.mixup(p2);
    println!("Mixed: {:?}", p3); // Pair { first: 5, second: 3.14 }
}`,
  challenge: "Create a generic Stack<T> struct with push, pop (returns Option<T>), peek (returns Option<&T>), and is_empty methods. Use it with different types."
},
{
  id: "10.2",
  chapter: "10. Generics, Traits & Lifetimes",
  title: "10.2 Traits: Defining Shared Behavior",
  explanation: `<p><strong>Traits</strong> define shared behavior, similar to interfaces in other languages. They are declared with <code>trait</code> and can have methods with or without default implementations.</p>
<p>You implement a trait for a type with <code>impl Trait for Type</code>. <strong>Trait bounds</strong> (<code>T: Trait</code>) restrict generics to types that implement a certain trait. The <code>impl Trait</code> syntax is sugar for simple trait bounds.</p>
<p>You can combine traits with <code>+</code>: <code>T: Display + Clone</code>. <code>where</code> clauses make the syntax more readable with multiple bounds. Traits can have associated types and constants.</p>`,
  code: `use std::fmt;

// Define a trait
trait Summary {
    fn summarize_author(&self) -> String;

    // Method with default implementation
    fn summarize(&self) -> String {
        format!("(Read more from {}...)", self.summarize_author())
    }
}

#[derive(Debug)]
struct Article {
    title: String,
    author: String,
    content: String,
}

#[derive(Debug)]
struct Tweet {
    username: String,
    content: String,
    reply: bool,
}

impl Summary for Article {
    fn summarize_author(&self) -> String {
        self.author.clone()
    }

    fn summarize(&self) -> String {
        format!("{}, by {} - {}...", self.title, self.author, &self.content[..20.min(self.content.len())])
    }
}

impl Summary for Tweet {
    fn summarize_author(&self) -> String {
        format!("@{}", self.username)
    }
    // Uses the default summarize()
}

// Trait bound as parameter
fn notify(item: &impl Summary) {
    println!("New! {}", item.summarize());
}

// Full syntax with where
fn compare_summaries<T, U>(a: &T, b: &U) -> String
where
    T: Summary + fmt::Debug,
    U: Summary + fmt::Debug,
{
    format!("{} vs {}", a.summarize(), b.summarize())
}

// Return impl Trait
fn create_tweet() -> impl Summary {
    Tweet {
        username: String::from("rustlang"),
        content: String::from("Rust 2024 is here"),
        reply: false,
    }
}

fn main() {
    let article = Article {
        title: String::from("Rust in Production"),
        author: String::from("Alice"),
        content: String::from("Rust is increasingly used in production systems..."),
    };

    let tweet = Tweet {
        username: String::from("bob"),
        content: String::from("Learning Rust!"),
        reply: false,
    };

    notify(&article);
    notify(&tweet);

    println!("{}", compare_summaries(&article, &tweet));

    let new_tweet = create_tweet();
    println!("New: {}", new_tweet.summarize());
}`,
  challenge: "Create an Area trait with an area() -> f64 method and implement it for Circle, Rectangle, and Triangle. Write a function that receives a slice of &dyn Area and returns the total area."
},
{
  id: "10.3",
  chapter: "10. Generics, Traits & Lifetimes",
  title: "10.3 Validating References with Lifetimes",
  explanation: `<p><strong>Lifetimes</strong> are annotations that tell the compiler how long references live. Their purpose is to prevent <em>dangling references</em> (references to freed data).</p>
<p>The syntax uses an apostrophe: <code>'a</code>. When a function returns a reference, the lifetime indicates the result lives at least as long as the annotated inputs. The compiler infers lifetimes in many cases (elision rules).</p>
<p>The <code>'static</code> lifetime indicates the reference lives for the entire duration of the program. String literals have a <code>'static</code> lifetime. Structs that contain references need lifetime annotations.</p>`,
  code: `// Function with lifetimes: the result lives as long as the shorter input
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

// Struct with reference needs lifetime
#[derive(Debug)]
struct Excerpt<'a> {
    text: &'a str,
    author: &'a str,
}

impl<'a> Excerpt<'a> {
    // The lifetime of &self is inferred (elision rule)
    fn level(&self) -> &str {
        if self.text.len() > 50 { "long" } else { "short" }
    }

    // Returns reference with self's lifetime
    fn first_word(&self) -> &str {
        self.text.split_whitespace().next().unwrap_or("")
    }
}

// Multiple lifetimes
fn first_of<'a, 'b>(x: &'a str, _y: &'b str) -> &'a str {
    x
}

// Combining generics, traits, and lifetimes
fn long_announcement<'a, T>(x: &'a str, y: &'a str, ann: T) -> &'a str
where
    T: std::fmt::Display,
{
    println!("Announcement: {}", ann);
    if x.len() > y.len() { x } else { y }
}

fn main() {
    // Basic lifetimes
    let string1 = String::from("long string is long");
    let result;
    {
        let string2 = String::from("xyz");
        result = longest(string1.as_str(), string2.as_str());
        println!("Longest: {}", result);
    }
    // println!("{}", result); // Error if string2 no longer exists

    // Struct with lifetime
    let novel = String::from("Call me Ishmael. Some years ago...");
    let excerpt = Excerpt {
        text: &novel[..30],
        author: "Herman Melville",
    };
    println!("Excerpt: {:?}", excerpt);
    println!("Level: {}", excerpt.level());
    println!("First word: {}", excerpt.first_word());

    // 'static lifetime
    let s: &'static str = "I live forever";
    println!("{}", s);

    // Combining everything
    let best = long_announcement(
        "first long text",
        "second",
        "Special offer!",
    );
    println!("Best: {}", best);
}`,
  challenge: "Create a Cache<'a> struct that stores references to strings. Implement methods to add entries and search by key. Make sure the lifetimes are correct."
}

];
window.ALL_LESSONS.push(...chunk);
})();
