import styles from "./InputUploadImage.module.scss"
import classNames from "classnames/bind";
const cx = classNames.bind(styles)
function InputUploadImage({label,children}) {
  return (
    <div className={cx("wrapper")} >
      <label
       className={cx("label")}
      >
        {label ? label : "Ảnh"}
      </label>
      <div className={cx("children")}>{children}</div>
    </div>
  );
}

export default InputUploadImage;
