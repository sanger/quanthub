import { ReplicateList } from '@/Replicates'

/*
  When the app is loaded we create a QcAssayList to hold all of the current QcAsssays in the store
  When a plate is created it will added to the list of QcAssays
*/

/**
 * @param {String} barcode - The barcode of the assay
 * @return {Object} QcAssay the barcode and a ReplicateList
 **/
const QcAssay = (barcode) => {
  return {
    barcode,
    replicates: ReplicateList(),
  }
}

/**
 * List of QcAssays in the current environment
 * @return {Object} QcAssayList
 **/
const QcAssayList = () => {
  // a list of QcAssays. A map for easier access
  const items = new Map()

  /**
   * @return {Array} of all of the keys
   **/
  const keys = () => items.keys()

  const size = () => items.size

  /**
   * @param {Object} labware - The labware to add
   **/
  const add = (labware) => items.set(labware.barcode, labware)

  /**
   * @param {String} key - The key of the qc assay
   * @return {Object} QcAssay - if the item with that key exists return it
   * otherwise return an empty qc assay
  **/
  const find = (key) => items.get(key) || QcAssay('empty')

  /**
   * @param {Object} Well - The well to add
   * It will add the well to the replicate for the current qc assay
   **/
  const addReplicate = (well) => find(well.plateBarcode).replicates.add(well)

  return {
    items,
    keys,
    size,
    add,
    addReplicate,
    find,
  }
}

export default QcAssayList
