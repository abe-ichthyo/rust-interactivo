// ─── LESSONS DATA: Chapters 1-5 ───
window.ALL_LESSONS = [];

(function() {
const chunk = [

// ══════════════════════════════════════════════════════
// CHAPTER 1: Getting Started
// ══════════════════════════════════════════════════════
{
  id: "1.1",
  chapter: "1. Getting Started",
  title: "1.1 Installation",
  explanation: `<p>To start programming in Rust, you need to install the compiler and its associated tools. The recommended way is to use <strong>rustup</strong>, the official installer that manages Rust versions and components.</p>
<p>Rustup lets you easily switch between stable, beta, and nightly versions. It also installs <code>cargo</code>, the package manager and build system for Rust, which you will use constantly.</p>
<p>Once installed, you can verify your installation with <code>rustc --version</code>. If you see a version number, you are ready to go!</p>`,
  code: `// Verify the Rust installation
// In your terminal you would run:
// $ rustc --version
// $ cargo --version

fn main() {
    // If you can compile this, Rust is properly installed
    println!("Rust is installed and working!");
    println!("Compiler version: check it with rustc --version");

    let tools = vec!["rustc", "cargo", "rustup"];
    for t in &tools {
        println!("Available tool: {}", t);
    }
}`,
  challenge: "Modify the program to print your name and today's date. Add a variable with your operating system and print it too."
},
{
  id: "1.2",
  chapter: "1. Getting Started",
  title: "1.2 Hello, World!",
  explanation: `<p>The "Hello, World!" program is the traditional first step in any programming language. In Rust, every program starts with the <code>fn main()</code> function, which is the entry point.</p>
<p>The <code>println!</code> macro is used to print text to the console. Note the exclamation mark: it indicates this is a macro, not a regular function. Macros are a powerful feature of Rust.</p>
<p>Rust files have the <code>.rs</code> extension. You can compile a file with <code>rustc file.rs</code> and then run the resulting binary.</p>`,
  code: `fn main() {
    // println! is a macro that prints text
    println!("Hello, World!");

    // You can use format with curly braces {}
    let name = "Rustacean";
    println!("Hello, {}!", name);

    // You can also use positional arguments
    println!("{0} says: Hello {1}! {1} says: Hello {0}!",
             "Alice", "Bob");

    // And named arguments
    println!("{language} is great", language = "Rust");
}`,
  challenge: "Create a program that prints a simple ASCII art (a triangle or a house) using multiple println! calls."
},
{
  id: "1.3",
  chapter: "1. Getting Started",
  title: "1.3 Hello, Cargo!",
  explanation: `<p><strong>Cargo</strong> is Rust's build system and package manager. Most Rust projects use Cargo because it simplifies building, dependency management, and much more.</p>
<p>You can create a new project with <code>cargo new project_name</code>. This generates a directory structure with a <code>Cargo.toml</code> file (project configuration) and a <code>src/</code> directory with <code>main.rs</code>.</p>
<p>The main commands are: <code>cargo build</code> to compile, <code>cargo run</code> to compile and run, and <code>cargo check</code> to verify without generating a binary (faster).</p>`,
  code: `// File: src/main.rs (created by cargo new)
// Cargo.toml contains the project configuration

fn main() {
    // cargo build   -> compile the project
    // cargo run     -> compile and run
    // cargo check   -> verify without compiling (faster)
    // cargo build --release -> optimized build

    println!("Project created with Cargo!");

    // Cargo.toml example:
    // [package]
    // name = "my_project"
    // version = "0.1.0"
    // edition = "2021"
    //
    // [dependencies]
    // # external dependencies go here

    let commands = [
        ("cargo new", "Create project"),
        ("cargo build", "Compile"),
        ("cargo run", "Compile and run"),
        ("cargo check", "Verify code"),
        ("cargo test", "Run tests"),
    ];

    for (cmd, desc) in &commands {
        println!("{}: {}", cmd, desc);
    }
}`,
  challenge: "Add a vector with at least 3 popular Rust dependencies (serde, tokio, rand) and print a description of each one."
},

// ══════════════════════════════════════════════════════
// CHAPTER 2: Guessing Game
// ══════════════════════════════════════════════════════
{
  id: "2.1",
  chapter: "2. Guessing Game",
  title: "2.1 Guessing Game",
  explanation: `<p>The guessing game is a classic project that introduces several fundamental Rust concepts: variables, user input, comparisons, and loops. The program generates a secret number and the player must guess it.</p>
<p>This project uses the <code>rand</code> crate to generate random numbers, showing how to add external dependencies. It also introduces input/output handling with <code>std::io</code>.</p>
<p>Key concepts include: <code>let mut</code> for mutable variables, <code>match</code> to handle different outcomes, and the <code>Result</code> type for error handling with <code>expect()</code>.</p>`,
  code: `use std::io;
use std::cmp::Ordering;

fn main() {
    println!("=== Guessing Game ===");

    // In a real project you would use: rand::thread_rng().gen_range(1..=100)
    let secret_number = 42; // We simulate the random number

    let guesses = vec!["75", "25", "42"]; // We simulate input

    for (i, guess) in guesses.iter().enumerate() {
        println!("\\nGuess {}: {}", i + 1, guess);

        let guess: u32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => {
                println!("Please enter a number!");
                continue;
            }
        };

        match guess.cmp(&secret_number) {
            Ordering::Less => println!("Too small!"),
            Ordering::Greater => println!("Too big!"),
            Ordering::Equal => {
                println!("🎉 Correct! You guessed it.");
                break;
            }
        }
    }
}`,
  challenge: "Modify the game to count the number of guesses and show a different message depending on how many it took (less than 3: excellent, 3-5: good, more than 5: keep practicing)."
},

// ══════════════════════════════════════════════════════
// CHAPTER 3: Common Programming Concepts
// ══════════════════════════════════════════════════════
{
  id: "3.1",
  chapter: "3. Common Concepts",
  title: "3.1 Variables and Mutability",
  explanation: `<p>In Rust, variables are <strong>immutable by default</strong>. This is a design decision that promotes safety and concurrency. If you try to change an immutable variable, the compiler will give you an error.</p>
<p>To make a variable mutable, you use the <code>mut</code> keyword. Constants (<code>const</code>) are always immutable and must have their type annotated. They can be declared in any scope, including global.</p>
<p><strong>Shadowing</strong> lets you reuse a variable name with <code>let</code>. Unlike <code>mut</code>, shadowing creates a new variable, which allows you to change the type of the value.</p>`,
  code: `fn main() {
    // Variables are immutable by default
    let x = 5;
    println!("x = {}", x);
    // x = 6; // Error! Cannot mutate

    // Mutable variables with mut
    let mut y = 10;
    println!("y = {}", y);
    y = 20; // OK, it's mutable
    println!("y is now = {}", y);

    // Constants (always immutable, type required)
    const MAX_POINTS: u32 = 100_000;
    println!("Maximum: {}", MAX_POINTS);

    // Shadowing: reuse name with let
    let spaces = "   ";
    let spaces = spaces.len(); // Changed from &str to usize
    println!("Number of spaces: {}", spaces);

    // Shadowing vs mut
    let z = 5;
    let z = z + 1; // shadowing: new variable
    let z = z * 2;
    println!("z = {}", z); // 12
}`,
  challenge: "Create a program that demonstrates the difference between shadowing and mutability. Use shadowing to convert a string to its length, and a mutable variable for a counter that increments in a loop."
},
{
  id: "3.2",
  chapter: "3. Common Concepts",
  title: "3.2 Data Types",
  explanation: `<p>Rust is a <strong>statically typed</strong> language: the compiler must know the type of every variable at compile time. Scalar types include integers (i8 to i128, u8 to u128), floats (f32, f64), booleans (bool), and characters (char).</p>
<p>Compound types group multiple values: <strong>tuples</strong> have a fixed length and can contain different types, while <strong>arrays</strong> have a fixed length and all their elements are the same type.</p>
<p>Type inference in Rust is powerful: the compiler can deduce the type in most cases. When there is ambiguity, you must annotate the type explicitly.</p>`,
  code: `fn main() {
    // Integers
    let integer: i32 = -42;
    let unsigned: u64 = 1_000_000;
    let byte: u8 = 255;
    println!("Integers: {}, {}, {}", integer, unsigned, byte);

    // Floats
    let pi: f64 = 3.14159;
    let e: f32 = 2.718;
    println!("Floats: {}, {}", pi, e);

    // Boolean and character
    let active: bool = true;
    let emoji: char = '🦀';
    println!("Bool: {}, Char: {}", active, emoji);

    // Tuples
    let tuple: (i32, f64, char) = (500, 6.4, 'z');
    let (x, y, z) = tuple; // Destructure
    println!("Tuple: {}, {}, {}", x, y, z);
    println!("Direct access: {}", tuple.0);

    // Arrays (fixed length, same type)
    let months = ["Jan", "Feb", "Mar", "Apr", "May"];
    let zeros = [0; 5]; // [0, 0, 0, 0, 0]
    println!("Month: {}", months[0]);
    println!("Zeros: {:?}", zeros);
}`,
  challenge: "Create a program that uses all scalar and compound types. Include a tuple with student information (name as &str, age as u8, GPA as f64) and an array with their grades."
},
{
  id: "3.3",
  chapter: "3. Common Concepts",
  title: "3.3 Functions",
  explanation: `<p>Functions in Rust are declared with <code>fn</code>. The convention is to use <strong>snake_case</strong> for function and variable names. You can define functions anywhere in the file; Rust does not require them to be defined before use.</p>
<p><strong>Parameters</strong> must have their type annotated. If the function returns a value, the return type is indicated with <code>-></code>. The last expression without a semicolon becomes the implicit return value.</p>
<p>Rust distinguishes between <strong>statements</strong> (do not return a value) and <strong>expressions</strong> (do return a value). A block <code>{}</code> is an expression whose value is that of its last expression.</p>`,
  code: `fn main() {
    greet("Rustacean");

    let result = add(5, 3);
    println!("5 + 3 = {}", result);

    let area = calculate_area(10.0, 5.5);
    println!("Area: {:.2}", area);

    // Expressions as values
    let y = {
        let x = 3;
        x + 1 // No semicolon = expression (returns value)
    };
    println!("y = {}", y);

    let level = classify(85);
    println!("Level: {}", level);
}

fn greet(name: &str) {
    println!("Hello, {}!", name);
}

fn add(a: i32, b: i32) -> i32 {
    a + b // Implicit return (no semicolon)
}

fn calculate_area(base: f64, height: f64) -> f64 {
    base * height / 2.0
}

fn classify(score: u32) -> &'static str {
    if score >= 90 { "Excellent" }
    else if score >= 70 { "Good" }
    else { "Needs improvement" }
}`,
  challenge: "Create a function that receives an array of f64 and returns a tuple with (minimum, maximum, average). Call it from main with test data."
},
{
  id: "3.4",
  chapter: "3. Common Concepts",
  title: "3.4 Comments",
  explanation: `<p>Rust supports several types of comments. <strong>Line comments</strong> use <code>//</code> and <strong>block comments</strong> use <code>/* */</code>. Both are ignored by the compiler.</p>
<p><strong>Documentation comments</strong> are special: <code>///</code> generates documentation for the following item, and <code>//!</code> documents the containing item. These comments support Markdown and are processed with <code>cargo doc</code>.</p>
<p>The Rust convention is to prefer line comments over block comments. Documentation comments are fundamental in the ecosystem and are automatically published on docs.rs.</p>`,
  code: `//! This module demonstrates the types of comments in Rust.
//! Use cargo doc --open to generate HTML documentation.

/// Calculates the factorial of a number.
///
/// # Arguments
/// * n - The number to calculate the factorial of
///
/// # Examples
/// (doc-test example)
/// let result = factorial(5);
/// assert_eq!(result, 120);
/// (end doc-test)
///
/// # Panics
/// Does not panic for valid u64 values.
fn factorial(n: u64) -> u64 {
    // Line comment: base case
    if n <= 1 {
        return 1;
    }
    /* Block comment:
       recursive case */
    n * factorial(n - 1)
}

fn main() {
    // Documentation comments (///) generate HTML docs
    for i in 0..=10 {
        println!("{}! = {}", i, factorial(i));
    }

    // TODO: TODO comments are a common convention
    // FIXME: FIXME indicates code that needs fixing
    // NOTE: For important notes
}`,
  challenge: "Write a well-documented function with /// that includes Arguments, Returns, Examples, and Panics sections. The function should convert temperature from Celsius to Fahrenheit."
},
{
  id: "3.5",
  chapter: "3. Common Concepts",
  title: "3.5 Control Flow",
  explanation: `<p>Rust has the classic control structures: <code>if/else</code>, <code>loop</code>, <code>while</code>, and <code>for</code> loops. An important difference is that <code>if</code> is an expression, so it can return a value.</p>
<p>The <code>loop</code> construct is infinite until you use <code>break</code>. It can return a value with <code>break value</code>. Loops can be labeled with <code>'label:</code> to control which loop is broken in nested loops.</p>
<p>The <code>for</code> loop is the most used in Rust and iterates over iterators. With <code>for x in collection</code> you iterate elements, and with ranges like <code>0..10</code> or <code>0..=10</code> you generate numeric sequences.</p>`,
  code: `fn main() {
    // if as an expression
    let number = 7;
    let kind = if number % 2 == 0 { "even" } else { "odd" };
    println!("{} is {}", number, kind);

    // loop with break that returns a value
    let mut counter = 0;
    let result = loop {
        counter += 1;
        if counter == 10 {
            break counter * 2; // returns 20
        }
    };
    println!("Loop result: {}", result);

    // Loop labels
    let mut outer = 0;
    'outer_loop: loop {
        let mut inner = 0;
        loop {
            if inner == 3 { break; }           // breaks inner
            if outer == 2 { break 'outer_loop; } // breaks outer
            inner += 1;
        }
        outer += 1;
    }
    println!("outer ended at: {}", outer);

    // while
    let mut n = 3;
    while n > 0 {
        println!("{}...", n);
        n -= 1;
    }
    println!("Liftoff!");

    // for with ranges and iterators
    let fruits = ["🍎", "🍊", "🍋", "🍇"];
    for (i, fruit) in fruits.iter().enumerate() {
        println!("{}: {}", i, fruit);
    }

    // Reverse range
    for i in (1..=5).rev() {
        print!("{} ", i);
    }
    println!();
}`,
  challenge: "Write a program that prints the first 20 Fibonacci numbers using a loop. Use variables to keep track of the two previous numbers."
},

// ══════════════════════════════════════════════════════
// CHAPTER 4: Understanding Ownership
// ══════════════════════════════════════════════════════
{
  id: "4.1",
  chapter: "4. Ownership",
  title: "4.1 What is Ownership?",
  explanation: `<p><strong>Ownership</strong> is the central concept of Rust that enables memory management without a garbage collector. Every value has exactly one <em>owner</em>, and when the owner goes out of scope, the value is automatically freed.</p>
<p>When you assign a value to another variable, either a <strong>move</strong> occurs (heap types like String are moved) or a <strong>copy</strong> happens (simple stack types like i32 are copied). After a move, the original variable is no longer valid.</p>
<p>The <code>clone()</code> function allows you to make an explicit deep copy of heap data. Types that implement the <code>Copy</code> trait (integers, floats, booleans, char) are automatically copied.</p>`,
  code: `fn main() {
    // Basic ownership: the String is moved
    let s1 = String::from("hello");
    let s2 = s1; // s1 is MOVED to s2
    // println!("{}", s1); // Error! s1 is no longer valid
    println!("s2 = {}", s2);

    // Clone: explicit deep copy
    let s3 = String::from("world");
    let s4 = s3.clone();
    println!("s3 = {}, s4 = {}", s3, s4); // Both valid

    // Copy: simple types are copied automatically
    let x = 5;
    let y = x; // x is COPIED (i32 implements Copy)
    println!("x = {}, y = {}", x, y); // Both valid

    // Ownership with functions
    let name = String::from("Rust");
    take_ownership(name);
    // println!("{}", name); // Error! It was moved to the function

    let number = 42;
    make_copy(number);
    println!("number is still valid: {}", number); // OK, it was copied

    // Returning ownership
    let s5 = give_ownership();
    println!("s5 = {}", s5);
}

fn take_ownership(s: String) {
    println!("I took: {}", s);
} // s is freed here

fn make_copy(n: i32) {
    println!("I copied: {}", n);
}

fn give_ownership() -> String {
    String::from("I'm yours!")
}`,
  challenge: "Create a function that receives a String, modifies it (appends text), and returns it. Demonstrate how ownership transfers back and forth."
},
{
  id: "4.2",
  chapter: "4. Ownership",
  title: "4.2 References and Borrowing",
  explanation: `<p><strong>References</strong> allow you to use a value without taking ownership. They are created with <code>&</code> and are called "borrows." A reference can never be null in Rust.</p>
<p>By default, references are immutable. To modify a borrowed value, you need a <strong>mutable reference</strong> (<code>&mut</code>). The key rule: you can have many immutable references OR one mutable reference, but not both at the same time.</p>
<p>These rules prevent <em>data races</em> at compile time. The compiler also guarantees that references never point to freed data (no <em>dangling references</em>).</p>`,
  code: `fn main() {
    // Immutable reference (borrow)
    let s1 = String::from("hello");
    let len = calculate_length(&s1); // We borrow s1
    println!("'{}' has {} characters", s1, len); // s1 is still valid

    // Multiple immutable references: OK
    let r1 = &s1;
    let r2 = &s1;
    println!("{} and {}", r1, r2);

    // Mutable reference
    let mut s2 = String::from("hello");
    change(&mut s2);
    println!("Modified: {}", s2);

    // Only ONE mutable reference at a time
    let mut s3 = String::from("data");
    {
        let r3 = &mut s3;
        r3.push_str(" modified");
    } // r3 goes out of scope here
    let r4 = &mut s3; // OK, r3 no longer exists
    r4.push_str(" again");
    println!("{}", s3);

    // Immutable references end at their last use
    let mut s4 = String::from("text");
    let r5 = &s4;
    println!("{}", r5); // Last use of r5
    let r6 = &mut s4;   // OK, r5 is no longer used
    r6.push_str("!");
    println!("{}", s4);
}

fn calculate_length(s: &String) -> usize {
    s.len()
} // s goes out of scope but doesn't have ownership, not freed

fn change(s: &mut String) {
    s.push_str(", world");
}`,
  challenge: "Write a function that receives a mutable reference to a Vec<i32> and another that receives an immutable reference. The first adds elements, the second calculates the sum. Demonstrate the borrowing rules."
},
{
  id: "4.3",
  chapter: "4. Ownership",
  title: "4.3 Slices",
  explanation: `<p><strong>Slices</strong> are references to a contiguous portion of a collection, without taking ownership. The most common type is the <em>string slice</em> <code>&str</code>, which references part of a String.</p>
<p>Slice syntax uses ranges: <code>&s[0..5]</code> takes the first 5 bytes. You can omit the start (<code>&s[..5]</code>) or the end (<code>&s[2..]</code>) of the range. String literals (<code>"hello"</code>) are immutable slices.</p>
<p>Slices also work with arrays and vectors: <code>&vec[1..3]</code> gives a <code>&[T]</code>. They are fundamental in Rust for working with portions of data efficiently without copying.</p>`,
  code: `fn main() {
    // String slices
    let s = String::from("hello world");
    let hello = &s[0..5];   // "hello"
    let world = &s[6..];    // "world"
    println!("{} {}", hello, world);

    // first_word returns a slice
    let word = first_word(&s);
    println!("First word: {}", word);

    // String literals are slices (&str)
    let literal: &str = "I am a slice";
    println!("{}", literal);

    // Array slices
    let numbers = [1, 2, 3, 4, 5];
    let middle = &numbers[1..4]; // [2, 3, 4]
    println!("Array slice: {:?}", middle);

    // Vector slices
    let vec = vec![10, 20, 30, 40, 50];
    let part = &vec[2..];
    println!("Vector slice: {:?}", part);

    // The slice keeps the reference valid
    let mut text = String::from("hello world");
    let first = first_word(&text);
    println!("First: {}", first);
    // text.clear(); // Error! Cannot mutate while there's an immutable reference
}

fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();
    for (i, &byte) in bytes.iter().enumerate() {
        if byte == b' ' {
            return &s[..i];
        }
    }
    &s[..]
}`,
  challenge: "Write a function that receives a &str and returns the last word. Then write another that returns a slice with the first N words."
},

// ══════════════════════════════════════════════════════
// CHAPTER 5: Using Structs
// ══════════════════════════════════════════════════════
{
  id: "5.1",
  chapter: "5. Structs",
  title: "5.1 Defining Structs",
  explanation: `<p><strong>Structs</strong> are custom data types that group related values with meaningful names. They are similar to classes in other languages but without inheritance.</p>
<p>There are three types of structs: <strong>structs with named fields</strong> (the most common), <strong>tuple structs</strong> (fields without names), and <strong>unit structs</strong> (no fields, useful for traits).</p>
<p>Rust has useful syntactic sugar: the <em>field init shorthand</em> when variable and field have the same name, and the <em>struct update syntax</em> (<code>..other_struct</code>) for creating structs based on an existing one.</p>`,
  code: `// Struct with named fields
#[derive(Debug)]
struct User {
    name: String,
    email: String,
    active: bool,
    sign_in_count: u64,
}

// Tuple struct
#[derive(Debug)]
struct Color(i32, i32, i32);
struct Point(f64, f64, f64);

// Unit struct
struct AlwaysEqual;

fn main() {
    // Create instance
    let mut user1 = User {
        name: String::from("Alice"),
        email: String::from("alice@example.com"),
        active: true,
        sign_in_count: 1,
    };

    // Access and modify (if mut)
    user1.sign_in_count += 1;
    println!("{}: {} sign-ins", user1.name, user1.sign_in_count);

    // Struct update syntax
    let user2 = User {
        email: String::from("bob@example.com"),
        name: String::from("Bob"),
        ..user1 // Takes the rest from user1
    };
    println!("{:?}", user2);

    // Field init shorthand
    let user3 = build_user(
        String::from("Carol"),
        String::from("carol@example.com"),
    );
    println!("{:?}", user3);

    // Tuple structs
    let black = Color(0, 0, 0);
    let red = Color(255, 0, 0);
    println!("Black: {:?}, Red: {:?}", black, red);
}

fn build_user(name: String, email: String) -> User {
    User {
        name,  // field init shorthand
        email,
        active: true,
        sign_in_count: 0,
    }
}`,
  challenge: "Create a Book struct with title, author, pages, and available. Implement a function that creates a book and another that prints its details in a formatted way."
},
{
  id: "5.2",
  chapter: "5. Structs",
  title: "5.2 An Example Program Using Structs",
  explanation: `<p>Let's build a program that calculates the area of rectangles, evolving from loose variables to structs. This demonstrates why structs improve code organization.</p>
<p>The <code>#[derive(Debug)]</code> attribute allows printing structs with <code>{:?}</code> (debug format) and <code>{:#?}</code> (pretty debug format). The <code>dbg!</code> macro prints the file, line, and value of an expression.</p>
<p>This example shows how structs give meaning to data: instead of two loose numbers (width, height), we have a Rectangle with clear fields.</p>`,
  code: `#[derive(Debug)]
struct Rectangle {
    width: f64,
    height: f64,
}

fn area(rect: &Rectangle) -> f64 {
    rect.width * rect.height
}

fn can_hold(outer: &Rectangle, inner: &Rectangle) -> bool {
    outer.width > inner.width && outer.height > inner.height
}

fn main() {
    let rect1 = Rectangle { width: 30.0, height: 50.0 };
    let rect2 = Rectangle { width: 10.0, height: 40.0 };
    let rect3 = Rectangle { width: 60.0, height: 45.0 };

    // Debug printing
    println!("rect1: {:?}", rect1);
    println!("rect1 pretty: {:#?}", rect1);

    // dbg! macro (prints file:line and value)
    let scale = 2.0;
    let rect4 = Rectangle {
        width: dbg!(30.0 * scale), // prints and returns value
        height: 50.0,
    };
    dbg!(&rect4);

    // Calculate areas
    println!("Area of rect1: {} px²", area(&rect1));
    println!("Area of rect2: {} px²", area(&rect2));

    // Check containment
    println!("rect1 holds rect2: {}", can_hold(&rect1, &rect2));
    println!("rect1 holds rect3: {}", can_hold(&rect1, &rect3));
}`,
  challenge: "Add a function that receives a vector of Rectangle and returns the one with the largest area. Use #[derive(Debug)] to print the result."
},
{
  id: "5.3",
  chapter: "5. Structs",
  title: "5.3 Method Syntax",
  explanation: `<p><strong>Methods</strong> are defined within an <code>impl</code> block and their first parameter is always <code>self</code> (the struct instance). They are called with dot notation: <code>rect.area()</code>.</p>
<p>The <code>self</code> parameter can be <code>&self</code> (immutable reference, most common), <code>&mut self</code> (mutable reference), or <code>self</code> (takes ownership, rare). Rust applies <em>automatic referencing</em> when calling methods.</p>
<p><strong>Associated functions</strong> don't receive <code>self</code> and are called with <code>::</code> (e.g., <code>String::from()</code>). They are commonly used as constructors. A struct can have multiple <code>impl</code> blocks.</p>`,
  code: `#[derive(Debug)]
struct Rectangle {
    width: f64,
    height: f64,
}

impl Rectangle {
    // Associated function (constructor) - no self
    fn new(width: f64, height: f64) -> Self {
        Self { width, height }
    }

    fn square(side: f64) -> Self {
        Self { width: side, height: side }
    }

    // Methods - with &self
    fn area(&self) -> f64 {
        self.width * self.height
    }

    fn perimeter(&self) -> f64 {
        2.0 * (self.width + self.height)
    }

    fn is_square(&self) -> bool {
        (self.width - self.height).abs() < f64::EPSILON
    }

    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }

    // Method with &mut self
    fn scale(&mut self, factor: f64) {
        self.width *= factor;
        self.height *= factor;
    }
}

fn main() {
    // Associated function (constructor)
    let mut rect = Rectangle::new(30.0, 50.0);
    let square = Rectangle::square(25.0);

    println!("Area: {}", rect.area());
    println!("Perimeter: {}", rect.perimeter());
    println!("Is square? {}", rect.is_square());
    println!("Holds the square? {}", rect.can_hold(&square));

    // Mutable method
    rect.scale(2.0);
    println!("After scaling: {:?}", rect);
    println!("New area: {}", rect.area());
}`,
  challenge: "Create a Circle struct with radius and an impl block with methods: new, area, circumference, and an associated function from_diameter. Add a method that determines if a point (x, y) is inside the circle."
}

];
window.ALL_LESSONS.push(...chunk);
})();
