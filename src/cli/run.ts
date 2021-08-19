#!/usr/bin/env node
import main from './cli'

main(process.argv.slice(2)).then().catch(console.error)
