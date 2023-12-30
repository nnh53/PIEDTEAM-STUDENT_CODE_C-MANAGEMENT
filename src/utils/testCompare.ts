export const compareTest = ({ actualValue, expectedValue }: { actualValue: string; expectedValue: string }) => {
  const actualValueArr = actualValue.split('\n')
  const expectedValueArr = expectedValue.split('\n')
  const result = actualValueArr.map((value, index) => {
    return value === expectedValueArr[index]
  })
  return result
}
