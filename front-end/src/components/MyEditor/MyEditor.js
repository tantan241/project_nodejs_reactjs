// import React, { useState, useEffect, useRef } from "react";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// const MyEditor = () => {
//   const [editorData, setEditorData] = useState(
//     '<section><div> <div style="border-top: 1px dashed rgb(0, 0, 0)"></div> <div>Điện thoại Điện thoại Điện thoại Điện thoại Điện thoại Điện thoại Điện thoại Điện thoại</div> <div style="display: flex; flex-direction: row-reverse"> <div>5,990,990</div> <div style="margin: 0 20px"></div> <div>1</div> </div> </div></section>'
//   );
//   const editorRef = useRef(null);

//   const handleEditorChange = (event, editor) => {
//     const data = editor.getData();
//     setEditorData(data);
//   };

//   return (
//     <CKEditor
//       editor={ClassicEditor}
//       data={editorData}
//       onChange={handleEditorChange}
//       ref={editorRef}

//       onReady={(editor) => {
//         editor.model.schema.register("div", { inheritAllFrom: "$block" });
//         editor.conversion.elementToElement({ model: "div", view: "div" });
//       }}
//     />
//   );
// };

import React, { useState } from "react";
// import { PDFViewer, PDFDownloadLink, Document, Page } from "@react-pdf/renderer";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Document, Page } from "react-pdf";

const MyPdfViewer = () => {
  const [pdfUrl, setPdfUrl] = useState("");

  const handleDownloadPdf = () => {
    const input = document.getElementById("pdf-content");
    console.log(input);
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
      const pdfBlob = pdf.output("blob");
      console.log(URL.createObjectURL(pdfBlob));
      setPdfUrl(URL.createObjectURL(pdfBlob));
    });
  };

  return (
    <div>
      <div style={{ display: "block" }} id="pdf-content">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            lineHeight: "1.5",
            fontSize: "13pt",
          }}
        >
          <div style={{ width: "300pt", backgroundColor: "aqua", minHeight: "100vh", padding: "50px 90px" }}>
            <div style={{ fontWeight: 700, textAlign: "center", fontSize: "20px" }}>
              CỬA HÀNG ĐIỆN THOẠI VÀ PHỤ KIỆN TÂN MOBILE
            </div>
            <div style={{ textAlign: "right" }}>Ngày: 20-04-2023</div>
            <div style={{ fontWeight: 500, textAlign: "center", fontSize: "18px" }}>HÓA ĐƠN THANH TOÁN</div>
            <div>Khách hàng: VŨ VIẾT TÂN</div>
            <div>Điện thoại: 09000000000</div>
            <div style={{ margin: "10px 0" }}></div>
            <div>
              <div style={{ borderTop: "1px dashed rgb(0, 0, 0)" }}></div>
              <div>Điện thoại Điện thoại Điện thoại Điện thoại Điện thoại Điện thoại Điện thoại Điện thoại</div>
              <div style={{ display: "flex", flexDirection: "row-reverse" }}>
                <div>5,990,990</div>
                <div style={{ margin: "0 20px" }}></div>
                <div>1</div>
              </div>
            </div>
            <div>
              <div style={{ borderTop: "1px dashed rgb(0, 0, 0)" }}></div>
              <div>Điện thoại Điện thoại Điện thoại Điện thoại Điện thoại Điện thoại Điện thoại Điện thoại</div>
              <div style={{ display: "flex", flexDirection: " row-reverse" }}>
                <div>5,990,990</div>
                <div style={{ margin: "0 20px" }}></div>
                <div>1</div>
              </div>
            </div>
            <div style={{ margin: " 10px 0" }}></div>
            <div style={{ borderTop: " 1px dashed rgb(0, 0, 0)" }}></div>
            <div style={{ display: "flex", flexDirection: "row-reverse" }}>
              <div>5,990,900</div>
              <div style={{ margin: " 0 20px " }}></div>
              <div>Tổng tiền thanh toán</div>
            </div>
            <div style={{ display: "flex" }}>
              <div>Số hóa đơn:</div>
              <div style={{ margin: " 0 2px" }}></div>
              <div style={{ fontWeight: 700 }}>666666666</div>
            </div>
            <div>Ngày: 20-04-2023</div>
            <div>NV lập hóa đơn: Vũ Viết Tân</div>
          </div>
        </div>
      </div>
      <button onClick={handleDownloadPdf}>Download PDF</button>
      {pdfUrl && <iframe src={pdfUrl} allowfullscreen></iframe>}
    </div>
  );
};

export default MyPdfViewer;
