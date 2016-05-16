'use strict'
const path = require('path')
const requireTree = require('require-tree')

global.$require = (modulePath) => {
  return require(path.join(process.cwd(), modulePath))
}

global.$requireTree = (modulePath) => {
  return requireTree(path.join(process.cwd(), modulePath))
}

global.$requireConfig = (sectionName) => {
  const requireCfg = require('konphyg')(`${process.cwd()}/config`)
  return requireCfg(sectionName)
}
