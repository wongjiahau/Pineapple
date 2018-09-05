const { compile } = require("nexe")

compile({
    name: 'pine',
    resources: [
        './pinelib/**/*',
    ],
    targets: [
        "win32-x86-8.6.0",
        "linux-x64"
    ]
}).then(() => {
  console.log('success')
})