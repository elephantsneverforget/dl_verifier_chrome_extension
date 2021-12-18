function dataLayerElementPushed(dlEventObject) {
    evaluateDLEvent(dlEventObject)
}

// Polling here because overriding the push method on window.dataLayer caused issuese in GTM preview mode

(function () {
    let lastIndexProcessed = 0;
    window.dataLayer = window.dataLayer || [];
    setInterval(function () {
        for (
            ;
            lastIndexProcessed < window.dataLayer.length;
            lastIndexProcessed++
        ) {
            dataLayerElementPushed(window.dataLayer[lastIndexProcessed]);
        }
    }, 1000);
})();
