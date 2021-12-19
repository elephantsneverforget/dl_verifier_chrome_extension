class Logger {
    static logToConsole(errors, verificationSummary, additionalText) {
        if (errors.length > 1) {
            console.group(
                "%c" + verificationSummary + additionalText,
                "background-color: #e0005a ; color: #ffffff ; font-weight: bold ; padding: 4px ;"
            );
            errors.forEach((error) => console.log(error));
            console.groupEnd();
        } else {
            console.log(
                "%c" + verificationSummary + " " + additionalText,
                "background-color: #e0005a ; color: #ffffff ; font-weight: bold ; padding: 4px ;"
            );
        }
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

// This file contains all schemas to check dl items against.

const impressions = joi
    .array()
    .items(
        joi.object({
            name: joi.string().min(1).required(),
            id: joi.string().min(2).required().messages({
                "any.required": `"id" is a required field on the impressions array constituent objects and should represent the product SKU`,
            }),
            product_id: joi.string().min(5).required().messages({
                "any.required": `"product_id" is a required field on the impressions array constituent objects and should represent the product ID.`,
            }),
            variant_id: joi.string().min(2).required().messages({
                "any.required": `"product_id" is a required field on the impressions array constituent objects and should represent the Shopify variant ID.`,
            }),
            brand: joi.string().required().messages({
                "any.required": `"brand" is a required field on the impressions array constituent objects.`,
            }),
            category: joi.string().required().messages({
                "any.required": `"category" is a required field on the impressions array constituent objects.`,
            }),
            price: joi.string().required().messages({
                "any.required": `"price" is a required field on the impressions array constituent objects.`,
            }),
            position: joi.number().required().messages({
                "any.required": `"position" is a required field on the impressions array constituent objects. It should contain the position in the list for each array element. For example, the first element should be have the value 1(integer), the next, 2 etc...`,
            }),
            list: joi.string().required().messages({
                "any.required": `"list" is a required field on the impressions array constituent objects. It should contain the path to the collection. For example "/collections/toys"`,
            }),
        }) // Must match
    )
    .min(1)
    .required()
    .messages({
        "any.required": `You must have at least one product in the "impressions" array.`,
    });

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
            image: joi.string().messages({
                "any.required": `"image" is a required field on the ecommerce object and should be a valid URL.`,
            }),
            brand: joi.string().required().messages({
                "any.required": `"brand" is a required field on the ecommerce object.`,
            }),
            category: joi.string().required().messages({
                "any.required": `"category" is a required field on the ecommerce object.`,
            }),
            variant: joi.string().messages({
                "string.base": `"variant" should be a descriptive name of the product variant.`,
                "any.required": `"variant" is a required field on the ecommerce object.`,
            }),
            price: joi.string().required().messages({
                "any.required": `"price" is a required field on the ecommerce object.`,
            }),
            inventory: joi.string().messages({
                "any.required": `"inventory" is an optional field on the ecommerce object.`,
            }),
        }) // Must match
    )
    .min(1)
    .required()
    .messages({
        "any.required": `You must have at least one product in the "products" array.`,
    });

const eventId = joi.string().min(7).required().messages({
    "any.required": `"event_id" is a required field. It should be a UUID like value.`,
});

const cartTotal = joi.string().min(2).required().messages({
    "any.required": `"cart_total" is a required field. It should contain the total value of the cart.`,
});

const getEventNameSchema = function (eventName) {
    return joi.string().valid(eventName).required().messages({
        "any.required": `"event" is a required field on the data layer object and should contain and event name such as dl_view_item, dl_add_to_cart etc...`,
    });
};

const ecommerce = (conts) =>
    joi
        .object()
        .keys({
            currencyCode: joi.string().min(3).max(3).required().messages({
                "any.required": `"currencyCode" is a required field on the ecommerce object and should contain a currency code such as "USD".`,
            }),
            [conts["ecommerceSubFieldWrapper"]]: joi
                .object()
                .keys({
                    actionField: actionField(conts["actionField"]),
                    products: products,
                })
                .required(),
        })
        .required()
        .messages({
            "any.required": `"ecommerce" is a required field on the data layer object.`,
        });

const ecommerceWithoutWrapper = (actionField) =>
    joi
        .object()
        .keys({
            currencyCode: joi.string().min(3).max(3).required().messages({
                "any.required": `"currencyCode" is a required field on the ecommerce object and should contain a currency code such as "USD".`,
            }),
            ...(actionField && {
                actionField: actionField,
            }),
            impressions: impressions,
        })
        .required()
        .messages({
            "any.required": `"ecommerce" is a required field on the data layer object.`,
        });

const stringSchema = (message) =>
    joi.string().required().messages({
        "any.required": message,
    });

const actionField = (action) =>
    joi
        .object()
        .keys({ ...action })
        .required();

const userPropertiesLoggedIn = joi
    .object()
    .keys({
        visitor_type: joi
            .string()
            .pattern(new RegExp("^logged_in$"))
            .required()
            .messages({
                "any.required": `"visitor_type" is a required field on the user_properties object and should be one of "logged in" or "guest".`,
            }),
        customer_id: joi.string().required().messages({
            "any.required": `"customer_id" is a required field on the user_properties object and should contain the Shopify customer id.`,
        }),
        customer_email: joi.string().required().messages({
            "any.required": `"customer_email" is a required field on the user_properties object and should contain the customer email.`,
        }),
        customer_order_count: joi.string().required().messages({
            "any.required": `"customer_order_count" is a required field on the user_properties object and should contain the order count for the customer.`,
        }),
        customer_total_spent: joi.string().required().messages({
            "any.required": `"customer_total_spent" is a required field on the user_properties object and should contain the total spent by the customer.`,
        }),
    })
    .required()
    .messages({
        "any.required": `"user_properties" is a required field on the data layer object`,
    });

const userProperties = joi
    .object()
    .keys({
        visitor_type: joi
            .string()
            .pattern(new RegExp("^guest$"))
            .required()
            .messages({
                "any.required": `"visitor_type" is a required field on the user_properties object and should be one of "logged in" or "guest".`,
            }),
        user_id: joi.string().required().messages({
            "any.required": `"user_id" is a required field on the user_properties object and should contain the Shopify customer id.`,
        }),
        user_consent: joi.string().allow("").required().messages({
            "any.required": `"user_consent" is a required field on the user_properties object and should contain an empty string if no consent is present.`,
        }),
    })
    .required()
    .messages({
        "any.required": `"user_properties" is a required field on the data layer object`,
    });

class DLEvent {
    constructor(dataLayerObject) {
        this.dataLayerObject = dataLayerObject;
        this._verificationhasBeenRun = false;
        this._errors = [];
        this._verificationSummary;
        this._isValid;
    }

    verify(schemas, eventName) {
        if (this._verificationhasBeenRun === true)
            throw new Error("Can't call verify more than once on the same object.");
        const dlEventSchema = joi.object({
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
        this._verificationhasBeenRun = true;
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

    logVerificationOutcome(additionalText) {
        // Log details in console
        // Logger.logToToast(this._verificationSummary);
        // Log toast
        Logger.logToConsole(this._errors, this._verificationSummary, additionalText);
    }
}

const dl_view_item_schema_example = {
    event: "dl_view_item",
    event_id: "231f2c91-c2f3-421f-9d20-bb46a956e87a",
    ecommerce: {
        currencyCode: "USD",
        detail: {
            actionField: {
                list: "/collections/games",
                action: "detail",
            },
            products: [
                {
                    id: "CHESS-SET", // SKU
                    name: "Gold Chess Set",
                    brand: "Chess Inc.",
                    category: "Games",
                    variant: "Large Board",
                    price: "199.00",
                    list: "/collections/games",
                    product_id: "7112843886744",
                    variant_id: "41275778367640",
                    compare_at_price: "0.0",
                    image: "//cdn.shopify.com/s/files/1/0200/7616/products/arena-concrete-chess-set_f75103a8-2ecc-4d91-8d6c-d80b2501dbd7.png?v=1636459884",
                    inventory: "20",
                },
            ],
        },
    },
};

const dl_add_to_cart_schema_example = {
    event: "dl_add_to_cart",
    event_id: "887cb1e5-27ea-47c3-95a3-fdca8299e719",
    ecommerce: {
        currencyCode: "USD",
        add: {
            actionField: {
                list: "/collections/puzzles",
                action: "add",
            },
            products: [
                {
                    id: "0A-CLUE-BOX",
                    name: "Clue Puzzle",
                    brand: "iDVENTURE",
                    category: "Puzzles",
                    variant: "Clue puzzle size large",
                    price: "40",
                    quantity: "1",
                    list: "/collections/puzzles",
                    product_id: "5074792185993",
                    variant_id: "33922510782601",
                    image: "https://cdn.shopify.com/s/files/1/0200/7616/products/Cluebox-1_098a06ca-1389-46cc-b34e-ec85c86e99df.png?v=1636419558",
                },
            ],
        },
    },
};

const dl_begin_checkout_schema_example = {
    event: "dl_begin_checkout",
    event_id: "4b2be7b2-bf61-4959-b340-065d262da12a",
    ecommerce: {
        currencyCode: "USD",
        checkout: {
            actionField: {
                step: "1",
                action: "checkout",
            },
            products: [
                {
                    id: "LB00161-34689553170476",
                    name: "Lovebox Original Color & Photo",
                    brand: "Lovebox INC",
                    category: "Home,Living,Art & Objects,Tabletop",
                    variant: "USA plug",
                    price: "119.99",
                    quantity: "1",
                    list: "",
                    product_id: "6979886940352",
                    variant_id: "41141193965760",
                    image: "//cdn.shopify.com/s/files/1/0562/3916/1536/products/LBCP_First_FREN_1200x1200_14e856e9-cef5-4ed3-b5f6-22250cfcf128_small.png?v=1636136551",
                },
            ],
        },
    },
};

const dl_remove_from_cart_schema_example = {
    event: "dl_remove_from_cart",
    event_id: "07df1ccc-7a89-4be2-a863-b0a238080280",
    ecommerce: {
        currencyCode: "USD",
        remove: {
            actionField: {
                list: "/collections/puzzles",
            },
            products: [
                {
                    id: "0A-CLUE-BOX",
                    name: "Cluebox",
                    brand: "iDVENTURE",
                    category: "Puzzles",
                    variant: "Clue puzzle size large",
                    price: "40",
                    quantity: "1",
                    list: "/collections/puzzles",
                    product_id: "5074792185993",
                    variant_id: "33922510782601",
                    image: "https://cdn.shopify.com/s/files/1/0200/7616/products/Cluebox-1_098a06ca-1389-46cc-b34e-ec85c86e99df.png?v=1636419558",
                },
            ],
        },
    },
};

const dl_search_results_schema_example = {
    event: "dl_search_results",
    event_id: "ee8eb7ca-8db2-4cc6-b875-2398b66b8ffe",
    ecommerce: {
        currencyCode: "USD",
        actionField: {
            list: "search results",
        },
        impressions: [
            {
                id: "4-AUDUBON-BIRDCALL",
                name: "Audubon Bird Call",
                brand: "American Bird Products, Inc.",
                category: "Toys",
                price: "8.0",
                position: 0,
                list: "/collections/toys",
                product_id: "4400067903625",
                variant_id: "31410300551305",
            },
            {
                id: "5-FLIPBOOK-KIT-BLANK",
                name: "FlipBooKit",
                brand: "Art of Play",
                category: "Toys",
                price: "35.0",
                position: 2,
                list: "/collections/toys",
                product_id: "7846286032",
                variant_id: "41275883683992",
            },
            {
                id: "5-MYSTERY-TOP",
                name: "Mystery Top",
                brand: "Art of Play",
                category: "Toys",
                price: "12.0",
                position: 3,
                list: "/collections/toys",
                product_id: "1856914849850",
                variant_id: "18298859880506",
            }
        ],
    },
};

const dl_view_cart_schema_example = {
    event: "dl_view_cart",
    event_id: "e06ba901-57c9-41ee-89f0-28ea91258230",
    cart_total: "26.99",
    ecommerce: {
        currencyCode: "USD",
        actionField: {
            list: "Shopping Cart",
        },
        impressions: [
            {
                id: "4-AUDUBON-BIRDCALL",
                name: "Audubon Bird Call",
                brand: "American Bird Products, Inc.",
                category: "Toys",
                price: "8.0",
                position: 0,
                list: "/collections/toys",
                product_id: "4400067903625",
                variant_id: "31410300551305",
                quantity: 1,
            },
            {
                id: "5-FLIPBOOK-KIT-BLANK",
                name: "FlipBooKit",
                brand: "Art of Play",
                category: "Toys",
                price: "35.0",
                position: 1,
                list: "/collections/toys",
                product_id: "7846286032",
                variant_id: "41275883683992",
                quantity: 2,
            },
        ],
    },
};

const dl_view_item_list_schema_example = {
    event: "dl_view_item_list",
    event_id: "2b0c5796-7abe-4465-8e24-0ffade4699df",
    ecommerce: {
        currencyCode: "USD",
        impressions: [
            {
                id: "4-AUDUBON-BIRDCALL",
                name: "Audubon Bird Call",
                brand: "American Bird Products, Inc.",
                category: "Toys",
                price: "8.0",
                position: 9,
                list: "/collections/toys",
                product_id: "4400067903625",
                variant_id: "31410300551305",
            },
            {
                id: "5-FLIPBOOK-KIT-BLANK",
                name: "FlipBooKit",
                brand: "Art of Play",
                category: "Toys",
                price: "35.0",
                position: 10,
                list: "/collections/toys",
                product_id: "7846286032",
                variant_id: "41275883683992",
            },
            {
                id: "5-MYSTERY-TOP",
                name: "Mystery Top",
                brand: "Art of Play",
                category: "Toys",
                price: "12.0",
                position: 11,
                list: "/collections/toys",
                product_id: "1856914849850",
                variant_id: "18298859880506",
            }
        ],
    },
};

const dl_select_item_schema_example = {
    event: "dl_select_item",
    event_id: "0446f7d6-070d-44e7-b355-06a27d0fc312",
    ecommerce: {
        currencyCode: "USD",
        click: {
            actionField: {
                list: "/collections/toys",
                action: "click",
            },
            products: [
                {
                    id: "5-TIPPY-TOP-WALNUT",
                    name: "Wooden Tippe Tops",
                    brand: "Mader Kreiselmanufaktur",
                    category: "Toys",
                    price: "12.0",
                    position: 5,
                    list: "/collections/toys",
                    product_id: "9229206160",
                    variant_id: "36638578960",
                },
            ],
        },
    },
};

const dl_user_data_schema_example = {
    event: "dl_user_data",
    event_id: "8ff28e85-0503-484e-bb86-53110aba98fb",
    cart_total: "85.0",
    user_properties: {
        visitor_type: "guest",
        user_consent: "",
        user_id: "208765e8-4f21-4168-bd20-cb799e0afddd",
    },
};

const dl_login_schema_example = {
    event: "dl_login",
    event_id: "0446f7d6-070d-44e7-b355-06a27d0fc312", // unique uuid for FB conversion API
    user_properties: {
        visitor_type: "logged_in",
        customer_id: "128746109283371019823", // Shopify customer id
        customer_email: "customer@gmail.com",
        customer_order_count: "2",
        customer_total_spent: "126.00",
    },
};

const dl_sign_up_schema_example = {
    event: "dl_sign_up",
    event_id: "0446f7d6-070d-44e7-b355-06a27d0fc312", // unique uuid for FB conversion API
    user_properties: {
        visitor_type: "logged_in",
        customer_id: "128746109283371019823", // Shopify customer id
        customer_email: "customer@gmail.com",
        customer_order_count: "2",
        customer_total_spent: "126.00",
    },
};

class DLEventUserData extends DLEvent {
    constructor(dataLayerObject) {
        super(dataLayerObject);
        this.schemaExample = dl_user_data_schema_example;
    }

    logVerificationOutcome() {
        super.logVerificationOutcome("If your user is logged in ensure the user_properties object is using the logged in version with email address, order_count etc...");
    }

    verify() {
        return super.verify(
            { cart_total: cartTotal, user_properties: userProperties },
            "dl_user_data"
        );
    }
}

class DLEventLogin extends DLEvent {
    constructor(dataLayerObject) {
        super(dataLayerObject);
        this.schemaExample = dl_login_schema_example;
    }

    verify() {
        return super.verify(
            { user_properties: userPropertiesLoggedIn },
            "dl_login"
        );
    }
}

class DLEventSignUp extends DLEvent {
    constructor(dataLayerObject) {
        super(dataLayerObject);
        this.schemaExample = dl_sign_up_schema_example;
    }

    verify() {
        return super.verify(
            { user_properties: userPropertiesLoggedIn },
            "dl_sign_up"
        );
    }
}

class DLEventViewItem extends DLEvent {
    constructor(dataLayerObject) {
        super(dataLayerObject);
        this.schemaExample = dl_view_item_schema_example;
    }

    verify() {
        return super.verify(
            ecommerceFactory("detail", {
                list: stringSchema(
                    `"list" is a required field on the actionField object and should contain the collection path to the product.`
                ),
                action: stringSchema(
                    `"action" is a required field on the actionField object and should contain the string "detail"`
                ),
            }),
            "dl_view_item"
        );
    }
}

class DLEventAddToCart extends DLEvent {
    constructor(dataLayerObject) {
        super(dataLayerObject);
        this.schemaExample = dl_add_to_cart_schema_example;
    }

    verify() {
        super.verify(
            ecommerceFactory("add", {
                list: stringSchema(
                    `"list" is a required field on the actionField object and should contain the collection path to the product.`
                ),
                action: stringSchema(
                    `"action" is a required field on the actionField object and should contain the string "add"`
                ),
            }),
            "dl_add_to_cart"
        );
    }
}

class DLEventBeginCheckout extends DLEvent {
    constructor(dataLayerObject) {
        super(dataLayerObject);
        this._schemaExample = dl_begin_checkout_schema_example;
    }

    verify() {
        super.verify(
            ecommerceFactory("checkout", {
                step: stringSchema(
                    `"step" is a required field on the actionField object and should contain the string "1".`
                ),
                action: stringSchema(
                    `"action" is a required field on the actionField object and should contain the string "checkout"`
                ),
            }),
            "dl_begin_checkout"
        );
    }
}

class DLEventRemoveFromCart extends DLEvent {
    constructor(dataLayerObject) {
        super(dataLayerObject);
        this._schemaExample = dl_remove_from_cart_schema_example;
    }

    verify() {
        super.verify(
            ecommerceFactory("remove", {
                list: stringSchema(
                    `"list" is a required field on the actionField object and should contain the collection the product is from. For example "/collections/puzzles".`
                ),
            }),
            "dl_remove_from_cart"
        );
    }
}

class DLEventSelectItem extends DLEvent {
    constructor(dataLayerObject) {
        super(dataLayerObject);
        this._schemaExample = dl_select_item_schema_example;
    }

    verify() {
        super.verify(
            ecommerceFactory("click", {
                list: stringSchema(
                    `"list" is a required field on the actionField object and should contain the collection the product is from. For example "/collections/puzzles".`
                ),
                action: stringSchema(
                    `"action" is a required field on the actionField object and should contain the string "click"`
                ),
            }),
            "dl_select_item"
        );
    }
}

class DLEventSearchResults extends DLEvent {
    constructor(dataLayerObject) {
        super(dataLayerObject);
        this._schemaExample = dl_search_results_schema_example;
    }

    verify() {
        super.verify(
            {
                ecommerce: ecommerceWithoutWrapper({
                    actionField: {
                        list: stringSchema({
                            "any.required": `"list" is a required field on the action field object. It should contain the string "search results"`,
                        }),
                    },
                }),
            },
            "dl_search_results"
        );
    }
}

class DLEventViewCart extends DLEvent {
    constructor(dataLayerObject) {
        super(dataLayerObject);
        this._schemaExample = dl_view_cart_schema_example;
    }

    verify() {
        super.verify(
            {
                cart_total: cartTotal,
                ecommerce: ecommerceWithoutWrapper({
                    actionField: {
                        list: stringSchema({
                            "any.required": `"list" is a required field on the action field object. It should contain the string "shopping cart"`,
                        }),
                    },
                }),
            },
            "dl_view_cart"
        );
    }
}

class DLEventViewItemList extends DLEvent {
    constructor(dataLayerObject) {
        super(dataLayerObject);
        this._schemaExample = dl_view_item_list_schema_example;
    }

    verify() {
        super.verify(
            {
                ecommerce: ecommerceWithoutWrapper(),
            },
            "dl_view_item_list"
        );
    }
}

function ecommerceFactory(subField, fields) {
    return {
        // action field builder + pass name of field that's not currency.
        ecommerce: ecommerce({
            ecommerceSubFieldWrapper: subField,
            actionField: {
                ...fields,
            },
        }),
    };
}

function evaluateDLEvent(dlEventObject) {
    const dlEventName = dlEventObject.event;
    const dlEventMap = {
        dl_add_to_cart: DLEventAddToCart,
        dl_begin_checkout: DLEventBeginCheckout,
        dl_login: DLEventLogin,     
        dl_remove_from_cart: DLEventRemoveFromCart,
        dl_search_results: DLEventSearchResults,
        dl_select_item: DLEventSelectItem,
        dl_sign_up: DLEventSignUp,
        dl_user_data: DLEventUserData,
        dl_view_cart: DLEventViewCart,
        dl_view_item_list: DLEventViewItemList,
        dl_view_item: DLEventViewItem,
    };
    if (typeof dlEventObject !== "object") return;
    if (dlEventName in dlEventMap) {
        const dlEvent = new dlEventMap[dlEventName](dlEventObject);
        dlEvent.verify();
        dlEvent.logVerificationOutcome();
    }
}