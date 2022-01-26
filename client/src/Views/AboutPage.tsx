import { FC } from "react";
import {
  PrinterIcon,
  ShieldCheckIcon,
  ChartSquareBarIcon,
} from "@heroicons/react/outline";

interface AboutPageProps {}

export const AboutPage: FC<AboutPageProps> = () => {
  return (
    <div
      className="bg-cover bg-no-repeat bg-center"
      style={{ backgroundImage: "url('https://picsum.photos/1920/1080')" }}
    >
      <div className="absolute inset-0 bg-slate-500/60 backdrop-blur-sm"></div>
      <div className="relative p-3 container mx-auto">
        <h1 className="text-white text-6xl md:text-8xl font-light text-center mt-12 mb-6 font-serif">
          About Page
        </h1>
        <h2 className="text-white text-4xl md:text-5xl font-bold text-center my-3 font-serif">
          Work with an amazing tool
        </h2>
        <h3 className="text-slate-100 text-3xl text-center my-3">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates
          consectetur sapiente nesciunt eligendi repellendus! Praesentium
          quisquam, labore vitae, ratione ullam et ducimus, voluptate beatae
          dolor in est dignissimos nesciunt repellendus?
        </h3>
        <div className="bg-white dark:bg-slate-900 text-black dark:text-white mt-12 rounded-xl p-3">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:w-2/3 mx-auto">
            <div className="text-center p-3">
              <ShieldCheckIcon className="w-24 text-blue-600 mx-auto"></ShieldCheckIcon>
              <h4 className="text-xl font-semibold font-mono">Some things</h4>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta
                placeat blanditiis aperiam natus eum cum incidunt, consequatur
                beatae voluptas accusamus tempora aliquid magni nemo possimus.
                Blanditiis fugiat totam ratione alias.
              </p>
            </div>
            <div className="text-center p-3">
              <PrinterIcon className="w-24 text-purple-600 mx-auto"></PrinterIcon>
              <h4 className="text-xl font-semibold font-mono">Some things</h4>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta
                placeat blanditiis aperiam natus eum cum incidunt, consequatur
                beatae voluptas accusamus tempora aliquid magni nemo possimus.
                Blanditiis fugiat totam ratione alias.
              </p>
            </div>
            <div className="text-center p-3">
              <ChartSquareBarIcon className="w-24 text-yellow-600 mx-auto"></ChartSquareBarIcon>
              <h4 className="text-xl font-semibold font-mono">Some things</h4>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta
                placeat blanditiis aperiam natus eum cum incidunt, consequatur
                beatae voluptas accusamus tempora aliquid magni nemo possimus.
                Blanditiis fugiat totam ratione alias.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
