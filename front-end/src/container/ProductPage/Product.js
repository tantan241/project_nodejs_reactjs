import { useCallback, useEffect, useState } from "react";
import { API_ADMIN, API_ADMIN_BRAND, API_GET_ALL_BRAND_FOR_PRODUCT } from "~/api";
import { fetchData } from "~/common";
import List from "~/components/List/List";
import { actions } from "~/store";
import useStore from "~/store/hooks";

function Product() {
	const [store, dispatch] = useStore();
	const [brands, setBrands] = useState(async function () {
		return await fetchData(
			API_ADMIN_BRAND,
			{
				limit: 10,
				page: 0,
				search: {
					field: "default",
					value: "default",
					type: "text",
				},
				sort: {
					field: "",
					sort: "asc",
				},
			},
			"POST",
			true
		).then((res) => {
			if (res.status === 200) {
                console.log(res.rows)
				setBrands(res.rows);
			}
		});
	});

	const mapFunction = useCallback(
		(data) => {
			return data.map((item) => ({
				...item,
				brand:
					Array.isArray(brands) && brands.find((it) => it.id === item.brand_id)
						? brands.find((it) => it.id === item.brand_id).name
						: "",
				price: item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ",
				discount: item.discount.toString() + " %",
				type: item.type === 0 ? "Điện Thoại" : item.type === 1 ? "Phụ Kiện" : "",
				status: item.status == 1 ? "Hoạt động" : "Ngừng hoạt động",
			}));
		},
		[brands]
	);
	return (
		<div style={{ width: "100%", marginLeft: "20px" }}>
			<List
				height={500}
				model={"product"}
				url={API_ADMIN}
				mapFunction={mapFunction}
				limit={100}
				skip={5}
				rowsPerPageOptions={[10, 30, 100]}
			></List>
		</div>
	);
}

export default Product;
