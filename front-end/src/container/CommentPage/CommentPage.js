import { Box, Button, Dialog, DialogTitle, Fab, Grid, IconButton, MenuItem, TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { API_ADMIN_COMMENT, API_GET_ONE_COMMENT, API_UPDATE_COMMENT, URL_IMAGE } from "~/api";
import List from "~/components/List/List";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment";
import { fetchData, handleClickVariant } from "~/common";
import { enqueueSnackbar } from "notistack";

function CommentPage(props) {
  const { idProduct } = props;
  const [dialog, setDialog] = useState({ image: false, comment: false });
  const [urlImage, setUrlImage] = useState("");
  const [comment, setComment] = useState({});
  const [reload, setReload] = useState(0);
  const [data, setData] = useState({});
  useEffect(() => {
    fetchData(`${API_ADMIN_COMMENT}/${idProduct}/get-info-comment`, {}, "GET", true).then((res) => {
      if (res.status === 200) {
        setData(res.data);
      }
    });
  }, [idProduct]);
  const mapFunction = useCallback((data) => {
    return data.map((item) => ({
      ...item,
      status: item.status === 1 ? "Hiện thị" : "Không hiện thị",
      createdAt: item.createdAt ? moment(item.createdAt).format("DD-MM-YYYY") : "",
    }));
  }, []);
  const getDataCommet = useCallback((id) => {
    fetchData(`${API_GET_ONE_COMMENT}?id=${id}`, {}, "GET", true).then((res) => {
      if (res.status === 200) {
        setComment(res.data);
      }
    });
  }, []);
  const updateComment = useCallback(
    (id) => {
      fetchData(`${API_UPDATE_COMMENT}`, comment, "POST", true).then((res) => {
        if (res.status === 200) {
          handleClickVariant("success", res.messenger, enqueueSnackbar);

          setDialog((prev) => ({ ...prev, comment: false }));
          setReload(new Date() * 1);
        }
      });
    },
    [comment]
  );

  return (
    <Box marginTop={"20px"}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Grid container spacing={4} alignItems={"center"}>
            <Grid item xs={4}>
              <img width={"200px"} height={"200px"} src={data.image ? `${URL_IMAGE}/${data.image}` : ""} alt="" />
              <p>{data?.name}</p>
            </Grid>
            <Grid item xs={8}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <div style={{ display: "flex" }}>
                    <div>Tổng số đánh giá: &nbsp;</div>
                    <div>{data?.totalComment} đánh giá</div>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div style={{ display: "flex" }}>
                    <div>Trung bình sao đánh giá: &nbsp;</div>
                    <div>{data?.avg}</div>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div style={{ display: "flex" }}>
                    <div>Số đánh giá 5 sao: &nbsp;</div>
                    <div> {data?.star_5} đánh giá</div>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div style={{ display: "flex" }}>
                    <div>Số đánh giá 4 sao:&nbsp;</div>
                    <div> {data?.star_4} đánh giá</div>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div style={{ display: "flex" }}>
                    <div>Số đánh giá 3 sao:&nbsp;</div>
                    <div> {data?.star_3} đánh giá</div>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div style={{ display: "flex" }}>
                    <div>Số đánh giá 2 sao:&nbsp;</div>
                    <div> {data?.star_2} đánh giá</div>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div style={{ display: "flex" }}>
                    <div>Số đánh giá 1 sao:&nbsp;</div>
                    <div> {data?.star_1} đánh giá</div>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <List
            height={500}
            model={"comment"}
            url={`${API_ADMIN_COMMENT}/${idProduct}`}
            mapFunction={mapFunction}
            limit={100}
            skip={5}
            rowsPerPageOptions={[10, 30, 100]}
            reloadOut={reload}
            customEdit={(params) => (
              <Fab
                size="small"
                color="primary"
                onClick={() => {
                  getDataCommet(params.row.id);
                  setDialog((prev) => ({ ...prev, comment: true }));
                }}
              >
                <IconButton aria-label="edit">
                  <EditIcon style={{ color: "white" }} />
                </IconButton>
              </Fab>
            )}
            cellCustom={{
              field: "image",
              data: (params) => (
                <img
                  width={"60%"}
                  alt=""
                  src={`${URL_IMAGE}/${params.value}`}
                  onClick={() => {
                    setDialog((prev) => ({ ...prev, image: true }));
                    setUrlImage(`${URL_IMAGE}/${params.value}`);
                  }}
                />
              ),
            }}
            disableAdd
          ></List>
        </Grid>
      </Grid>
      <Dialog
        open={dialog.image}
        onClose={() => {
          setDialog((prev) => ({ ...prev, image: false }));
        }}
        maxWidth={"lg"}
      >
        <DialogTitle>Hình ảnh chi tiết</DialogTitle>
        <div style={{ margin: "20px" }}>
          <img width={"80%"} height={"100%"} alt="Hình ảnh comment" src={urlImage} />
        </div>
      </Dialog>
      <Dialog
        maxWidth={"lg"}
        open={dialog.comment}
        onClose={() => {
          setDialog((prev) => ({ ...prev, comment: false }));
        }}
      >
        <DialogTitle>Nhận xét</DialogTitle>
        <Grid container spacing={2} style={{ padding: "20px 50px" }}>
          <Grid item xs={8}>
            <div style={{ padding: "20px" }}>{comment?.content ? comment?.content : ""}</div>
          </Grid>
          <Grid item xs={4}>
            {comment.image ? (
              <img
                width={"80%"}
                height={"100%"}
                alt="Hình ảnh comment"
                src={comment.image ? `${URL_IMAGE}/${comment.image}` : ""}
              />
            ) : (
              <div>Nhận xét không có hình ảnh</div>
            )}
          </Grid>
          <Grid item xs={8}></Grid>
          <Grid item xs={4}>
            <Grid container spacing={2} alignItems={"center"}>
              <Grid item xs={5}>
                <div>Trạng thái: </div>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  value={parseInt(comment.status)}
                  size="small"
                  select
                  onChange={(e) => setComment((prev) => ({ ...prev, status: e.target.value }))}
                >
                  <MenuItem value={1}>Hiện Thị</MenuItem>
                  <MenuItem value={0}>Không Hiện Thị</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <div style={{ display: "flex", flexDirection: "row-reverse" }}>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => {
                  setDialog((prev) => ({ ...prev, comment: false }));
                }}
              >
                Hủy bỏ
              </Button>
              <div style={{ margin: "0 4px" }}></div>
              <Button variant="contained" size="small" onClick={() => updateComment()}>
                Lưu
              </Button>
            </div>
          </Grid>
        </Grid>
      </Dialog>
    </Box>
  );
}

export default CommentPage;
