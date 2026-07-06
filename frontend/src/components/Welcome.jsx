import Lotties from "react-lottie";
import animationData from "../assets/lottie-json.json";
const Welcome = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const Lottie = Lotties.default;
  return (
    <div
      className={`md:flex hidden flex-col justify-center items-center w-full h-screen`}
    >
      {" "}
      <Lottie
        options={defaultOptions}
        height={120}
        width={120}
        isClickToPauseDisabled={true}
      />
      <h2 className="text-2xl text-white font-bold">
        Hi <span className="text-violet-600">!</span> Welcome to{" "}
        <span className="text-violet-600">Syncronusly</span> Chat App
      </h2>
    </div>
  );
};

export default Welcome;
