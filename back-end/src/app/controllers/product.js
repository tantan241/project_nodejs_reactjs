const Brand = require("../models/Brand");
const Product = require("../models/Product");
class productController {
	getListProducts(req, res) {
		try {
			let fieldSort = req.body.sort.field;
			let searchField = req.body.search.field;
			searchField = searchField === "default" ? "" : searchField;
			let searchValue = req.body.search.value;
			searchValue = searchValue === "default" ? "" : searchValue;
			let searchType = req.body.search.type;

			Product.find(
				searchField && searchValue
					? { [searchField]: searchType === "text" ? { $regex: searchValue, $options: "i" } : searchValue }
					: {}
			)
				.sort(fieldSort ? { [fieldSort]: req.body.sort.sort === "asc" ? 1 : -1 } : undefined)
				.then((products) => {
					let limit = req.body["limit"];
					let page = req.body["page"];
					let count = products.length;
					const columns = [
						{ field: "stt", headerName: "STT", sortable: false, flex: 0.2, filterable: false },
						{ field: "name", headerName: "Tên Sản Phẩm", filterable: false, flex: 1.5, sortable: false },
						{ field: "price", headerName: "Giá", filterable: false, flex: 1, sortable: false },
						{ field: "discount", headerName: "Giảm Giá", filterable: false, flex: 0.5, sortable: false },
						{ field: "number", headerName: "Số Lượng", filterable: false, flex: 0.5, sortable: false },
						{ field: "type", headerName: "Loại sản phẩm", filterable: false, flex: 0.7, sortable: false },
						{ field: "brand", headerName: "Thương Hiệu", filterable: false, flex: 1, sortable: false },
						{ field: "status", headerName: "Trạng Thái", filterable: false, flex: 1, sortable: false },
					];
					const brands = Brand.find();
					let brandSearch = [];
					brandSearch.push({
						name: "--- Chọn giá trị ---",
						value: "default",
					});
					for (var i; i < brands.length; i++) {
						brandSearch.push({ name: brands[i]["name"], value: brands[i]["id"] });
					}
					const dataSearch = [
						{
							name: "--- Chọn giá trị ---",
							value: "default",
							type: "",
						},
						{
							name: "Tên Sản Phẩm",
							value: "name",
							type: "text",
						},
						{
							name: "Giá",
							value: "price",
							type: "number",
						},
						{
							name: "Giảm Giá",
							value: "discount",
							type: "number",
						},
						{
							name: "Thông Số",
							value: "specifications",
							type: "text",
						},
						{
							name: "Số Lượng",
							value: "number",
							type: "number",
						},
						{
							name: "Thương Hiệu",
							value: "brand",
							type: "select",
							select: brandSearch,
						},
						{
							name: "Loại sản phẩm",
							value: "type",
							type: "select",
							select: [
								{
									name: "--- Chọn giá trị ---",
									value: "default",
								},
								{
									name: "Phụ kiện",
									value: 1,
								},
								{
									name: "Điện thoại",
									value: 0,
								},
							],
						},
						{
							name: "Trạng thái",
							value: "status",
							type: "select",
							select: [
								{
									name: "--- Chọn giá trị ---",
									value: "default",
								},
								{
									name: "Hoạt động",
									value: "1",
								},
								{
									name: "Ngừng Hoạt động",
									value: "0",
								},
							],
						},
					];
					const dataFilter = [
						{ name: "Tên sản phẩm", value: "name" },
						{ name: "Giá sản phẩm", value: "price" },
						{ name: "Giảm giá", value: "discount" },
						{ name: "Số lượng còn", value: "number" },
					];
					const pageInfo = { limit: limit, page: page, count: count };
					const data = products.map((item, index) => ({
						...item._doc,
						stt: index + 1,
						id: item._id,
					}));
					res.json({
						status: 200,
						columns: columns,
						rows: data,
						pageInfo: pageInfo,
						dataSearch: dataSearch,
						dataFilter: dataFilter,
					});
				});
		} catch (error) {
			res.status(500).json({ error: "Internal Server Error" });
		}
	}
	async getOneProduct(req, res) {
		try {
			await Product.findOne({_id: req.params.id}).then((product) => {
				res.status(200).json({ status: 200, data: product });
			});
		} catch (error) {
           
            res.status(500).json({ error: "Internal Server Error" });
        }
	}
}

module.exports = new productController();
