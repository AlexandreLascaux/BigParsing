const fs = require('fs')
const StreamArray = require('stream-json/streamers/StreamArray')
const {Writable} = require('stream')

const id = process.argv.slice(2)[0]
const fileStream = fs.createReadStream('json/input.json')
const jsonStream = StreamArray.withParser()

const processingStream = new Writable({
	write({key, value}, encoding, next) {
    process.stdout.write('Searching\r')
		if(value['id'] === +id) {
      process.stdout.write(value['name'])
    } else {
      next()
    }
	},
	objectMode: true
});

fileStream.pipe(jsonStream.input)
jsonStream.pipe(processingStream)
