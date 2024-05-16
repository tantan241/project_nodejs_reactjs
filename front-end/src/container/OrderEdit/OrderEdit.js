// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import CKEditor from 'react-ckeditor-component';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { API_ADD_ORDER, API_ADMIN_PRODUCT, API_GET_ONE_ORDER } from "~/api";
import { fetchData, handleClickVariant } from "~/common";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
import useStore from "~/store/hooks";
import { actions } from "~/store";
import { Add } from "@mui/icons-material";
import List from "~/components/List/List";
import { enqueueSnackbar } from "notistack";

function OrderEdit() {
  const navigate = useNavigate();
  const [store, dispatch] = useStore();
  const [pdfUrl, setPdfUrl] = useState("");
  const [localValues, setLocalValues] = useState({
    id: "",
    name: "",
    phone: "",
    email: "",
    address: "",
    note: "",
    totalMoney: "",
    createdAt: "10/10/2010",
    status: 0,
    order_method: "",
    user: "",
    orderDetail: [],
  });
  const [openDialog, setOpenDialog] = useState({
    dialogNumber: false,
    dialogAddProduct: false,
    dialogDeleteProduct: false,
  });
  const [product, setProduct] = useState({});
  const [numberBuy, setNumberBuy] = useState(0);
  const [idProductChoose, setIdProductChoose] = useState(0);
  const pathNameSplit = window.location.pathname ? window.location.pathname.split("/") : ["", "", ""];
  useEffect(() => {
    if (pathNameSplit[2] && pathNameSplit[2] !== "add") {
      fetchData(`${API_GET_ONE_ORDER}?id=${pathNameSplit[2]}`, {}, "GET", true).then((res) => {
        if (res.status === 200) {
          console.log(moment(res.data.createdAt).format("DD/MM/YYYY"));
          setLocalValues({ ...res.data, createdAt: moment(res.data.createdAt).format("YYYY-MM-DD") });
        }
      });
    }
  }, []);
  const handleInputChange = useCallback((name, value) => {
    setLocalValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleCreatePdf = () => {
    let totalMoney = 0
    localValues.orderDetail.forEach((item) => {
      totalMoney+=(item.number * item.price)
    })
    const input = ` <div style="width: 65%;  height: 1800px; padding: 50px 50px 0; line-height: 1.8;font-size: 15pt;"> <div style="font-weight: 700; text-align: center; font-size: 28pt"> CỬA HÀNG ĐIỆN THOẠI VÀ PHỤ KIỆN TÂN MOBILE </div> <div style="text-align: right">Ngày: ${moment().format(
      "DD-MM-YYYY"
    )}</div> <div style="font-weight: 500; text-align: center; font-size: 18pt ">HÓA ĐƠN THANH TOÁN</div> <div>Khách hàng: ${
      localValues.name
    }</div> <div>Điện thoại: ${localValues.phone}</div> <div style="margin: 10px 0"></div>${localValues.orderDetail
      .map(
        (item) =>
          `<div> <div style="border-top: 1px dashed rgb(0, 0, 0)"></div> <div>${
            item.name
          }</div> <div style="display: flex; flex-direction: row-reverse"> <div style="width: 150px">${item.price
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")} vnđ</div> <div style="margin: 0 30px"></div> <div>${
            item.number
          }</div> </div> </div>`
      )
      .join(
        ""
      )}   <div style="margin: 10px 0"></div> <div style="border-top: 1px dashed rgb(0, 0, 0)"></div> <div style="display: flex; flex-direction: row-reverse"> <div>${parseInt(
      totalMoney
    )
      .toString()
      .replace(
        /\B(?=(\d{3})+(?!\d))/g,
        "."
      )} vnđ</div> <div style="margin: 0 20px"></div> <div>Tổng tiền thanh toán</div> </div> <div style="display: flex"> <div>Số hóa đơn:</div> <div style="margin: 0 2px"></div> <div style="font-weight: 700">${
      localValues.id
    }</div> </div> <div>Ngày: ${moment().format("DD-MM-YYYY")}</div> <div>NV lập hóa đơn: NV1</div> </div> `;

    const div = document.querySelector(".order");
    div.style.display = "flex";
    div.style.justifyContent = "center";
    div.innerHTML = input;
    // document.body.appendChild(div);
    html2canvas(div).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
      const pdfBlob = pdf.output("blob");
      setPdfUrl(URL.createObjectURL(pdfBlob));
      div.style.display = "none";

      // document.body.removeChild(div);
    });
  };
  const handleSave = useCallback(() => {
    let totalMoney = 0;
    localValues.orderDetail.forEach((item) => {
      totalMoney = parseFloat(totalMoney + item.number * item.price);
    });
    const dataPost = {
      ...localValues,
      orderDetail: localValues.orderDetail.map((item) => ({ ...item, number: item.number * 1 })),
      totalMoney,
    };
    fetchData(API_ADD_ORDER, dataPost, "POST", true).then((res) => {
      if (res.status === 200) {
        handleClickVariant("success", res.messenger, enqueueSnackbar);
        navigate("/order");
      }
    });
  }, [localValues]);
  const handleBuyProduct = useCallback(() => {
    let orderDetail = localValues.orderDetail;
    const haveProduct =
      orderDetail.length > 0 ? localValues.orderDetail.find((item) => item.product_id === product.id) : "";
    if (haveProduct && Object.keys(haveProduct).length > 0) {
      orderDetail = orderDetail.map((item) =>
        item.product_id === product.id ? { ...item, number: (item.number * 1 + numberBuy * 1).toString() } : item
      );
    } else {
      const productBuy = { ...product, number: numberBuy, product_id: product.id };
      orderDetail.push(productBuy);
    }
    setLocalValues((prev) => ({
      ...prev,
      orderDetail,
    }));
    setOpenDialog({ dialogNumber: false, dialogAddProduct: false });
    handleClickVariant("success", "Thêm thành công", enqueueSnackbar);
    setPdfUrl("")
  }, [product, numberBuy]);
  const handDeleteOrderDetail = useCallback(() => {
    let orderDetail = localValues.orderDetail;
    orderDetail = orderDetail.filter((item) => item.product_id !== idProductChoose);

    setLocalValues((prev) => ({ ...prev, orderDetail }));
    setOpenDialog((prev) => ({ ...prev, dialogDeleteProduct: false }));
    handleClickVariant("success", "Xóa thành công", enqueueSnackbar);
  }, [localValues, idProductChoose]);
  return (
    <Paper style={{ padding: "20px" }}>
      {" "}
      <Box>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <div style={{ display: "flex", flexDirection: "row-reverse" }}>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  // dispatch(actions.setReload(new Date() * 1));
                  navigate("/order");
                }}
              >
                Hủy bỏ
              </Button>
              <div style={{ margin: "0 5px" }}></div>
              <Button
                variant="contained"
                onClick={() => {
                  dispatch(actions.setReload(new Date() * 1));
                  handleSave();
                }}
              >
                Lưu
              </Button>
            </div>
          </Grid>
          <Grid item xs={4}>
            <TextField
              select
              label="Trạng thái đơn hàng"
              fullWidth
              value={localValues.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
            >
              <MenuItem value={0}> Đang xử lý</MenuItem>
              <MenuItem value={2}> Giao hàng thành công</MenuItem>
              <MenuItem value={1}> Đang giao hàng</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={4}>
            <TextField
              label={"Họ tên người nhận"}
              fullWidth
              value={localValues.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            ></TextField>
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Số điện thoại"
              fullWidth
              value={localValues.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            ></TextField>
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Email"
              fullWidth
              value={localValues.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            ></TextField>
          </Grid>
          <Grid item xs={4}>
            <TextField
              format="DD/MM/YYYY"
              label="Ngày lập"
              fullWidth
              type="date"
              InputLabelProps={{ shrink: true }}
              value={localValues.createdAt}
              onChange={(e) => setLocalValues((prev) => ({ ...prev, createdAt: e.target.value }))}
            ></TextField>
          </Grid>
          <Grid item xs={4}></Grid>
          <Grid item xs={6}>
            <TextField
              label="Địa chỉ nhận hàng"
              multiline
              rows={3}
              fullWidth
              value={localValues.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
            ></TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Ghi chú"
              multiline
              rows={3}
              fullWidth
              value={localValues.note}
              onChange={(e) => handleInputChange("note", e.target.value)}
            ></TextField>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>Chi tiết sản phẩm</div>
                <Fab
                  color="primary"
                  size="small"
                  onClick={() => {
                    setOpenDialog((prev) => ({ ...prev, dialogAddProduct: true }));
                  }}
                >
                  <Tooltip title="Thêm mới">
                    <Add></Add>
                  </Tooltip>
                </Fab>
              </div>
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>STT</TableCell>
                  <TableCell>Tên sản phẩm</TableCell>
                  <TableCell>Số lượng</TableCell>
                  <TableCell>Thành tiền</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {localValues.orderDetail &&
                  localValues.orderDetail.map((item, index) => (
                    <TableRow>
                      <TableCell>{index + 1}</TableCell>

                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.number}</TableCell>
                      <TableCell>
                        {(item.price * item.number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                      </TableCell>
                      <TableCell>
                        <Fab color="error" size="small" style={{ marginRight: "10px" }}>
                          <Tooltip
                            title="Xóa"
                            onClick={() => {
                              setIdProductChoose(item.product_id);
                              setOpenDialog((prev) => ({ ...prev, dialogDeleteProduct: true }));
                            }}
                          >
                            <DeleteIcon></DeleteIcon>
                          </Tooltip>
                        </Fab>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Grid>
          <Grid item xs={12}>
            <Box>
              <Typography variant="h6" style={{ marginBottom: "20px" }}>
                Hóa đơn
              </Typography>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={() => handleCreatePdf()}>
                  Tạo hóa đơn
                </Button>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {pdfUrl && (
                    <iframe
                      src={pdfUrl}
                      width={"100%"}
                      height={"800px"}
                      style={{overflow: "hidden"}}
                      allowfullscreen
                      title="Hóa đơn"
                    ></iframe>
                  )}
                  <div className="order"></div>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Dialog
        open={openDialog.dialogAddProduct}
        fullWidth
        maxWidth={"xl"}
        onClose={() => setOpenDialog((prev) => ({ ...prev, dialogAddProduct: false }))}
      >
        <DialogTitle>Thêm mới sản phẩm</DialogTitle>
        <DialogContent>
          <div style={{ width: "100%", marginLeft: "20px" }}>
            <List
              height={500}
              model={"product"}
              url={API_ADMIN_PRODUCT}
              // mapFunction={mapFunction}
              disableCheckbox
              disableAdd
              limit={100}
              skip={5}
              rowsPerPageOptions={[10, 30, 100]}
              customAction={(params) => (
                <div style={{ textAlign: "center" }}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setProduct({
                        id: params.row.id,
                        name: params.row.name,
                        discount: params.row.discount,
                        price: params.row.price - (params.row.price * params.row.discount) / 100,
                        number: 0,
                        order_id: pathNameSplit[2] * 1,
                      });
                      setOpenDialog((prev) => ({ ...prev, dialogNumber: true }));
                    }}
                  >
                    Mua
                  </Button>
                </div>
              )}
            ></List>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openDialog.dialogNumber}
        onClose={() => setOpenDialog((prev) => ({ ...prev, dialogNumber: false }))}
      >
        <DialogTitle>Nhập số lượng</DialogTitle>
        <DialogContent>
          <div style={{ padding: "10px" }}>
            <TextField
              label="Nhập số lượng"
              type="number"
              value={numberBuy}
              onChange={(e) => setNumberBuy(e.target.value)}
            ></TextField>
            <div style={{ textAlign: "right", marginTop: "10px", display: "flex", justifyContent: "flex-end" }}>
              <Button size="small" color="primary" variant="contained" onClick={() => handleBuyProduct()}>
                Đồng ý
              </Button>
              <div style={{ margin: "0 2px" }}></div>
              <Button
                size="small"
                color="error"
                variant="outlined"
                onClick={() => setOpenDialog((prev) => ({ ...prev, dialogNumber: false }))}
              >
                Hủy bỏ
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openDialog.dialogDeleteProduct}
        onClose={() => setOpenDialog((prev) => ({ ...prev, dialogDeleteProduct: false }))}
      >
        <DialogTitle>Bạn có chắc chắn muốn xóa?</DialogTitle>
        <DialogContent>
          <div style={{ padding: "10px" }}>
            <div style={{ textAlign: "right", marginTop: "10px", display: "flex", justifyContent: "flex-end" }}>
              <Button size="small" color="primary" variant="contained" onClick={() => handDeleteOrderDetail()}>
                Đồng ý
              </Button>
              <div style={{ margin: "0 2px" }}></div>
              <Button
                size="small"
                color="error"
                variant="outlined"
                onClick={() => setOpenDialog((prev) => ({ ...prev, dialogDeleteProduct: false }))}
              >
                Hủy bỏ
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Paper>
  );
}

export default OrderEdit;
