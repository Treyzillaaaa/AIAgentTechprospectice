/* Smoke test for the TechProspective dashboard's real StarNet roster adapter.
   node test/techprospective-pokedex.test.js */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../frontend/app/techpokedex.js'), 'utf8');
const nodes = [], events = {}, storage = {}, opened = [];
function node() { return { hidden: false, dataset: {}, innerHTML: '', setAttribute() {}, addEventListener(type, handler) { this['on_' + type] = handler; } }; }
const document = {
  readyState: 'complete', createElement: node,
  body: { append(...els) { nodes.push(...els); } },
  addEventListener(type, fn) { events[type] = fn; }
};
const localStorage = {
  getItem(k) { return storage[k] || null; },
  setItem(k, v) { storage[k] = v; }
};
const App = {
  agents() { return [{ id: 'agent', name: 'Executive', role: 'orchestrator' }, { id: 'ops-1', name: 'Operations', role: 'crew' }]; },
  selectAgent(id) { opened.push(id); }
};
const TechPokedex = new Function('document','App','localStorage','window',source + '; return TechPokedex;')(document, App, localStorage, { alert() {} });
assert.equal(nodes.length, 2, 'launcher and dashboard are mounted');
assert.equal(TechPokedex.stations.length, 13);
TechPokedex.open();
assert.match(nodes[1].innerHTML, /52 station assignments filled/);
assert.match(nodes[1].innerHTML, /Fore &amp; Pour/);
assert.match(nodes[1].innerHTML, /UNASSIGNED/);
nodes[1].on_change({ target: { id:'', dataset:{assign:'fore-and-pour:center'}, value:'ops-1', matches: selector=>selector==='[data-assign]' } });
assert.equal(JSON.parse(storage['techprospective.pokedex.assignments.v1'])['fore-and-pour:center'], 'ops-1');
assert.match(nodes[1].innerHTML, /LINKED/);
assert.match(nodes[1].innerHTML, /Operations/);
nodes[1].on_click({ target: { closest: selector=>selector==='[data-open]' ? { dataset: { open:'ops-1' } } : null } });
assert.deepEqual(opened, ['ops-1']);
assert.equal(nodes[1].hidden, true);
console.log('TechProspective Pokédex smoke test passed');
