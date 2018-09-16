const { action, observable, computed } = require('../libs/mobx.js')
const { Http } = require('../utils/http.js')

class TodoItem {
  constructor(name, age) {
    this.name = name
    this.age = age
  }
  @observable name
  @observable age

  @computed get people() {
    return `name: ${this.name}, age: ${this.age}`
  }

  @action('更新操作') updateName(name) {
    this.name = name
  }
}

module.exports = {
  TodoItem: new TodoItem()
}