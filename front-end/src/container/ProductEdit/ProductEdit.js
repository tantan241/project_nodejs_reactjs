import {
	Box,
	Button,
	Dialog,
	FormHelperText,
	Grid,
	Input,
	InputAdornment,
	InputLabel,
	MenuItem,
	Paper,
	Tab,
	Tabs,
	TextField,
	Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import {  API_ADMIN_PRODUCT, API_UPLOAD_IMAGE, URL_IMAGE, API_ADMIN_BRAND } from "~/api";
import { fetchData, handleClickVariant } from "~/common";
import InputUploadImage from "~/components/InputUploadImage/InputUploadImage";
import { ACCESS_TOKEN } from "~/constants";
import { actions } from "~/store";
import useStore from "~/store/hooks";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "./ProductEdit.css";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import CommentPage from "../CommentPage/CommentPage";
import { setReload } from "~/store/actions";
function ProductEdit() {
	const typeAccessory = [
		{
			id: 0,
			value: "Ốp lưng",
		},
		{
			id: 1,
			value: "Tai nghe dây",
		},
		{
			id: 2,
			value: "Tai nghe bluetooth",
		},
		{
			id: 3,
			value: "Sạc pin",
		},
		{
			id: 4,
			value: "Sạc dự phòng",
		},
	];
	const [store, dispatch] = useStore();
	const [tab, setTab] = useState(1);
	const navigate = useNavigate();
	const [file, setFile] = useState();
	const [nameImage, setNameImage] = useState("");
	const [nameImages, setNameImages] = useState([]);
	const [files, setFiles] = useState({ file1: "", file2: "", file3: "", file4: "", file5: "", file6: "" });
	const [urls, setUrls] = useState({ file: "", file1: "", file2: "", file3: "", file4: "", file5: "", file6: "" });
	const pathNameSplit = window.location.pathname ? window.location.pathname.split("/") : ["", "", ""];
	const [dialogImage, setDialogImage] = useState({
		open: false,
		image: "",
	});
	const [localValues, setLocalValues] = useState({
		name: "",
		price: "",
		discount: 0,
		type: 0,
		typeAccessory: 0,
		brandId: 1,
		number: "",
		status: 1,
	});
	const [brands, setBrands] = useState([]);
	const [specifications, setSpecifications] = useState([
		{ name: "ram", title: "Ram", value: "" },
		{ name: "rom", title: "Rom", value: "" },
		{ name: "display", title: "Màn Hình", value: "" },
		{ name: "system", title: "Hệ Điều Hành", value: "" },
		{ name: "front_camera", title: "Camera Trước", value: "" },
		{ name: "rear_camera", title: "Camera Sau", value: "" },
		{ name: "chip", title: "Chíp", value: "" },
		{ name: "sim", title: "Sim", value: "" },
		{ name: "battery", title: "Pin", value: "" },
	]);
	const getValueFiled = useCallback(
		(name) => {
			return specifications.find((item) => item.name === name)
				? specifications.find((item) => item.name === name).value
				: "";
		},
		[specifications]
	);
	const handleSpecificationsChange = useCallback((name, value) => {
		setSpecifications((prev) => prev.map((item) => (item.name === name ? { ...item, value } : item)));
	}, []);
	useEffect(() => {
		fetchData(
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
				const brandActive = res.rows.filter((item) => item.status === 1);
				setBrands(brandActive.map((item) => ({ name: item.name, value: item.id })));
			}
		});
		dispatch(actions.setReload(new Date() * 1));
		if (pathNameSplit[2] && pathNameSplit[2] !== "add") {
			fetchData(`${API_ADMIN_PRODUCT}/${pathNameSplit[2]}`, {}, "GET", true).then((res) => {
				if (res.status === 200) {
					setNameImage(res.data.image);

					setNameImages(res.data.images);
					setUrls({ file: `${URL_IMAGE}/${res.data.image}` });
					setSpecifications(res.data.specifications);
					setLocalValues({
						id: res.data._id,
						description: res.data.description,
						name: res.data.name,
						price: res.data.price,
						discount: res.data.discount,
						type: res.data.type,
						typeAccessory: res.data.typeAccessory,
						brandId: res.data.brandId,
						number: res.data.number,
						status: res.data.status,
					});
					res.data.images.forEach((item, index) => {
						setUrls((prev) => ({ ...prev, [`file${index + 1}`]: `${URL_IMAGE}/${item}` }));
					});
				}
			});
		}
	}, []);

	const handleImageClick = useCallback((value) => {
		setDialogImage(value);
	}, []);
	const handleFilesChange = useCallback(
		(name, value) => {
			if (value) {
				setUrls((prev) => ({ ...prev, [name]: URL.createObjectURL(value) }));
				setFiles((prev) => ({ ...prev, [name]: value }));
			}
		},
		[localValues]
	);
	const handleInputMainChange = useCallback((name, value) => {
		setLocalValues((prev) => ({ ...prev, [name]: value }));
	}, []);

	async function handleSave() {
		const token = JSON.parse(localStorage.getItem(ACCESS_TOKEN))
			? JSON.parse(localStorage.getItem(ACCESS_TOKEN))
			: "";

		let data = {
			...localValues,
			discount: localValues.discount * 1,
			slug: localValues.name,
			price: localValues.price * 1,
			number: localValues.number * 1,
			specifications,
		};
		console.log(data);
		if (urls?.file && file?.name) {
			if (urls.file.replace(URL_IMAGE, "").trim("/") !== file.name) {
				let formData = new FormData();
				formData.append("file", file);
				const uploadImage = await fetch(API_UPLOAD_IMAGE, {
					method: "POST",
					headers: { Authorization: "Bearer " + token },
					body: formData,
				});
				const response = await uploadImage.json();
				if (response.status === 200) {
					const payload = { image: response.data.name };
					pathNameSplit[2] !== "add"
						? await fetchData(`${API_ADMIN_PRODUCT}/${pathNameSplit[2]}`, payload, "POST", true).then(
								(res) => {}
						  )
						: (data.image = response.data.name);
				}
			}
		}
		const imagesPayload = [];
		let checkFileChange = 0;
		for (const file in files) {
			if (files[file]?.name && files[file].name !== urls[file].replace(URL_IMAGE, "").trim("/")) {
				const formData = new FormData();
				formData.append("file", files[file]);
				const uploadImage = await fetch(API_UPLOAD_IMAGE, {
					method: "POST",
					headers: { Authorization: "Bearer " + token },
					body: formData,
				});
				const response = await uploadImage.json();
				response.status = 200 && imagesPayload.push(response.data.name);
				checkFileChange = 1;
			} else {
				urls[file] && imagesPayload.push(urls[file].replace(URL_IMAGE, "").trim("/"));
			}
		}
		!!checkFileChange && pathNameSplit[2] !== "add"
			? await fetchData(`${API_ADMIN_PRODUCT}/${pathNameSplit[2]}`, { images: imagesPayload }, "POST", true).then(
					(res) => {}
			  )
			: (data.images = imagesPayload);
		console.log(data);
		await fetchData(`${API_ADMIN_PRODUCT}/${pathNameSplit[2]}`, data, "POST", true).then((res) => {
			if (res.status === 200) {
				handleClickVariant("success", res.messenger, enqueueSnackbar);
				navigate("/product");
			}
		});
	}

	return (
		<Paper style={{ padding: "20px" }}>
			{pathNameSplit[2] && pathNameSplit[2] !== "add" && (
				<Tabs value={tab} onChange={(e, value) => setTab(value)}>
					<Tab value={1} label="THÔNG TIN"></Tab>
					<Tab value={2} label="BÌNH LUẬN"></Tab>
				</Tabs>
			)}

			{tab === 1 && (
				<Grid container spacing={4} style={{ marginTop: "20px" }}>
					<Grid item xs={12}>
						<div style={{ display: "flex", flexDirection: "row-reverse" }}>
							<Button
								variant="contained"
								color="error"
								onClick={() => {
									dispatch(actions.setReload(new Date() * 1));
									navigate("/product");
								}}
							>
								Hủy bỏ
							</Button>
							<div style={{ margin: "0 5px" }}></div>
							<Button variant="contained" onClick={() => handleSave()}>
								Lưu
							</Button>
						</div>
					</Grid>
					<Grid item xs={12}>
						<Box>
							<Typography variant="h6" style={{ marginBottom: "5x" }}>
								Thông tin chính
							</Typography>
							<Grid container spacing={2}>
								<Grid item xs={6}>
									<TextField
										fullWidth
										label="Tên sản phẩm"
										value={localValues.name}
										onChange={(e) => handleInputMainChange("name", e.target.value)}
									></TextField>
								</Grid>
								<Grid item xs={3}>
									<TextField
										fullWidth
										label="Giá sản phẩm"
										type="number"
										value={localValues.price}
										onChange={(e) => handleInputMainChange("price", e.target.value)}
									></TextField>
								</Grid>
								<Grid item xs={3}>
									<TextField
										fullWidth
										label="Giảm giá"
										type="number"
										value={localValues.discount}
										onChange={(e) => handleInputMainChange("discount", e.target.value)}
									></TextField>
								</Grid>

								<Grid item xs={3}>
									<TextField
										select
										fullWidth
										value={localValues.type}
										label="Loại sản phẩm"
										onChange={(e) => handleInputMainChange("type", e.target.value)}
									>
										<MenuItem value={0}>Điện thoại</MenuItem>
										<MenuItem value={1}>Phụ kiện</MenuItem>
									</TextField>
								</Grid>
								{localValues.type === 1 ? (
									<Grid item xs={3}>
										<TextField
											fullWidth
											value={localValues.typeAccessory}
											label="Loại phụ kiện"
											select
											onChange={(e) => handleInputMainChange("typeAccessory", e.target.value)}
										>
											{typeAccessory.map((item) => (
												<MenuItem key={item.id} value={item.id}>
													{item.value}
												</MenuItem>
											))}
										</TextField>
									</Grid>
								) : (
									""
								)}

								<Grid item xs={3}>
									<TextField
										select
										fullWidth
										label="Thương hiệu"
										value={localValues.brandId}
										onChange={(e) => handleInputMainChange("brandId", e.target.value)}
									>
										{brands.map((item) => (
											<MenuItem key={item.value} value={item.value}>
												{item.name}
											</MenuItem>
										))}
									</TextField>
								</Grid>

								<Grid item xs={3}>
									<TextField
										fullWidth
										label="Số lượng còn"
										type="number"
										value={localValues.number}
										onChange={(e) => handleInputMainChange("number", e.target.value)}
									></TextField>
								</Grid>
								<Grid item xs={3}>
									<TextField
										select
										fullWidth
										label="Trạng Thái"
										value={localValues.status}
										onChange={(e) => handleInputMainChange("status", e.target.value)}
									>
										<MenuItem value={1}>Hoạt động</MenuItem>
										<MenuItem value={0}>Ngừng hoạt động</MenuItem>
									</TextField>
								</Grid>
								<Grid item xs={3}>
									<Grid container spacing={2}>
										<Grid item xs={12}>
											<InputUploadImage label={"Chọn ảnh"}>
												<Button
													variant="contained"
													component="label"
													style={{ marginBottom: "5px" }}
												>
													Upload
													<input
														hidden
														accept="image/*"
														multiple
														type="file"
														onChange={(e) => {
															setUrls((prev) =>
																e.target.files[0]
																	? {
																			...prev,
																			file: URL.createObjectURL(
																				e.target.files[0]
																			),
																	  }
																	: prev
															);
															setFile(e.target.files[0]);
														}}
													/>
												</Button>

												{(urls.file || file) && (
													<img
														alt=""
														src={urls.file}
														onClick={(e) =>
															handleImageClick({ open: true, image: e.target.currentSrc })
														}
														style={{ width: " 100%", height: "100%" }}
													/>
												)}
											</InputUploadImage>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</Box>
					</Grid>

					<Grid item xs={12}>
						<Box>
							<Typography variant="h6" style={{ marginBottom: "20px" }}>
								Mô tả sản phẩm
							</Typography>
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<CKEditor
										style={{ height: "200px", minHeight: "200px" }}
										editor={ClassicEditor}
										data={localValues.description ? localValues.description : ""}
										onReady={(editor) => {
											// You can store the "editor" and use when it is needed.
											console.log("Editor is ready to use!", editor);
										}}
										onChange={(event, editor) => {
											const data = editor.getData();
											handleInputMainChange("description", data);
										}}
									/>
								</Grid>
							</Grid>
						</Box>
					</Grid>
					{localValues.type === 0 && (
						<Grid item xs={12}>
							<Box>
								<Typography variant="h6" style={{ marginBottom: "20px" }}>
									Thông số
								</Typography>
								<Grid container spacing={2}>
									<Grid item xs={4}>
										<TextField
											fullWidth
											label="RAM"
											value={getValueFiled("ram")}
											onChange={(e) => handleSpecificationsChange("ram", e.target.value)}
										></TextField>
									</Grid>
									<Grid item xs={4}>
										<TextField
											fullWidth
											label="ROM"
											value={getValueFiled("rom")}
											onChange={(e) => handleSpecificationsChange("rom", e.target.value)}
										></TextField>
									</Grid>
									<Grid item xs={4}>
										<TextField
											fullWidth
											label="Camera trước"
											value={getValueFiled("front_camera")}
											onChange={(e) => handleSpecificationsChange("front_camera", e.target.value)}
										></TextField>
									</Grid>
									<Grid item xs={4}>
										<TextField
											fullWidth
											label="Camera sau"
											value={getValueFiled("rear_camera")}
											onChange={(e) => handleSpecificationsChange("rear_camera", e.target.value)}
										></TextField>
									</Grid>
									<Grid item xs={4}>
										<TextField
											fullWidth
											label="Chip"
											value={getValueFiled("chip")}
											onChange={(e) => handleSpecificationsChange("chip", e.target.value)}
										></TextField>
									</Grid>
									<Grid item xs={4}>
										<TextField
											fullWidth
											label="Màn hình"
											value={getValueFiled("display")}
											onChange={(e) => handleSpecificationsChange("display", e.target.value)}
										></TextField>
									</Grid>
									<Grid item xs={4}>
										<TextField
											fullWidth
											label="Hệ điều hành"
											value={getValueFiled("system")}
											onChange={(e) => handleSpecificationsChange("system", e.target.value)}
										></TextField>
									</Grid>
									<Grid item xs={4}>
										<TextField
											fullWidth
											label="Sim"
											value={getValueFiled("sim")}
											onChange={(e) => handleSpecificationsChange("sim", e.target.value)}
										></TextField>
									</Grid>
									<Grid item xs={4}>
										<TextField
											fullWidth
											label="Pin"
											value={getValueFiled("battery")}
											onChange={(e) => handleSpecificationsChange("battery", e.target.value)}
										></TextField>
									</Grid>
								</Grid>
							</Box>
						</Grid>
					)}

					<Grid item xs={12}>
						<Box>
							<Typography variant="h6" style={{ marginBottom: "20px" }}>
								Hình ảnh chi tiết
							</Typography>
							<Grid container spacing={2}>
								<Grid item xs={6}>
									<Grid container spacing={2}>
										<Grid item xs={8}>
											<InputUploadImage label={"Chọn ảnh"}>
												<Button
													variant="contained"
													component="label"
													style={{ marginBottom: "5px" }}
												>
													Upload
													<input
														hidden
														accept="image/*"
														multiple
														type="file"
														onChange={(e) => handleFilesChange("file1", e.target.files[0])}
													/>
												</Button>
												{urls.file1 && (
													<img
														alt=""
														src={urls.file1}
														onClick={(e) =>
															handleImageClick({ open: true, image: e.target.currentSrc })
														}
														style={{ width: " 100%" }}
													/>
												)}
											</InputUploadImage>
										</Grid>
										{/* <Grid item xs={8}>
                    <TextField
                      fullWidth
                      type="file"
                      InputLabelProps={{ shrink: true }}
                      label="Chọn ảnh"
                      onChange={(e) => handleFilesChange("file1", e.target.files[0])}
                    ></TextField>
                  </Grid>
                  <Grid item xs={4}>
                    <img
                      alt=""
                      src={urls.file1}
                      onClick={(e) => handleImageClick({ open: true, image: e.target.currentSrc })}
                      style={{ width: " 100%" }}
                    />
                  </Grid> */}
									</Grid>
								</Grid>
								<Grid item xs={6}>
									<Grid container spacing={2}>
										<Grid item xs={8}>
											<InputUploadImage label={"Chọn ảnh"}>
												<Button
													variant="contained"
													component="label"
													style={{ marginBottom: "5px" }}
												>
													Upload
													<input
														hidden
														accept="image/*"
														multiple
														type="file"
														onChange={(e) => handleFilesChange("file2", e.target.files[0])}
													/>
												</Button>
												{urls.file2 && (
													<img
														alt=""
														src={urls.file2}
														onClick={(e) =>
															handleImageClick({ open: true, image: e.target.currentSrc })
														}
														style={{ width: " 100%" }}
													/>
												)}
											</InputUploadImage>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={6}>
									<Grid container spacing={2}>
										<Grid item xs={8}>
											<InputUploadImage label={"Chọn ảnh"}>
												<Button
													variant="contained"
													component="label"
													style={{ marginBottom: "5px" }}
												>
													Upload
													<input
														hidden
														accept="image/*"
														multiple
														type="file"
														onChange={(e) => handleFilesChange("file3", e.target.files[0])}
													/>
												</Button>
												{urls.file3 && (
													<img
														alt=""
														src={urls.file3}
														onClick={(e) =>
															handleImageClick({ open: true, image: e.target.currentSrc })
														}
														style={{ width: " 100%" }}
													/>
												)}
											</InputUploadImage>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={6}>
									<Grid container spacing={2}>
										<Grid item xs={8}>
											<InputUploadImage label={"Chọn ảnh"}>
												<Button
													variant="contained"
													component="label"
													style={{ marginBottom: "5px" }}
												>
													Upload
													<input
														hidden
														accept="image/*"
														multiple
														type="file"
														onChange={(e) => handleFilesChange("file4", e.target.files[0])}
													/>
												</Button>
												{urls.file4 && (
													<img
														alt=""
														src={urls.file4}
														onClick={(e) =>
															handleImageClick({ open: true, image: e.target.currentSrc })
														}
														style={{ width: " 100%" }}
													/>
												)}
											</InputUploadImage>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={6}>
									<Grid container spacing={2}>
										<Grid item xs={8}>
											<InputUploadImage label={"Chọn ảnh"}>
												<Button
													variant="contained"
													component="label"
													style={{ marginBottom: "5px" }}
												>
													Upload
													<input
														hidden
														accept="image/*"
														multiple
														type="file"
														onChange={(e) => handleFilesChange("file5", e.target.files[0])}
													/>
												</Button>
												{urls.file5 && (
													<img
														alt=""
														src={urls.file5}
														onClick={(e) =>
															handleImageClick({ open: true, image: e.target.currentSrc })
														}
														style={{ width: " 100%" }}
													/>
												)}
											</InputUploadImage>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={6}>
									<Grid container spacing={2}>
										<Grid item xs={8}>
											<InputUploadImage label={"Chọn ảnh"}>
												<Button
													variant="contained"
													component="label"
													style={{ marginBottom: "5px" }}
												>
													Upload
													<input
														hidden
														accept="image/*"
														multiple
														type="file"
														onChange={(e) => handleFilesChange("file6", e.target.files[0])}
													/>
												</Button>
												{urls.file6 && (
													<img
														alt=""
														src={urls.file6}
														onClick={(e) =>
															handleImageClick({ open: true, image: e.target.currentSrc })
														}
														style={{ width: " 100%" }}
													/>
												)}
											</InputUploadImage>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</Box>
					</Grid>
				</Grid>
			)}
			{tab === 2 && <CommentPage idProduct={pathNameSplit[2]}></CommentPage>}
			<Dialog
				open={dialogImage.open}
				fullWidth
				maxWidth={"lg"}
				onClose={() => setDialogImage((prev) => ({ ...prev, open: false }))}
			>
				<img alt="" src={dialogImage.image ? dialogImage.image : ""} />
			</Dialog>
		</Paper>
	);
}

export default ProductEdit;
