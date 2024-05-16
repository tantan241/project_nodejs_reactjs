import { useCallback } from "react";
import { API_ADMIN_ORDER } from "~/api";
import List from "~/components/List/List";
import moment from "moment";
function OrderPage() {
  const mapFunction = useCallback((data) => {
    return data.map((item) => ({
      ...item,
      status: item.status == 1 ? "Hoạt động" : "Ngừng hoạt động",
      createdAt: item.createdAt ? moment(item.createdAt).format("DD-MM-YYYY") : "",
      totalMoney: item.totalMoney
        ? `${parseInt(item.totalMoney)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")} vnđ`
        : "0 vnđ",
    }));
  }, []);
  return (
    <div style={{ width: "90%", marginLeft: "20px" }}>
      <List
        height={500}
        model={"order"}
        url={API_ADMIN_ORDER}
        mapFunction={mapFunction}
        limit={100}
        skip={5}
        rowsPerPageOptions={[10, 30, 100]}
      ></List>
    </div>
  );
}

export default OrderPage;
