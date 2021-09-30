
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
      
      
      const cells = document.querySelectorAll('[data-content]')
      
      cells.forEach((cell) => {
        const key = model.dataset.content;
        cell.addEventListener('keyup', (e) => {
          state[key] = e.target.value;
        })
      }) 
      
      const render = (prop, val) => {
        
      }
})()
