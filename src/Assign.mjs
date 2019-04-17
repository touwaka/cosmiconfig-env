import deepmerge from 'deepmerge'

const overwriteMerge = (destinationArray, sourceArray, options) => sourceArray

export default (...arrayOfObjects) => {
	return deepmerge.all(arrayOfObjects, { arrayMerge: overwriteMerge })
}