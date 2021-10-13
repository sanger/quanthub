import { SequencescapePlateList } from '@/SequencescapePlates'

class Store {
  constructor() {
    this.sequencescapePlates = new SequencescapePlateList()
  }
}

export { Store }
export default new Store()
