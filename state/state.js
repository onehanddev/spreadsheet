
export default (function() {
    const initState = (states) => {
        return new Proxy(states, {
          set(target, prop, val) {
            target[prop] = val;
            render();
            return true;
          }
        })
      }
      
      const state = initState({
        name: '',
        age: ''
      })
      
      
      const models = document.querySelectorAll('[data-model]')
      
      models.forEach((model) => {
        const key = model.dataset.model;
        model.addEventListener('keyup', (e) => {
          state[key] = e.target.value;
        })
      }) 
      
      const render = (prop, val) => {
        const bindings = Array.from(document.querySelectorAll('[data-binding]')).map(elem => elem.dataset.binding);
        bindings.forEach(binding => {
          console.log(state[binding]);
          document.querySelector(`[data-binding='${binding}']`).innerHTML = state[binding];
        })
      }
})()
