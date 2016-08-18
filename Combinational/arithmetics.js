const { AndGate, XorGate, OrGate } = require('./gates')
const { Wire, wires } = require('../Connectors/transport')

class HalfAdder {

  constructor(x, s) {
    this.components = []
    this.components.push(new XorGate(x, [s[0]]))
    this.components.push(new AndGate(x, [s[1]]))
  }

}

class FullAdder {

  constructor(x, s) {
    this.internalWiring = wires(3)
    this.components = []
    this.components.push(new HalfAdder([x[0], x[1]], [this.internalWiring[0], this.internalWiring[1]]))
    this.components.push(new HalfAdder([this.internalWiring[0], x[2]], [s[0], this.internalWiring[2]]))
    this.components.push(new OrGate([this.internalWiring[1], this.internalWiring[2]], [s[1]]))
  }

}

class PipoAdder {

  constructor(a, b, s) {
    let size = a.length
    this.internalWiring = wires(size)
    this.components = []
    if (size > 1) {
      this.components.push(new FullAdder([a[0], b[0], this.internalWiring[0]], [s[0], this.internalWiring[1]]))
      for(let i = 1; i < size - 1; i++) {
        this.components.push(new FullAdder([a[i], b[i], this.internalWiring[i]], [s[i], this.internalWiring[i+1]]))
      }
      this.components.push(new FullAdder([a[size-1], b[size-1], this.internalWiring[size-1]], [s[size-1], s[size]]))
    } else {
      this.components.push(new FullAdder([a[0], b[0], this.internalWiring[0]], [s[0], s[size]]))
    }
    this.internalWiring[0].propagateSignal(0)
  }

}

module.exports = { HalfAdder, FullAdder, PipoAdder }
