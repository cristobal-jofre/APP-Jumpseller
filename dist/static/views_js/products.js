$(() => {
    getProducts();
});

const mock = [
	{
		barcode: null,
		brand: null,
		categories: [{id: 1118803, name: "Televisor", description: null}],
		category: "Televisor",
		created_at: "2021-11-24 00:28:02 UTC",
		currency: "CLP",
		description: null,
		diameter: 0,
		discount: "0.0",
		featured: false,
		fields: [],
		google_product_category: null,
		height: 0,
		id: 12291340,
		length: 0,
		meta_description: null,
		name: "Televisor 2",
		package_format: "box",
		page_title: "Televisor 1",
		permalink: "televisor-1",
		price: 299990,
		shipping_required: true,
		sku: null,
		status: "available",
		stock: 0,
		stock_unlimited: true,
		updated_at: "2021-11-24 00:28:27 UTC",
		variants: [],
		weight: 1,
		width: 0
	}
]
const tabla = $("#table-productos").DataTable({
	language: {
		url: "//cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json",
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
			defaultContent: `<label><input type="checkbox" id="cbox1" value="first_checkbox"> Seleccionar </label>`, 				
		},
		{
			defaultContent: `<button type='button' name='dataButton' class='btn btn-info'>
									Agregar garantía extendida 
									<i class="fas fa-align-justify"></i>
							</button>`,
		}
	],
});

getProducts = async () => {
	try {
		const dataRaw = await fetch('./api/products/');
		if (dataRaw.status === 200) {
			const { data } = await dataRaw.json();
            console.log(data)
			tabla.clear();
			tabla.rows.add(data);
			tabla.draw();
		} else {
			throw new Error("Error al obtener los productos");
		}
	} catch (error) {
        console.log(error)
		swal({
			title: "Obtener Productos",
			icon: "error",
			text: error,
		});
	}
};