'use strict'
const _ = require('lodash')
const assert = require('chai').assert

function startTimer (res, section, isSequence) {
  isSequence = isSequence || false
  res.requestProfiler = res.requestProfiler ? res.requestProfiler : { timers: {}, counters: {} }
  let timers = res.requestProfiler['timers']

  let item
  if (section && isSequence) {
    let seq
    if (timers[section]) {
      seq = timers[section]
    } else {
      seq = timers[section] = []
    }
    item = {}
    seq.push(item)
  } else if (section) {
    item = timers[section] = {}
  } else {
    item = timers['total'] = {}
  }

  item.start = process.hrtime()
}

function stopTimer (res, section) {
  if (!res.requestProfiler) { return }

  let timers = res.requestProfiler['timers']
  let item

  if (section && _.isArray(timers[section])) {
    item = _.last(timers[section])
  } else if (section) {
    item = _.result(timers, section)
    assert(_.isArray(item.start),
      `request-profiler.stopTimer() profile timer section '${section}' should be started somewhere to be stopped .. `)
  } else {
    assert(_.isArray(timers['total'].start),
      `request-profiler.stopTimer() profile timer should be started somewhere to be stopped .. `)
    item = timers['total']
  }

  const diff = process.hrtime(item.start)
  item.duration = diff[0] * 1e3 + diff[1] * 1e-6
}

function getTimer (res, section) {
  if (!res.requestProfiler) { return null }

  assert(_.isObject(res.requestProfiler.timers), `request-profiler.getAllTimers() profile timer should be started at least once`)

  let timers = res.requestProfiler['timers']

  if (section && _.isArray(timers[section])) {
    const seq = _.map(timers[section], item => item.duration)
    const total = _.sum(seq)
    //return { total, seq }
    return {
      total,
      // p50: stats.percentile(seq, 0.5),
      // p80: stats.percentile(seq, 0.8),
      // p90: stats.percentile(seq, 0.9),
      // p95: stats.percentile(seq, 0.95),
      // p100: stats.percentile(seq, 1)
    }
  } else if (section) {
    assert(_.result(timers, section).duration,
      `request-profiler.stop() profile timer section '${section}' should be started somewhere `)
    return timers[section].duration
  } else {
    return _.mapValues(timers, item => {
      if (_.has(item, 'duration')) {
        return item.duration
      } else if (_.isArray(item)){
        const seq = _.map(item, val => val.duration)
        const total = _.sum(seq)
        //return { total, seq }
        return {
          total,
          // p50: stats.percentile(seq, 0.5),
          // p80: stats.percentile(seq, 0.8),
          // p90: stats.percentile(seq, 0.9),
          // p95: stats.percentile(seq, 0.95),
          // p100: stats.percentile(seq, 1)
        }
      } else {
        return item
      }
    })
  }
}

function incCounter (res, section) {
  section = section || 'total'
  res.requestProfiler = res.requestProfiler ? res.requestProfiler : { timers: {}, counters: {} }
  let counters = res.requestProfiler['counters']

  counters[section] = counters[section] || 0
  counters[section] += 1
}

function decCounter (res, section) {
  section = section || 'total'
  res.requestProfiler = res.requestProfiler ? res.requestProfiler : { counters: {} }
  let counters = res.requestProfiler['counters']

  counters[section] = counters[section] || 0
  counters[section] -= 1
}

function getCounter (res, section) {
  if (!res.requestProfiler) { return null }

  let counters = res.requestProfiler['counters']

  if (section) {
    return counters[section]
  } else {
    return counters
  }

}

module.exports = {
  startTimer,
  stopTimer,
  getTimer,
  incCounter,
  decCounter,
  getCounter
}