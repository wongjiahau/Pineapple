const { compile } = require("nexe")


const TARGETS = [
    "win32-x86-8.6.0",
    "linux-x64",
    "macos-8.4.0"
]

TARGETS.forEach((x) => {
    console.log(`Compiling for : ${x} ...`)
    compile({
        name: 'pine',
        resources: [
            './pinelib/**/*',
        ],
        targets: [x]
    }).then(() => {
        console.log(`Successfully compiled pine ${x}`)
    })
})
