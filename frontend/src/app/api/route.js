import { NextResponse } from "next/server";
export async function POST(request) {
  try {
    const formData = await request.formData();
    const uploadResponse = await fetch("http://localhost:5000/photo", {
      method: "POST",
      body: formData,
    });
    const uploadedImageData = await uploadResponse.json();

    return NextResponse.json(
      { msg: uploadedImageData },
      {
        headers: {
          status: 200,
          "Content-Security-Policy-Report-Only":
            "default-src 'none'; img-src 'self'",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { msg: "error" },
      {
        headers: {
          status: 400,
          "Content-Security-Policy-Report-Only":
            "default-src 'none'; img-src 'self'",
        },
      }
    );
  }
}
