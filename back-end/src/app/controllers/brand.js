const Brand = require("../models/Brand");

class brandController {
	getListBrand(req, res) {
		try {
			let fieldSort = req.body.sort.field;
			let searchField = req.body.search.field;
			searchField = searchField === "default" ? "" : searchField;
			let searchValue = req.body.search.value;
			searchValue = searchValue === "default" ? "" : searchValue;
			let searchType = req.body.search.type;

			Brand.find(
				searchField && searchValue
					? { [searchField]: searchType === "text" ? { $regex: searchValue, $options: "i" } : searchValue }
					: {}
			)
				.sort(fieldSort ? { [fieldSort]: req.body.sort.sort === "asc" ? 1 : -1 } : undefined)
				.then((brands) => {
					let limit = req.body["limit"];
					let page = req.body["page"];
					let count = brands.length;
					const columns = [
						{ field: "stt", headerName: "STT", sortable: false, flex: 0.2, filterable: false },
						{ field: "name", headerName: "Tên Thương Hiệu", sortable: false, filterable: false, flex: 1 },
						{ field: "status", headerName: "Trạng Thái", filterable: false, flex: 1, sortable: false },
					];
					const dataSearch = [
						{
							name: "--- Chọn giá trị ---",
							value: "default",
							type: "",
						},
						{
							name: "Tên thương hiệu",
							value: "name",
							type: "text",
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
					const dataFilter = [{ name: "Tên thương hiệu", value: "name" }];
					const pageInfo = { limit: limit, page: page, count: count };
					const data = brands.map((item, index) => ({
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
	addNewBrand(req, res) {
		try {
			const newItem = new Brand(req.body);
			const savedItem = newItem.save();
			res.status(201).json({ status: 200, data: savedItem, messenger: "Thêm mới thành công" });
		} catch (error) {
			res.status(500).json({ error: "Internal Server Error" });
		}
	}
	async deleteBrand(req, res) {
		try {
			let listIds = JSON.parse(req.query.ids);
			for (var i = 0; i < listIds.length; i++) {
				await Brand.findByIdAndDelete(listIds[i]);
			}
			res.status(200).json({ messenger: "Xóa thành công", status: 200 });
		} catch (error) {
			res.status(500).json({ error: "Internal Server Error" });
		}
	}
	getBrandDetail(req, res) {
		try {
			Brand.findById(req.params.id).then((brand) => {
				res.status(200).json({ status: 200, data: brand });
			});
		} catch (error) {
			res.status(500).json({ error: "Internal Server Error" });
		}
	}
	async updateBrand(req, res) {
		try {
			const id = req.params.id;
			const data = req.body;

			const options = { new: true, runValidators: true };
			const updatedBrand = await Brand.findOneAndUpdate({ _id: id }, data, options);
			if (updatedBrand) {
				res.status(200).json({ data: updatedBrand, status: 200, messenger: "Update thành công" });
			} else {
				res.status(404).json({ error: "Item not found" });
			}
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}
}

module.exports = new brandController();
