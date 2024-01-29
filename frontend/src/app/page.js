"use client";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
axios.defaults.withCredentials = true;
export default function Home() {
  const router = useRouter();
  const [clik, setclik] = useState(false);
  const [fitur, setfitur] = useState();
  const [file, setfile] = useState();
  const [url, seturl] = useState();

  const fill = [
    "grayScale",
    "Kontras",
    "brightness",
    "mirror",
    "scalling",
    "deteksi tepi",
    "thresholding",
    "operasi Ketetanggaan",
    "degradasi",
  ];

  const post = () => {
    if (file && fitur) {
      const formData = new FormData();
      formData.append("operation", fitur);
      formData.append("file", file);
      axios.post("http://localhost:3000/api", formData).then((res) => {
        router.push(`http://localhost:5000/${res.data.msg.fileloc}`);
      });
    }
  };

  return (
    <main className="flex min-h-screen p-24 flex-col items-center justify-between">
      <div>
        <p className="text-3xl text-center font-bold">
          Tubes Pengolahan Citra pada Gambar Berbasis Web
        </p>
        <div className="m-auto ">
          <Image
            alt="logo"
            width={0}
            height={0}
            sizes="100vw"
            style={{
              width: "100%",
              height: "100%",
            }}
            className={`mx-auto py-10`}
            src={url ? url : "/img.jpeg"}
          ></Image>
        </div>
        <div className="relative group">
          <button
            id="dropdown-button"
            className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
            onClick={() => (clik ? setclik(false) : setclik(true))}
          >
            <span className="mr-2">{fitur ? fitur : "Pilih Fitur"}</span>
            {fitur ? (
              ""
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 ml-2 -mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
          <div
            id="dropdown-menu"
            className={`${
              clik ? "" : "hidden"
            } w-full absolute right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1 space-y-1 h-32 containers`}
          >
            {fill.map((e, i) => (
              <button
                key={i}
                onClick={() => {
                  fitur === e ? setfitur("") : setfitur(e);
                  setclik(false);
                }}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md w-full text-left"
              >
                {e}
              </button>
            ))}
          </div>
        </div>
        <div className="w-full py-10">
          <label>
            File
            <input
              type="file"
              className="w-full p-2 my-5 border border-gray-300 rounded-lg"
              fdprocessedid="false"
              onChange={({ target }) => {
                if (target.files) {
                  const file = target.files[0];
                  seturl(URL.createObjectURL(file));
                  setfile(file);
                }
              }}
            />
          </label>
        </div>
        <button
          onClick={() => post()}
          className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
        >
          <span className="mr-2">Jalakan</span>
        </button>
      </div>
    </main>
  );
}
