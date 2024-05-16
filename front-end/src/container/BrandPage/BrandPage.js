import { useCallback } from "react";
import { API_ADMIN } from "~/api";
import List from "~/components/List/List";

function BrandPage() {
  const mapFunction = useCallback((data) => {
    return data.map((item) => ({
      ...item,
      status: item.status == 1 ? "Hoạt động" : "Ngừng hoạt động",
    }));
  }, []);
  return (
    <div style={{ width: "90%", marginLeft: "20px" }}>
      <List
        height={500}
        model={"brand"}
        url={API_ADMIN}
        mapFunction={mapFunction}
        limit={100}
        skip={5}
        rowsPerPageOptions={[10, 30, 100]}
      ></List>
    </div>
  );
}

export default BrandPage;
