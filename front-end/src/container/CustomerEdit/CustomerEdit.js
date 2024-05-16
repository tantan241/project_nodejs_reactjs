import { Button, Grid, Paper, TextField } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_ADD_CUSTOMER, API_GET_ONE_CUSTOMER } from "~/api";
import { fetchData, handleClickVariant } from "~/common";
import { actions } from "~/store";
import useStore from "~/store/hooks";

function CustomerEdit() {
  const navigate = useNavigate();
  const [store, dispatch] = useStore();
  const [localValues, setLocalValues] = useState({ fullName: "", email: "", phone: "", address: "" });
  const pathNameSplit = window.location.pathname ? window.location.pathname.split("/") : ["", "", ""];
  useEffect(() => {
    if (pathNameSplit[2] && pathNameSplit[2] !== "add") {
      fetchData(`${API_GET_ONE_CUSTOMER}?id=${pathNameSplit[2]}`, {}, "GET", true).then((res) => {
        if (res.status === 200) {
          setLocalValues(res.data);
        }
      });
    }
  }, []);
  const handleInputChange = useCallback((name, value) => {
    setLocalValues((prev) => ({ ...prev, [name]: value }));
  }, []);
  const handleSave = useCallback(() => {
    fetchData(API_ADD_CUSTOMER, localValues, "POST", true).then((res) => {
      if (res.status === 200) {
        handleClickVariant("success", res.messenger, enqueueSnackbar);
        navigate("/customer");
      }
    });
  }, [localValues]);
  return (
    <Paper style={{ padding: "20px" }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <div style={{ display: "flex", flexDirection: "row-reverse" }}>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                navigate("/customer");
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
            label="Họ và tên"
            value={localValues.fullName}
            fullWidth
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            type="text"
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
            label="Số điện thoại"
            value={localValues.phone}
            fullWidth
            onChange={(e) => handleInputChange("phone", e.target.value)}
          ></TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Địa chỉ"
            multiline
            value={localValues.address}
            rows={3}
            fullWidth
            onChange={(e) => handleInputChange("address", e.target.value)}
          ></TextField>
        </Grid>
        {pathNameSplit[2] !== "add" && (
          <>
            <Grid item xs={2}>
              <TextField
                label="Số đơn mua"
                disabled
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={localValues.number_order || 0}
              ></TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Tổng số tiền mua"
                disabled
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={
                  localValues.total_price
                    ? `${localValues.total_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ`
                    : "0.00 VNĐ"
                }
              ></TextField>
            </Grid>
          </>
        )}
      </Grid>
    </Paper>
  );
}

export default CustomerEdit;
