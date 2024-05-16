import { Button, Grid, MenuItem, Paper, TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { actions } from "~/store";
import useStore from "~/store/hooks";
import { useNavigate } from "react-router-dom";
import { fetchData, handleClickVariant } from "~/common";
import { API_ADD_BRAND, API_ADMIN_BRAND, API_GET_ONE_BRAND } from "~/api";
import { enqueueSnackbar } from "notistack";

function BrandPageEdit() {
	const [store, dispatch] = useStore();
	const navigate = useNavigate();
	const [valuesState, setValueState] = useState({ name: "", status: 1 });
	const pathNameSplit = window.location.pathname ? window.location.pathname.split("/") : ["", "", ""];
	const options = [
		{
			value: 1,
			label: "Hoạt động",
		},
		{
			value: 0,
			label: "Ngừng hoạt động",
		},
	];

	useEffect(() => {
		dispatch(actions.setReload(new Date() * 1));
		if (pathNameSplit[2] && pathNameSplit[2] !== "add") {
			fetchData(`${API_ADMIN_BRAND}/${pathNameSplit[2]}`, {}, "GET", true).then((res) => {
				if (res.status === 200) {
					setValueState(res.data);
				}
			});
		}
	}, []);
	const handleInputChange = useCallback((name, value) => {
		setValueState((prev) => ({ ...prev, [name]: value }));
	}, []);

	const handleSave = useCallback(() => {
		if (!valuesState.name) {
			handleClickVariant("warning", "Vui lòng nhập đủ thông tin", enqueueSnackbar);
			return;
		}
		if (pathNameSplit[2] && pathNameSplit[2] !== "add") {
			fetchData(`${API_ADMIN_BRAND}/${pathNameSplit[2]}`, valuesState, "POST", true).then((res) => {
				if (res.status === 200) {
					handleClickVariant("success", res.messenger, enqueueSnackbar);
					navigate("/brand");
				}
			});
		} else {
			fetchData(API_ADD_BRAND, valuesState, "POST", true).then((res) => {
				if (res.status === 200) {
					handleClickVariant("success", res.messenger, enqueueSnackbar);
					navigate("/brand");
				}
			});
		}
	}, [valuesState]);
	return (
		<Paper style={{ padding: "50px" }}>
			<Grid container spacing={4}>
				<Grid item xs={6}>
					<TextField
						label="Tên thương hiệu"
						fullWidth
						type="text"
						value={valuesState.name}
						onChange={(e) => handleInputChange("name", e.target.value)}
					></TextField>
				</Grid>
				<Grid item xs={6}>
					<TextField
						label="Trạng thái"
						fullWidth
						select
						value={valuesState.status}
						onChange={(e) => {
							handleInputChange("status", e.target.value);
						}}
					>
						{options.map((item) => (
							<MenuItem key={item.value} value={item.value}>
								{item.label}
							</MenuItem>
						))}
					</TextField>
				</Grid>
				<Grid item xs={8}></Grid>
				<Grid item xs={4} width={"100%"}>
					<Grid container spacing={1}>
						<Grid item xs={6}></Grid>
						<Grid item xs={3}>
							<Button variant="contained" onClick={() => handleSave()}>
								Lưu
							</Button>
						</Grid>
						<Grid item xs={3}>
							<Button
								variant="contained"
								color="error"
								onClick={() => {
									dispatch(actions.setReload(new Date() * 1));
									navigate("/brand");
								}}
							>
								Hủy bỏ
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Paper>
	);
}
export default BrandPageEdit;
