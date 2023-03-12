const Contributors = () => {
  return (
    <>
      <div className="w-full my-8 flex flex-col justify-center items-center">
        <h2 className="border-t pt-8 px-8 text-xl text-center text-gray-500 font-mono">
          <span className="text-2xl mr-2">👨‍💻👩‍💻</span>Contributors
        </h2>
      </div>
      <div className="w-full sm:px-10">
        <p className="mb-8">
          Contributions are what make the open-source community such an amazing place to learn, inspire, and create. We greatly appreciate
          any contributions you make. Thank you for being a part of our community! 🥰
        </p>
        <a className="block w-full" href="https://github.com/usememos/memos/graphs/contributors" target="_blank">
          <img
            className="w-full h-auto"
            src="https://camo.githubusercontent.com/d644b7675b4cea5a7282ff942198092dd4a6e20764661a72e62674619d6c6b23/68747470733a2f2f636f6e747269622e726f636b732f696d6167653f7265706f3d7573656d656d6f732f6d656d6f73"
            alt=""
          />
        </a>
      </div>
    </>
  );
};

export default Contributors;
