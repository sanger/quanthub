import {List as Triplicates} from '@/lib/Triplicates'

class Store {
  constructor () {
    this.triplicates = new Triplicates()
  }
}

export { Store }
export default new Store()
