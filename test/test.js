function testfn ({a=5, b=2}={}) {
    console.log (a)
    console.log (b)
}
testfn({a:6})
testfn({a:6, b: 7})