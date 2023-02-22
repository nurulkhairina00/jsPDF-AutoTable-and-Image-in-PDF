import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
export default function Index() {
  let [data, setData] = useState([]);
  let [hasil, setHasil] = useState([]);
  let [image, setImage] = useState("");
  let temp = [];

  const getBase64Image = async (url) => {
    let data = await fetch(url);
    let blob = await data.blob();
    return new Promise((resolve) => {
      let reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => {
        let base64data = reader.result;
        resolve(base64data);
        setImage(base64data);
      };
    });
  };

  const isi = () => {
    temp = [];
    data.forEach((item, index) => {
      let data_ = [index + 1, item.name, item.username, item.email, item.phone, item.website];
      temp.push(data_);
    });
    setHasil(temp);
  };

  const generate = () => {
    if (data.length === 0) {
      const doc = new jsPDF("p", "pt", "a4");
      let pageWidth = doc.internal.pageSize.getWidth();
      doc.setFontSize(8);
      doc.setFont(undefined, "normal");
      doc.text("DATA DOESN'T EXIST", pageWidth / 2, 80, "center");
    } else {
      const doc = new jsPDF("p", "pt", "a4");
      doc.autoTable({ html: "#my-table" });
      let pageWidth = doc.internal.pageSize.getWidth();
      for (let i = 0; i < data.length; i++) {
        doc.addImage(image, "PNG", 20, 10, 70, 65);
        doc.setFontSize(12);
        doc.setFont(undefined, "bold");
        doc.text("COMPANY CIPTA ADIL", pageWidth / 2, 40, "center");
        doc.setFontSize(11);
        doc.setFont(undefined, "bold");
        doc.text("EMPLOYEE DATA", pageWidth / 2, 60, "center");
        doc.line(10, 85, pageWidth - 10, 85);
        doc.line(10, 87, pageWidth - 10, 87);
        doc.autoTable({
          theme: "grid",
          margin: { top: 95, horizontal: 10 },
          startY: 95,
          headStyles: {
            minCellHeight: 10,
            valign: "middle",
            halign: "center",
          },
          styles: { overflow: "linebreak", columnWidth: "wrap" },
          head: [["NO", "NAME", "USERNAME", "EMAIL", "PHONE", "WEBSITE"]],
          columnStyles: {
            0: { cellWidth: 30, halign: "center" },
            1: { cellWidth: 110, halign: "left" },
            2: { cellWidth: 95, halign: "left" },
            3: { cellWidth: 130, halign: "left" },
            4: { cellWidth: 120, halign: "left" },
            5: { cellWidth: 90, halign: "left" },
          }, // Cells in first column centered and green
          didPareCell: function (cell) {
            console.log(cell);
            if (cell.row.section === "head") {
              cell.cell.styles.fillColor = 255;
              cell.cell.styles.lineColor = 10;
              cell.cell.styles.lineWidth = 0.1;
            } else if (cell.cell.section === "body") {
              cell.cell.styles.fillColor = 255;
              cell.cell.styles.textColor = 25;
              cell.cell.styles.lineColor = 10;
              cell.cell.styles.lineWidth = 0.1;
            }
          },
          body: hasil,
        });

        window.open(doc.output("bloburl"), "_blank");
      }
    }
  };

  const getAllData = () => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        throw err;
      });
  };

  useEffect(() => {
    getAllData();
    getBase64Image(`http://localhost:3000/karyawan.png`);
    isi();
  }, [data]);

  return (
    <>
      <div style={{ display: "none", zoom: "0.45" }}>
        <table id="my-table" style={{ width: "100%", fontSize: "9px" }}></table>
      </div>
      <h2 className="m-3">PDF USING JSPDF AUTOTABLE</h2>
      <button id="back" type="button" onClick={generate} className="btn btn-primary rounded my-3">
        Print PDF
      </button>
    </>
  );
}
