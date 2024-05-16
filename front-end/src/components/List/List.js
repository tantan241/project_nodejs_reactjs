import { Add } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  IconButton,
  MenuItem,
  Pagination,
  TablePagination,
  TextField,
  Tooltip,
} from "@mui/material";
import { DataGrid, GridPagination, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import "./List.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCallback, useEffect, useRef, useState } from "react";
import { fetchData, handleClickVariant } from "~/common";
import CloseIcon from "@mui/icons-material/Close";
import { enqueueSnackbar } from "notistack";
function CustomFooter(props) {
  const { count, page, handleChangePage, rowsPerPage, handleChangeRowsPerPage, rowsPerPageOptions } = props;
  return (
    <TablePagination
      component="div"
      labelRowsPerPage="Số dòng hiện thị"
      count={count}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      rowsPerPageOptions={rowsPerPageOptions}
    />
  );
}

function List(props) {
  const {
    height,
    url,
    mapFunction,
    rowsPerPageOptions,
    model,
    actions,
    cellCustom,
    disableAdd,
    customEdit,
    reloadOut,
    disableCheckbox,
    customAction,
  } = props;
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [rowsSelect, setRowsSelect] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [typeInputSearch, setTypeInputSearch] = useState({ type: "text", value: [] });
  const [fieldSearch, setFieldSearch] = useState("default");
  const [valueSearch, setValueSearch] = useState("default");
  const [dataSearch, setDataSearch] = useState([]);
  const [dataFilter, setDataFilter] = useState([]);
  const [reload, setReload] = useState(0);
  // const [sortModel, setSortModel] = useState([]);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [oneRowDelete, setOneRowDelete] = useState("");
  const [clickDeleteMultiple, setClickDeleteMultiple] = useState(false);
  const navigate = useNavigate();
  const [openDialogSearch, setOpenDialogSearch] = useState(false);
  const [openDialogFilter, setOpenDialogFilter] = useState(false);
  const [filter, setFilter] = useState({
    field: "",
    sort: "asc",
  });
  const [dataPrev, setDataPrev] = useState({
    fieldSearch: "default",
    valueSearch: "default",
    filter: {
      field: "",
      sort: "asc",
    },
  });
  const fakeData = [
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

  // Xóa
  const handleCloseDialogDelete = useCallback(() => {
    setOpenDialogDelete(false);
  }, []);
  const deleteRows = useCallback((data) => {
    let ids = [];
    if (Array.isArray(data)) {
      data.forEach((item) => {
        ids.push(item.id);
      });
    } else {
      ids.push(data.id);
    }

    ids = JSON.stringify(ids);
    fetchData(`${url}/${model}/delete?ids=${ids}`, {}, "DELETE", true).then((res) => {
      if (res.status === 200) {
        setReload(new Date() * 1);
        setOpenDialogDelete(false);
        handleClickVariant(res.status === 200 ? "success" : "error", res.messenger, enqueueSnackbar);
      }
    });
  }, []);
  //

  const handleFieldSearchChange = useCallback(
    (value) => {
      setFieldSearch(value);
      const data = dataSearch.find((item) => item.value === value);
    //   if (data.type === "select") {
    //     setTypeInputSearch({ type: "select", value: data.select });
    //   } else {
    //     setTypeInputSearch({ type: "text", value: [] });
    //   }
    setTypeInputSearch({ type: data.type, value: [] });
    },
    [dataSearch]
  );
  const handleFieldFilterChange = useCallback(
    (name, value) => {
      setFilter((prev) => ({ ...prev, [name]: value }));
    },

    []
  );
  const handleSearch = useCallback(() => {
    setReload(new Date() * 1);
    setPage(0);
    handleCloseDialogSearch();
  }, [valueSearch, fieldSearch]);
  const handleFilter = useCallback(() => {
    setPage(0);
    setReload(new Date() * 1);
    handleCloseDialogFilter();
  }, []);
  useEffect(() => {
    const body = {
      limit: rowsPerPage,
      page: page,
      search: { field: fieldSearch, value: valueSearch, type: typeInputSearch.type },
      sort: filter,
    };
    setDataPrev({
      fieldSearch,
      valueSearch,
      filter,
    });
    fetchData(`${url}/${model}`, body, "POST", true).then((res) => {
      if (res.status === 200) {
        setPageInfo(res.pageInfo);
        setDataSearch(res.dataSearch);
        setDataFilter(res.dataFilter);
        let columns = res.columns;

        columns.push({
          field: "action",
          headerName: "Hành  động",
          description: "Hành động",
          sortable: false,
          flex: 0.9,
          filterable: false,
          renderCell: actions
            ? actions
            : (params) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div>{params.value}</div>
                  {customAction ? (
                    customAction(params)
                  ) : (
                    <div style={{ marginLeft: "auto", display: "flex" }}>
                      {customEdit ? (
                        customEdit(params)
                      ) : (
                        <Fab size="small" color="primary">
                          <IconButton aria-label="edit" onClick={() => navigate(`${params.row.id}`)}>
                            <EditIcon style={{ color: "white" }} />
                          </IconButton>
                        </Fab>
                      )}

                      <div style={{ margin: "0 4px" }}></div>
                      <Fab size="small" color="error">
                        <IconButton
                          aria-label="delete"
                          onClick={() => {
                            setClickDeleteMultiple(false);
                            setOneRowDelete(params.row);
                            setOpenDialogDelete(true);
                          }}
                        >
                          <DeleteIcon style={{ color: "white" }} />
                        </IconButton>
                      </Fab>
                    </div>
                  )}
                </div>
              ),
        });
        if (cellCustom) {
          if (cellCustom.field && cellCustom.data) {
            columns = columns.map((item) =>
              item.field === cellCustom.field ? { ...item, renderCell: cellCustom.data } : item
            );
          }
        }
        setColumns(columns);
        let rowsList = res.rows;
        if (mapFunction && typeof mapFunction === "function") {
          rowsList = mapFunction(rowsList);
        }
        setRows(rowsList);
      }
    });
  }, [url, rowsPerPage, page, mapFunction, model, reload, reloadOut]);
  const handleSelectionModelChange = useCallback(
    (newSelectionModel) => {
      const selectedRows = rows.filter((row) => newSelectionModel.includes(row.id));

      setRowsSelect(selectedRows);
    },
    [rows]
  );

  const handleCloseDialogSearch = useCallback(() => {
    setOpenDialogSearch(false);
  }, []);
  const handleCloseDialogFilter = useCallback(() => {
    setOpenDialogFilter(false);
  }, []);
  return (
    <div style={{ height: height, padding: "10px", width: "100%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {dataSearch.length > 0 && (
            <>
              <Button color="primary" variant="contained" size="small" onClick={() => setOpenDialogSearch(true)}>
                Tìm kiếm
              </Button>
              <div style={{ margin: "0 5px" }}></div>
              <Button color="primary" variant="contained" size="small" onClick={() => setOpenDialogFilter(true)}>
                Sắp xếp
              </Button>
              {dataPrev.fieldSearch !== "default" && valueSearch !== "default" && (
                <Button
                  size="small"
                  onClick={() => {
                    setFieldSearch("default");
                    setValueSearch("default");
                    setPage(0);
                    setReload(new Date() * 1);
                  }}
                >
                  <CloseIcon></CloseIcon>
                  Xóa tìm kiếm
                </Button>
              )}
              {dataPrev.filter.field !== "" && (
                <Button
                  size="small"
                  onClick={() => {
                    setFilter({
                      field: "",
                      sort: "asc",
                    });
                    setPage(0);
                    setReload(new Date() * 1);
                  }}
                >
                  <CloseIcon></CloseIcon>
                  Xóa sắp xếp
                </Button>
              )}
            </>
          )}
        </div>
        <div>
          {rowsSelect.length > 0 && (
            <Fab
              color="error"
              size="small"
              style={{ marginRight: "10px" }}
              onClick={() => {
                setClickDeleteMultiple(true);
                setOpenDialogDelete(true);
              }}
            >
              <Tooltip title="Xóa">
                <DeleteIcon></DeleteIcon>
              </Tooltip>
            </Fab>
          )}
          {disableAdd ? (
            ""
          ) : (
            <Link to={`${window.location.pathname}/add`}>
              <Fab color="primary" size="small">
                <Tooltip title="Thêm mới">
                  <Add></Add>
                </Tooltip>
              </Fab>
            </Link>
          )}
        </div>
      </div>

      <DataGrid
        
        column={{ xs: 12, md: 6 }}
        autoHeight={true}
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        checkboxSelection={disableCheckbox ? false : true}
        onRowSelectionModelChange={handleSelectionModelChange}
        hideFooterPagination
        disableColumnMenu
        components={{
          Footer: () => (
            <CustomFooter
              count={pageInfo.count}
              rowsPerPage={rowsPerPage}
              page={page}
              handleChangeRowsPerPage={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              handleChangePage={(e, newPage) => setPage(newPage)}
              rowsPerPageOptions={rowsPerPageOptions}
            ></CustomFooter>
          ),
        }}
      />

      <Dialog open={openDialogDelete} onClose={handleCloseDialogDelete}>
        <DialogTitle>Bạn có chắc chắn muốn xóa?</DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              if (clickDeleteMultiple) {
                deleteRows(rowsSelect);
              } else {
                deleteRows(oneRowDelete);
              }
            }}
          >
            Xóa
          </Button>
          <Button variant="outlined" autoFocus onClick={handleCloseDialogDelete}>
            Quay lại
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDialogSearch}
        onClose={() => {
          handleCloseDialogSearch();
          setValueSearch(dataPrev.valueSearch);
          setFieldSearch(dataPrev.fieldSearch);
        }}
      >
        <DialogTitle>Tìm kiếm</DialogTitle>

        <DialogActions style={{ width: "500px", margin: "30px" }}>
          {dataSearch.length > 0 && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  select
                  label="Trường tìm kiếm"
                  value={fieldSearch}
                  onChange={(e) => handleFieldSearchChange(e.target.value)}
                >
                  {dataSearch.map((option, index) => (
                    <MenuItem key={index} value={option.value}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                {typeInputSearch.type === "select" ? (
                  <TextField
                    size="small"
                    fullWidth
                    select
                    label="Giá trị tìm kiếm"
                    value={valueSearch}
                    // style={{ margin: "0 10px" }}
                    onChange={(e) => {
                      setValueSearch(e.target.value);
                    }}
                  >
                    {typeInputSearch.value.map((option, index) => (
                      <MenuItem key={index} value={option.value}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                ) : (
                  <TextField
                    fullWidth
                    label="Giá trị tìm kiếm"
                    variant="outlined"
                    size="small"
                    // style={{ margin: "0 10px" }}
                    value={valueSearch === "default" ? "" : valueSearch}
                    onChange={(e) => {
                      setValueSearch(e.target.value);
                    }}
                  />
                )}
              </Grid>
              <Grid item xs={12}>
                <div style={{ textAlign: "center" }}>
                  <Button
                    color="primary"
                    variant="contained"
                    size="small"
                    onClick={handleSearch}
                    style={{ marginRight: "5px" }}
                  >
                    Tìm kiếm
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    autoFocus
                    onClick={() => {
                      handleCloseDialogSearch();
                      setValueSearch(dataPrev.valueSearch);
                      setFieldSearch(dataPrev.fieldSearch);
                    }}
                    style={{ marginLeft: "5px" }}
                  >
                    Quay lại
                  </Button>
                </div>
              </Grid>
            </Grid>
          )}
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDialogFilter}
        onClose={() => {
          handleCloseDialogSearch();
          setFilter(dataPrev.filter);
        }}
      >
        <DialogTitle>Sắp xếp sản phẩm</DialogTitle>

        <DialogActions style={{ width: "500px", margin: "30px" }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                select
                label="Trường sắp xếp"
                value={filter.field}
                onChange={(e) => handleFieldFilterChange("field", e.target.value)}
              >
                {dataFilter.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                size="small"
                fullWidth
                select
                label="Sắp xếp theo"
                value={filter.sort}
                onChange={(e) => {
                  handleFieldFilterChange("sort", e.target.value);
                }}
              >
                <MenuItem value={"desc"}>Giảm dần</MenuItem>
                <MenuItem value={"asc"}>Tăng dần</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <div style={{ textAlign: "center" }}>
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  onClick={handleFilter}
                  style={{ marginRight: "5px" }}
                >
                  Sắp xếp
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  autoFocus
                  onClick={() => {
                    handleCloseDialogFilter();
                    setFilter(dataPrev.filter);
                  }}
                  style={{ marginLeft: "5px" }}
                >
                  Quay lại
                </Button>
              </div>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default List;
