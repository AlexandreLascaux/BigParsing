## The problem

The problem consists in extracting data from a JSON file too big to be parsed / hold in memory as a whole.

The file is a valid JSON file, consisting in an array of objects. The structure of objects is not known, apart from the fact that they have an `id` and a `name` attributes.

The formatting of the file is not known: it may be a single line file, or formatted using a variety of whitespace options.

The problem consists in writing a Node.js program which must:

- accept an `id` as a command-line argument
- log to the console the `name` attribute of the object with the corresponding id.

To simulate low memory constraints, your program should work with `node --max_old_space_size=50`

## Example

````
> node --max_old_space_size=50 solution.js 62359
Damon Jerde // logged to the console
````

## My Solution

To answer the problem, I used a single npm package: [stream-json](https://www.npmjs.com/package/stream-json)
It allows to process large JSON files while keeping a minimal footprint on the used memory.

To do this, I get the id from the command line *(line 5)*.
I initialize the opening of the input.json file and create a stream to be able to read the data it can contain *(line 6)*.
I also initialize the npm package and especially the **StreamArray** function. This function allows to format the object coming from the file into a **key/value** array in this way:
 - a **key** which corresponds to the id of the array (0, 1, 2, 3, ...)
 - a **value** corresponding to the object coming from the processed json file

Then, I create a **Writable** object from a **Stream**. This allows to use the write function. This function and this type allow to process the chunks coming from the file stream in an **asynchronous** way. Thus, this write function takes as parameter a chunk which is a **key/value object**, an **encoding** (not specified in this case) and the **next** function is actually more of a callback.
In our case, the use of this function and this type is essential. Indeed, a Writable stream will process the chunks one by one. As soon as a chunk "arrives", the processing from the write function is launched, but when a new chunk "arrives" while the processing of the previous one is not finished, the chunk is stored in the internal buffer. On the other hand, if the buffer fills up and reaches its maximum size, called **highWaterMark**, then the write function will return, internally, false to mean to stop calling the function. This will allow to process all pending chunks, empty the buffer and resume processing when the "drain" event is triggered.

To simplify, as long as the **write** function, internally, returns true then the file processing continues. If it returns false, it waits for the "drain" event and resumes processing once the internal buffer is empty.

So, I apply the parser on the file flow and the processing on the parser.

To achieve this goal, I was inspired by already existing developments. Even if I didn't know at the time how to transcribe it in the development, the buffer manipulation seemed to me essential. This allowed me to quickly focus my research on methods using this.

I hope that my development corresponds to what was expected!
