async function init() {
    let rustApp = null
  
    try {
      rustApp = await import('./wasm/snake/pkg')
    } catch(err) {
      console.error(err)
      return;
    }
  
    console.log(rustApp)
    rustApp.hello()
}

init()