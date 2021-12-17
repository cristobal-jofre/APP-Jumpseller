$(() => {
    getProducts();
});

let productSelected = [];
let products = [];
let totalProducts = 0;

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
            defaultContent: `<label>
                                <input type="checkbox" name="addCheck" class="editor-active" id="checkAll"> Seleccionar
                            </label>`,
        },
    ],
});

getProducts = async () => {
    try {
        const dataRaw = await fetch("./api/products/");
        if (dataRaw.status === 200) {
            const { data } = await dataRaw.json();
            tabla.clear();
            tabla.rows.add(data);
            tabla.draw();
            products = data;
            totalProducts = data.length;
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
        productSelected = productSelected.filter(
            (product) => product.id !== data.id
        );
    } else {
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
}

getPlans = async () => {
    let { accessToken, key, secret } = JSON.parse(
        localStorage.getItem("dataAccess")
    );

    const dataRequest = [];

    const config = {
        headers: {
            API_KEY: key,
            API_SECRET: secret,
            "x-access-token": accessToken,
        },
    };

    await Promise.all(
        productSelected.map(async (product) => {
            try{
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
            } catch (error){
                swal({
                    title: "Error",
                    icon: "error",
                    text: 'Ocurrió un error al obtener las categorias'
                });
            }
        })
    );

    await Promise.all(
        dataRequest.map(async (product) => {
            try{
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
                        const valueWarranty = getSkuAndValue(value.validity);
                        let valueCLP = new Intl.NumberFormat('es-CL', {currency: 'CLP', style: 'currency'}).format(value.priceCLP);
                        const variant = {
                            price: product.price, 
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
                        product.variants.push(variant);
                    });
                });
                product.variants.push({
                    price: product.price,
                    sku: `garantia-0`,
                    // description: 'AGREGA TU SEGURO CONTRA ACCIDENTES (VER MÁS DETALLES)',
                    stock: 100,
                    stock_unlimited: true,
                    options: [
                        {
                            name: name,
                            value: 'Sin Garantía',
                        },
                    ],
                });
            } catch (error) {
                swal({
                    title: "Error",
                    icon: "error",
                    text: 'Ocurrió un error al agregar las garantías'
                });
            }
        })
    );
    
    console.log("data request")
    console.log(dataRequest)

    let configAddWarranty = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({data:dataRequest}),
    };
    const rawResponseWarranty = await fetch("./api/products/addWarranty", configAddWarranty);

    if (rawResponseWarranty.status === 200) {
        swal({
            title: "¡ Éxito !",
            icon: "success",
            text: "Garantía extendida agregada exitosamente",
            button: "OK",
        })
    } else {
        throw new Error("Ocurrió un error al agregar las garantías extendidas");
    }
};

$("#checkAll").change(function () {
    $("input:checkbox").prop("checked", $(this).prop("checked"));

    if (productSelected.length == totalProducts) {// Todos seleccionados
        productSelected = [];
    } else if (productSelected.length > 0 && productSelected.length < totalProducts) {// Los borra y los vuelve a marcar
        productSelected = [];
        productSelected = products;
    } else {
        productSelected = products;
    }
});

$("#btnAdd").on("click", () => {
    getPlans();
});