import test from 'ava'
import { stringify } from '../src/utils'

test('Unit - utils.stringify(obj) - should return correct string', t => {
  const obj = {
    name: 'Fefo Miras',
    job: {
      name: 'Software Engineer',
      company: 'Decentraland'
    },
    favoriteFood: ['Milanesa', 'BigMac']
  }

  const result = stringify(obj)
  const expected =
    '{ name: "Fefo Miras", job: { name: "Software Engineer", company: "Decentraland" }, favoriteFood: ["Milanesa","BigMac"] }'

  t.is(result, expected)
})

test('Unit - utils.stringify(null) - should return empty string', t => {
  t.is(stringify(null), '')
})
