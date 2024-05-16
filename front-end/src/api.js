export const URL = "http://localhost:8000/api/v1";
export const URL_IMAGE = "http://127.0.0.1:8000/media";

export const API_FILES = `${URL}/files`;

export const API_UPLOAD_FILE = `${API_FILES}/upload-file`;

export const API_ADMIN_LOGIN = `${URL}/admin/login`;


export const API_ADMIN = `${URL}/admin`;
export const API_ADMIN_PRODUCT = `${API_ADMIN}/product`;

export const API_ADMIN_BRAND = `${API_ADMIN}/brand`;

export const API_ADMIN_ORDER = `${URL}/order/admin`;

export const API_ADMIN_COMMENT = `${URL}/comment/admin`;

export const API_ADMIN_CUSTOMER = `${URL}/user/admin`;



// export const API_ADMIN_GET_BRAND = `${API_ADMIN_PRODUCT}/get-brand`;

export const API_GET_ONE_PRODUCT = `${API_ADMIN_PRODUCT}/get-one-product`;
export const API_ADD_BRAND = `${API_ADMIN_BRAND}/add`;
export const API_DASHBOARD = `${API_ADMIN_PRODUCT}/dashboard`;
export const API_GET_ALL_BRAND_FOR_PRODUCT = `${API_ADMIN_PRODUCT}/get-all-brand-product`;
export const API_ADD_PRODUCT = `${API_ADMIN_PRODUCT}/add-product`;

export const API_GET_ONE_COMMENT = `${API_ADMIN_COMMENT}/get-one-comment`;
export const API_UPDATE_COMMENT = `${API_ADMIN_COMMENT}/update-comment`;

export const API_GET_ONE_CUSTOMER = `${API_ADMIN_CUSTOMER}/get-one-customer`;
export const API_ADD_CUSTOMER = `${API_ADMIN_CUSTOMER}/add-customer`;

export const API_GET_ONE_ORDER = `${API_ADMIN_ORDER}/get-one-order`;
export const API_ADD_ORDER = `${API_ADMIN_ORDER}/add-order`;
