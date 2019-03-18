import Wells from '@/components/wells'

export function components () {
  return Object.keys(Wells).reduce(function(result, key) {
    result[key] = Wells[key]
    return result
  }, {})
}

const WellTypes = {
  components: components()
}

export default WellTypes