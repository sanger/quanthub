import {SequencescapePlateList} from '@/lib/SequencescapePlates'

class Store {
  constructor () {
    this.sequencescapePlates = new SequencescapePlateList()
  }
}

export { Store }
export default new Store()
