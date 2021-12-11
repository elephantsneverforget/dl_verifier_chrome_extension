class Logger {
    static logToConsole(errors, verificationSummary) {
        console.group(
            "%c" + verificationSummary,
            "background-color: #e0005a ; color: #ffffff ; font-weight: bold ; padding: 4px ;"
        );
        if (errors) errors.forEach(error => console.log(error));
        console.groupEnd();
    }

    // static logToToast(message) {
        // Toastify({
        //     text: message,
        //     // duration: 5000,
        //     destination: "https://github.com/apvarun/toastify-js",
        //     newWindow: true,
        //     close: true,
        //     gravity: "top", // `top` or `bottom`
        //     position: "left", // `left`, `center` or `right`
        //     stopOnFocus: true, // Prevents dismissing of toast on hover
        //     style: {
        //         background: "linear-gradient(to right, #00b09b, #96c93d)",
        //     },
        //     onClick: function () { } // Callback after click
        // }).showToast();
    // }
}

const getEventNameSchema = function (eventName) {
    return joi.string().valid(eventName).required().messages({
        "any.required": `"event" is a required field on the data layer object and should contain and event name such as dl_view_item, dl_add_to_cart etc...`, })
};

const eventId = joi.string().min(7).required().messages({
    "any.required": `"event_id" is a required field. It should be a UUID like value.`,
});

class DLEvent {
    constructor(dataLayerObject) {
        this.dataLayerObject = dataLayerObject;
        this._verified = false;
        this._errors;
        this._verificationSummary;
        this._isValid;
    }

    verify(schemas, eventName) {
        if (this._verified === true)
            throw new Error("Can't call verify more than once.");
        const dlEventSchema = joi.object().keys({
            event: getEventNameSchema(eventName),
            event_id: eventId,
            ...schemas,
        });
        const validation = dlEventSchema.validate(this.dataLayerObject, {
            abortEarly: false,
            allowUnknown: true
        });

        if (validation.error) {
            this._isValid = false;
            this._errors = validation.error;
            this._verificationSummary = `${eventName} event with event_id ${this.dataLayerObject.event_id} is invalid`;
        } else {
            this._isValid = true;
            this._verificationSummary = `${eventName} event with event_id: ${this.dataLayerObject.event_id} is valid.`;
        }
        return validation;
    }

    getErrors() {
        return this._errors;
    }

    isValid() {
        return this._isValid;
    }

    getVerificationSummary() {
        return this._verificationSummary;
    }

    logVerificationOutcome() {
        // Log details in console
        Logger.logToToast(this._verificationSummary);
        // Log toast
        Logger.logToConsole(this._errors, this._verificationSummary);
    }
}

const products = joi
    .array()
    .items(
        joi.object({
            name: joi.string().min(1).required(),
            id: joi.string().min(2).required().messages({
                "any.required": `"id" is a required field on the ecommerce object and should represent the product SKU`,
            }),
            product_id: joi.string().min(5).required().messages({
                "any.required": `"product_id" is a required field on the ecommerce object and should represent the product ID.`,
            }),
            variant_id: joi.string().min(2).required().messages({
                "any.required": `"product_id" is a required field on the ecommerce object and should represent the Shopify variant ID.`,
            }),
            image: joi.string().required().messages({
                "any.required": `"image" is a required field on the ecommerce object and should be a valid URL.`,
            }),
            brand: joi.string().required().messages({
                "any.required": `"brand" is a required field on the ecommerce object.`,
            }),
            category: joi.string().required().messages({
                "any.required": `"category" is a required field on the ecommerce object.`,
            }),
            variant: joi.string().required().messages({
                "any.required": `"variant" is a required field on the ecommerce object.`,
            }),
            price: joi.string().required().messages({
                "any.required": `"price" is a required field on the ecommerce object.`,
            }),
        }) // Must match
    )
    .min(1)
    .required()
    .messages({
        "any.required": `You must have at least one product in the "products" array.`,
    });

const ecommerce = joi.object().keys({
    currencyCode: joi.string().min(3).max(3).required().messages({
        "any.required": `"currencyCode" is a required field on the ecommerce object and should contain a currency code such as "USD".`,
    }),
    detail: joi.object().keys({
        actionField: joi.object().keys({
            list: joi.string().required().messages({
                "any.required": `"list" is a required field on the actionField object and should contain the collection path to the product.`,
            }),
            action: joi.string().required().messages({
                "any.required": `"action" is a required field on the actionField object and should contain the string 'detail'`,
            }),
        }).required(),
        products: products
    }).required()
}).required().messages({
    'any.required': `"ecommerce" is a required field on the data layer object.`
});

const dl_view_item_schema_example = {
    "event": "dl_view_item",
    "event_id": "231f2c91-c2f3-421f-9d20-bb46a956e87a",
    "ecommerce": {
        "currencyCode": "USD",
        "detail": {
            "actionField": {
                "list": "/collections/games",
                "action": "detail"
            },
            "products": [
                {
                    "id": "CHESS-SET", // SKU
                    "name": "Gold Chess Set",
                    "brand": "Chess Inc.",
                    "category": "Games",
                    "variant": "Large Board",
                    "price": "199.00",
                    "list": "/collections/games",
                    "product_id": "7112843886744",
                    "variant_id": "41275778367640",
                    "compare_at_price": "0.0",
                    "image": "//cdn.shopify.com/s/files/1/0200/7616/products/arena-concrete-chess-set_f75103a8-2ecc-4d91-8d6c-d80b2501dbd7.png?v=1636459884",
                    "inventory": "20"
                }
            ]
        }
    },
};

class DLEventViewItem extends DLEvent {
    constructor(dataLayerObject) {
        super(dataLayerObject);
        this.schemaExample = dl_view_item_schema_example;
    }

    // Add anything additional to 'event_id' and 'event' that requires verification.
    verify() {
        return super.verify(
            {
                ecommerce: ecommerce,
            },
            "dl_view_item"
        );
    }
}

function evaluateDLEvent(dlEvent) {
    const dlEventName = dlEvent.event;
    const dlEventMap = {
        dl_view_item: DLEventViewItem,
        // 'dl_add_to_cart': DLAddToCart,
    };
    if (typeof dlEvent !== 'object') return;
    if (dlEventName in dlEventMap) {
        const dlEvent = new dlEventMap[dlEventName](dlEvent);
        dlEvent.verify();
        dlEvent.logVerificationOutcome();
    } else {
        console.log(
            "Event name: " +
                dlEventName +
                " not in available data layer verifiers"
        );
    }
}