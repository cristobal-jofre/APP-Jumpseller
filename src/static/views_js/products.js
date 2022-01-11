
$(() => {
    getProducts();
});

let productSelected = [];
let products = [];
let totalProducts = 0;
let productsWithWarranty = [];

const tabla = $("#table-products").DataTable({
    language: {
        url: "//cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json",
    },
    columnDefs: [
        {
            orderable: false,
            className: "select-checkbox",
            targets: 0,
        },
    ],
    select: {
        style: "os",
        selector: "td:first-child",
    },
    columns: [
        {
            data: "category",
        },
        {
            data: "name",
        },
        {
            data: "price",
            render: function (data, type, row) {
                return `$${parseInt(row.price).toLocaleString("de-DE")}`;
            },
        },
        {
            render: function (data, type, row) {
                if (row.variants.length > 0) {
                    return `<label>
                                <input disabled type="checkbox" name="addCheck" class="editor-active" id="checkAll"> Este producto ya tiene garantía
                            </label>`;
                } else {
                    if (row.selected) {
                        return `<label>
                                <input  type="checkbox" checked name="addCheck" class="editor-active" id="checkAll"> Seleccionar
                                </label>`;
                    } else {
                        return `<label>
                                    <input  type="checkbox" name="addCheck" class="editor-active" id="checkAll"> Seleccionar
                                </label>`;
                    }
                }
            },
        },
        {
            render: function (data, type, row) {
                if (row.variants.length > 0) {
                    return `<button  type='button' name='deleteButton' class='btn btn-danger'>
									Eliminar <i class="fas fa-trash-alt"></i>
							</button>`;
                } else {
                    return `<button disabled type='button' name='deleteButton' class='btn btn-danger'>
									Eliminar <i class="fas fa-trash-alt"></i>
							</button>`;
                }
            }

        },
    ],
});


getToken = async () => {
    try {
        const data = await fetch("./api/orders");
    } catch (error) {
        swal({
            title: "Obtener token",
            icon: "error",
            text: error,
        });
    }
};

getProducts = async () => {
    try {
        const dataRaw = await fetch("./api/products/");
        if (dataRaw.status === 200) {
            const { data } = await dataRaw.json();
            const dataProducts = data.map(product => {
                if (product.variants.length > 0) {
                    productsWithWarranty.push(product);
                }
                return { ...product, 'selected': false }
            })
            productSelected = [];
            renderTable(dataProducts);
            products = dataProducts;
            totalProducts = dataProducts.length;
        } else {
            throw new Error("Error al obtener los productos");
        }
    } catch (error) {
        swal({
            title: "Obtener Productos",
            icon: "error",
            text: error,
        });
    }
};

$("#table-products").on("change", "input.editor-active", function () {
    let data = tabla.row($(this).parents("tr")).data();

    const isProduct = productSelected.find((product) => product.id === data.id);

    if (isProduct) {
        data.selected = false;
        productSelected = productSelected.filter(
            (product) => product.id !== data.id
        );
    } else {
        data.selected = true;
        productSelected.push(data);
    }
});

getSkuAndValue = validity => {
    const mapper = {
        "M": "Meses",
    }
    const { quantity, unit } = validity;

    const valueWarranty = `${quantity} ${mapper[unit]}`;
    return valueWarranty;
};

getCategories = async (productSelected, config) => {
    const dataRequest = [];

    await Promise.all(
        productSelected.map(async (product) => {
            if (product.selected) {
                const rawResponseCategory = await fetch(
                    `http://localhost:3001/vault-perk/api/v1/category/getNameByLabel/${product.category}`,
                    config
                );
                const { category } = await rawResponseCategory.json();
                dataRequest.push({
                    idProduct: product.id,
                    category,
                    price: product.price,
                });
            }
        })
    );

    return dataRequest;
}

getPlans = async (dataRequest, config) => {
    await Promise.all(
        dataRequest.map(async (product) => {
            const rawResponse = await fetch(
                `http://localhost:3001/vault-perk/api/v1/plan/get?price=${product.price}&category=${product.category}&type=gext`,
                config
            );
            const { plans } = await rawResponse.json();
            product.variants = [];
            let name = "";

            plans.forEach((plan) => {
                const { values } = plan;
                values.forEach((value, index) => {
                    let valueWarranty = getSkuAndValue(value.validity);
                    let valueCLP = new Intl.NumberFormat('es-CL', { currency: 'CLP', style: 'currency' }).format(value.priceCLP);

                    const variant = {
                        price: product.price + value.priceCLP,
                        sku: `garantia-${index + 1}`,
                        stock: 100,
                        stock_unlimited: true,
                        options: [
                            {
                                name: plan.name,
                                value: `${valueWarranty} - ${valueCLP}`,
                            },
                        ],
                    };
                    name = plan.name;
                    if (index === 0) {
                        product.variants.push({
                            price: product.price,
                            sku: `garantia-0`,
                            stock: 100,
                            stock_unlimited: true,
                            options: [
                                {
                                    name: name,
                                    value: 'Sin Garantía',
                                    test: value.priceCLP,
                                },
                            ],
                        });
                    }
                    product.variants.push(variant);
                });
            });
        })
    );

    return dataRequest;
}

addPlans = async () => {
    try {
        let { accessToken, key, secret } = JSON.parse(
            localStorage.getItem("dataAccess")
        );

        const config = {
            headers: {
                API_KEY: key,
                API_SECRET: secret,
                "x-access-token": accessToken,
            },
        };

        let dataRequest = [];

        dataRequest = getCategories(productSelected, config);
        dataRequest = getPlans(dataRequest, config);

        let configAddWarranty = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: dataRequest }),
        };

        const rawResponseWarranty = await fetch("./api/products/addWarranty", configAddWarranty);

        if (rawResponseWarranty.status === 200) {
            swal({
                title: "¡ Éxito !",
                icon: "success",
                text: "Garantía extendida agregada exitosamente",
                button: "OK",
            }).then(() => {
                getProducts();
            })

            if (dataRequest.length === 0) {
                swal({
                    title: "Error",
                    icon: "error",
                    text: 'Ocurrió un error al agregar las garantías'
                });
            }
        } else {
            throw new Error("Ocurrió un error al agregar las garantías extendidas");
        }

    } catch (error) {
        swal({
            title: "Error",
            icon: "error",
            text: 'Ocurrió un error al agregar las garantías'
        });
    }
};

$("#table-products").on("click", "button", function () {
    let data = tabla.row($(this).parents("tr")).data();
    if ($(this)[0].name == "deleteButton") {
        swal({
            title: `Eliminar garantía`,
            icon: "warning",
            text: `¿Está seguro/a de eliminar la garantía de "${data.name}"?`,
            buttons: {
                confirm: {
                    text: "Eliminar",
                    value: "exec",
                },
                cancel: {
                    text: "Cancelar",
                    value: "cancelar",
                    visible: true,
                },
            },
        }).then((action) => {
            if (action == "exec") {
                deleteWarranty(data);
            } else {
                swal.close();
            }
        });
    }
});

deleteWarranty = async (data) => {
    const { id, variants } = data;

    if (variants.length == 0) {
        swal({
            title: "Error",
            icon: "error",
            text: 'Producto no tiene garantía'
        });
        return;
    }

    let configdeleteWarranty = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idProduct: id, options: variants[0].options[0].product_option_id }),
    };

    try {
        const rawResponsedelete = await fetch("./api/products/deleteWarranty", configdeleteWarranty);

        if (rawResponsedelete.status === 200) {
            swal({
                title: "¡ Éxito !",
                icon: "success",
                text: "Garantía extendida eliminada ",
                button: "OK",
            }).then(() => {
                getProducts();
            })
        } else {
            throw new Error("Ocurrió un error al eliminar las garantías extendidas");
        }

    } catch (error) {
        swal({
            title: "Error",
            icon: "error",
            text: 'Ocurrió un error al eliminar las garantías'
        });
    }
};

$("#btnSelect").on("click", function () {
    if (productSelected.length == totalProducts) { // Todos seleccionados
        productSelected = [];
        renderTable(products);
    } else {
        productSelected = []
        productsWithoutWarranty = getProductsNotChecked(products, productsWithWarranty);
        productSelected = productsWithoutWarranty.map((product) => {
            return { ...product, 'selected': true }
        });
        productsWithWarranty.forEach((product) => {
            productSelected.push(product);
        })
        renderTable(productSelected);
    }
});

removeItemFromArray = (array, item) => {
    return array.filter(value => {
        return value.id !== item.id;
    });
};


getProductsNotChecked = (products, productsWithWarranty) => {
    if (productsWithWarranty.length > 0) {
        productsWithWarranty.forEach((product) => {
            products = removeItemFromArray(products, product);
        });
    }
    return products;
}

renderTable = (data) => {
    tabla.clear();
    tabla.rows.add(data);
    tabla.draw();
}

$("#btnAdd").on("click", () => {
    addPlans();
});
