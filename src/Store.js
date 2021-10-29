import QcAssayList from '@/QcAssays'

class Store {
  constructor() {
    this.qcAssayList = QcAssayList()
  }
}

export { Store }
export default new Store()
