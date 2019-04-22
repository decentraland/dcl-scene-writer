import test from 'ava'
import { isLowerCaseChar, toCamelCase } from '../src/utils'

test('Unit - isLowerCaseChar - should output true for "a"', t => {
  t.true(isLowerCaseChar('a'))
})

test('Unit - isLowerCaseChar - should output false for "A"', t => {
  t.false(isLowerCaseChar('A'))
})

test('Unit - toCamelCase - should output "transform"', t => {
  t.is(toCamelCase('Transform'), 'transform')
})

test('Unit - toCamelCase - should output "boxShape"', t => {
  t.is(toCamelCase('BoxShape'), 'boxShape')
})

test('Unit - toCamelCase - should output "gltfShape"', t => {
  t.is(toCamelCase('GLTFShape'), 'gltfShape')
})

test('Unit - toCamelCase - should output "api"', t => {
  t.is(toCamelCase('API'), 'api')
})

test('Unit - toCamelCase - should output "soyUnCapo"', t => {
  t.is(toCamelCase('SOYUnCapo'), 'soyUnCapo')
})
