console.log(window.dataLayer);
window.dataLayer = [] || window.dataLayer;
Object.defineProperty(window.dataLayer, "push", {
    // hide from for..in and prevent further overrides (via default descriptor values)
    value: function () {
        console.log('func called')
        for (
            var i = 0, n = this.length, l = arguments.length;
            i < l;
            i++, n++
        ) {
            arrayElementAdded(this, n, (this[n] = arguments[i])); // assign/raise your event
        }
        return n;
    },
});

function arrayElementAdded(val, n, other) {
    console.log(other);
}