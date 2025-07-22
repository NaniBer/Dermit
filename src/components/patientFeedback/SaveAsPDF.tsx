// SaveAsPDF.tsx
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface ConsultationData {
  patientName: string;
  //   age: number;
  //   gender: string;
  doctorName: string;
  date: string;
  observations: string;
  diagnosis: string;
  treatmentPlan: string;
  //   notes: string;
}

const SaveAsPDF = ({ data }: { data: ConsultationData }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    const input = contentRef.current;
    if (!input) return;

    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("consultation-summary.pdf");
  };

  return (
    <>
      {/* Hidden PDF content */}
      <div
        ref={contentRef}
        style={{ position: "absolute", left: "-9999px", top: 0 }} // hidden offscreen
        className="w-full max-w-2xl bg-white p-8 rounded shadow-lg text-gray-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <img src="/DermitLong.png" alt="Dermit Logo" className="w-48 h-14" />
        </div>

        {/* Patient Info */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Patient Info</h2>
          <p>
            <strong>Name:</strong> {data.patientName}
          </p>
          {/* <p>
            <strong>Age:</strong> {data.age}
          </p>
          <p>
            <strong>Gender:</strong> {data.gender}
          </p> */}
        </div>

        {/* Consultation Summary */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Consultation Summary</h2>
          <p>
            <strong>Doctor:</strong> {data.doctorName}
          </p>
          <p>
            <strong>Date:</strong> {data.date}
          </p>

          <div className="mt-4">
            <p>
              <strong>📝 Observations:</strong> {data.observations}
            </p>
            <p>
              <strong>🩺 Diagnosis:</strong> {data.diagnosis}
            </p>
            <p>
              <strong>💊 Treatment Plan:</strong>
            </p>
            <ul className="list-disc pl-6 mt-1">{data.treatmentPlan}</ul>
          </div>
        </div>

        {/* Additional Notes */}

        {/* Footer */}
        <div className="pt-4 mt-6 border-t text-xs text-gray-500 text-center">
          <p>
            Thank you for choosing Dermit. This report is confidential and
            intended solely for patient use.
          </p>
        </div>
      </div>

      {/* Just the Button */}
      <button
        className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
        onClick={handleDownload}
      >
        Save as PDF
      </button>
    </>
  );
};

export default SaveAsPDF;
