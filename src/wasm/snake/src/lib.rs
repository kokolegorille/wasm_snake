use wasm_bindgen::prelude::*;
use web_sys::console::log_1 as log;

#[wasm_bindgen]
pub fn hello() {
    log(&"Hello world!".into())
}