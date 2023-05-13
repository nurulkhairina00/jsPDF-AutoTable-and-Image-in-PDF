import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import moment from "moment/moment";
export default function Index() {
  let [data, setData] = useState([]);
  let [hasil, setHasil] = useState([]);
  let temp = [];

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
        doc.addImage("/karyawan.png", "PNG", 20, 10, 70, 65);
        doc.setFontSize(16);
        doc.setFont(undefined, "bold");
        doc.text("COMPANY CIPTA ADIL", pageWidth / 2, 40, "center");

        doc.setFontSize(14);
        doc.setFont(undefined, "bold");
        doc.text("EMPLOYEE DATA", pageWidth / 2, 60, "center");

        doc.line(10, 85, pageWidth - 10, 85);
        doc.line(10, 87, pageWidth - 10, 87);

        doc.setFontSize(10);
        doc.setFont(undefined, "normal");
        doc.text("Tanggal cetak : " + moment().format("DD MMMM YYYY"), pageWidth - 140, 103);
        doc.autoTable({
          theme: "grid",
          margin: { top: 115, horizontal: 10 },
          startY: 115,
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
          },
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
          // didDrawCell: (cell) => {
          //   if (cell.row.text[0] === "") {
          //     let img = `http://localhost:3000/karyawan.png`;
          //     doc.addImage(img, "PNG", cell.cell.x + 10, cell.cell.y + 10, 180, 30);
          //   }
          // },
          body: hasil,
        });

        doc.setFontSize(10);
        doc.setFont(undefined, "normal");
        doc.text("Demikian nama nama pegawai company cipta adil yang tertera.", 40, doc.autoTable.previous.finalY + 20);

        // number page
        let pageCount = doc.internal.getNumberOfPages();
        let pageHeight = doc.internal.pageSize.getHeight();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);

          doc.setFontSize(10);
          doc.setFont(undefined, "normal");
          doc.text("" + i, pageWidth - 35, pageHeight - 15);
        }

        window.open(doc.output("bloburl"), "_blank"); // tab baru
        // doc.save("List-Pegawai.pdf"); // auto download pdf
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
