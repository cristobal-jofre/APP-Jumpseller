$(() => {
    getProducts();
});

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
			defaultContent: `<checkbox>
									Seleccionar 
									<i class="fas fa-align-justify"></i>
							</checkbox>`,
		
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