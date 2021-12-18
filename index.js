// initial = false
window.dataLayer = window.dataLayer || [];
__firstCall = true;
Object.defineProperty(window.dataLayer, "push", {
    // hide from for..in and prevent further overrides (via default descriptor values)
    value: function () {
        if (__firstCall) {
            this.forEach((arrayItemAlreadyPresent) =>
                dataLayerElementPushed(arrayItemAlreadyPresent)
            );
            __firstCall = false;
        }
        existingArrayLength = this.length;
        newArrayItemsToAppend = arguments;
        for (
            var i = 0;
            i < newArrayItemsToAppend.length;
            i++, existingArrayLength++
        ) {
            this[existingArrayLength] = arguments[i]; 
            if (typeof arguments[i] !== "object") return;
            dataLayerElementPushed(this[existingArrayLength]); // assign/raise your event
        }
        return existingArrayLength;
    },
});

function dataLayerElementPushed(other) {
    console.log(other);
}
